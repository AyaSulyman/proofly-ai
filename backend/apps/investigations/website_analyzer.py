"""Small, SSRF-safe public website inspector used by investigation analysis."""

import ipaddress
import socket
import ssl
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse

import requests

MAX_BYTES = 1_500_000
TIMEOUT = (5, 20)

headers = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 Chrome/125 Safari/537.36 "
        "ProoflySafetyScanner/1.0"
    ),
    "Accept": "text/html,application/xhtml+xml",
    "Accept-Language": "en-US,en;q=0.9",
}

class _PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.description = ""
        self.forms = 0
        self.password_fields = 0
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta" and values.get("name", "").lower() == "description":
            self.description = values.get("content", "")[:500]
        elif tag == "form":
            self.forms += 1
        elif tag == "input" and values.get("type", "").lower() == "password":
            self.password_fields += 1

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title = (self.title + " " + data).strip()[:300]


def normalize_public_url(value: str) -> str:
    value = (value or "").strip()
    if not value:
        raise ValueError("A website URL is required.")
    if "://" not in value:
        value = "https://" + value
    parsed = urlparse(value)
    if parsed.scheme not in ("http", "https") or not parsed.hostname or parsed.username or parsed.password:
        raise ValueError("Enter a valid public HTTP or HTTPS URL.")
    return parsed.geturl()


def _assert_public_host(url: str) -> None:
    host = urlparse(url).hostname
    if not host:
        raise ValueError("The URL has no host.")
    try:
        addresses = {item[4][0] for item in socket.getaddrinfo(host, None)}
    except socket.gaierror as exc:
        raise ValueError("The website domain could not be resolved.") from exc
    if not addresses:
        raise ValueError("The website domain could not be resolved.")
    for address in addresses:
        ip = ipaddress.ip_address(address)
        if not ip.is_global:
            raise ValueError("Private, local, reserved, and link-local websites cannot be scanned.")


def inspect_website(raw_url: str) -> tuple[dict, list[str]]:
    """Fetch a bounded public page, rechecking every redirect for SSRF safety."""
    current = normalize_public_url(raw_url)
    response = None
    session = requests.Session()
    headers = {"User-Agent": "ProoflySafetyScanner/1.0 (+website investigation)"}
    for _ in range(5):
        _assert_public_host(current)
        response = session.get(current, headers=headers, timeout=TIMEOUT, allow_redirects=False, stream=True)
        if response.is_redirect or response.is_permanent_redirect:
            location = response.headers.get("location")
            if not location:
                break
            current = urljoin(current, location)
            continue
        break
    if response is None:
        raise ValueError("The website could not be reached.")
    response.raise_for_status()
    content_type = response.headers.get("content-type", "").lower()
    if "text/html" not in content_type:
        raise ValueError("The URL did not return an HTML website.")
    chunks, size = [], 0
    for chunk in response.iter_content(65536):
        size += len(chunk)
        if size > MAX_BYTES:
            raise ValueError("The website page is too large to inspect safely.")
        chunks.append(chunk)
    parser = _PageParser()
    parser.feed(b"".join(chunks).decode(response.encoding or "utf-8", errors="replace"))
    parsed = urlparse(current)
    security_headers = {
        key: bool(response.headers.get(header))
        for key, header in {
            "contentSecurityPolicy": "content-security-policy",
            "strictTransportSecurity": "strict-transport-security",
            "frameProtection": "x-frame-options",
            "contentTypeProtection": "x-content-type-options",
        }.items()
    }
    tls_valid = parsed.scheme == "https"
    if tls_valid:
        try:
            context = ssl.create_default_context()
            with socket.create_connection((parsed.hostname, parsed.port or 443), timeout=4) as sock:
                with context.wrap_socket(sock, server_hostname=parsed.hostname):
                    pass
        except (OSError, ssl.SSLError):
            tls_valid = False
    signals = []
    if parsed.scheme != "https" or not tls_valid:
        signals.append("insecure_website")
    if parser.password_fields and parsed.scheme != "https":
        signals.append("password_form_without_https")
    if not security_headers["contentSecurityPolicy"]:
        signals.append("missing_security_headers")
    snapshot = {
        "requestedUrl": raw_url,
        "finalUrl": current,
        "domain": parsed.hostname,
        "statusCode": response.status_code,
        "title": parser.title,
        "description": parser.description,
        "forms": parser.forms,
        "passwordFields": parser.password_fields,
        "https": parsed.scheme == "https",
        "tlsValid": tls_valid,
        "securityHeaders": security_headers,
    }
    return snapshot, signals
