"use client";

import Image from "next/image";
import { useState } from "react";
import { cn, colorForName, initials } from "@/lib/utils";

const SIZES = {
  xs: "h-8 w-8 text-[11px]",
  sm: "h-10 w-10 text-xs",
  md: "h-14 w-14 text-lg",
  lg: "h-19 w-19 text-2xl",
  xl: "h-24 w-24 text-3xl",
} as const;

const PX = { xs: 32, sm: 40, md: 56, lg: 76, xl: 96 } as const;

export type AvatarShape = "circle" | "rounded";

export interface AvatarProps {
  /** Profile image URL for a business, seller, or user. Null/undefined falls back to initials. */
  src?: string | null;
  /** Full name used to compute initials and a deterministic fallback color. */
  name: string;
  size?: keyof typeof SIZES;
  shape?: AvatarShape;
  className?: string;
  /** Shows a small verified badge overlay (checkmark) in the bottom-right corner. */
  verified?: boolean;
}

/**
 * Displays a business/seller/user profile photo. This is the single place
 * that decides how identity photos render across the app, so the fallback
 * behavior (no photo uploaded yet, broken URL, etc.) stays consistent
 * everywhere a business or seller is shown — search results, trust
 * profiles, investigation cards, review authors, and so on.
 */
export function Avatar({
  src,
  name,
  size = "md",
  shape = "rounded",
  className,
  verified,
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  return (
    <div className={cn("relative shrink-0", SIZES[size], className)}>
      {showImage ? (
        <Image
          src={src}
          alt={`${name} profile photo`}
          width={PX[size]}
          height={PX[size]}
          className={cn("h-full w-full object-cover", shapeClass)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center font-extrabold text-white",
            shapeClass
          )}
          style={{ backgroundColor: colorForName(name) }}
          aria-label={`${name} — no profile photo uploaded`}
        >
          {initials(name)}
        </div>
      )}
      {verified && (
        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ok text-[#070C16] ring-2 ring-white">
          <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3">
            <path
              d="M5 10.5l3 3 7-7"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      )}
    </div>
  );
}
