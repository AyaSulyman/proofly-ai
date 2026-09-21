export function ConsumerIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 150 190" className={className} xmlns="http://www.w3.org/2000/svg">
      <rect width="150" height="190" rx="16" fill="#F8EEE9" />
      <path d="M52 44 Q75 10 98 44 Q99 63 75 63 Q51 63 52 44 Z" fill="#3B2A20" />
      <circle cx="75" cy="46" r="20" fill="#F0C29B" />
      <rect x="68" y="60" width="14" height="12" fill="#F0C29B" />
      <path d="M55 72 L95 72 L112 172 Q75 186 38 172 Z" fill="#7B2637" />
      <path d="M55 72 Q75 84 95 72 L100 90 Q75 100 50 90 Z" fill="#F0D9D6" />
      <path d="M40 96 Q28 112 34 132 L46 128 Q42 112 52 100 Z" fill="#F0C29B" />
      <path d="M100 88 Q118 96 118 118 L128 148 L112 152 L104 120 Q98 104 92 96 Z" fill="#F0C29B" />
      <rect x="103" y="140" width="26" height="42" rx="5" fill="#42151D" transform="rotate(8 103 140)" />
      <rect x="107" y="146" width="18" height="26" rx="2" fill="#F8EEE9" transform="rotate(8 107 146)" />
      <path
        d="M112 156 l3 4 l6 -8"
        stroke="#1E9E6B"
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="rotate(8 112 156)"
      />
      <ellipse cx="56" cy="182" rx="12" ry="5" fill="#3B2A20" />
      <ellipse cx="96" cy="184" rx="12" ry="5" fill="#3B2A20" />
      <circle cx="30" cy="40" r="15" fill="#fff" stroke="#E8C7A7" strokeWidth="2" />
      <path
        d="M23 40 l5 5 l9 -11"
        stroke="#BA704F"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="122" cy="30" r="4" fill="#E8C7A7" />
      <circle cx="18" cy="70" r="3" fill="#7B2637" />
    </svg>
  );
}
