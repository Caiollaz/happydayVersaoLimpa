import Link from "next/link";
import { Heart } from "lucide-react";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  compactOnNarrow?: boolean;
}

export function Logo({ className, compactOnNarrow = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-pink-deep">
        <Heart className="h-3.5 w-3.5 fill-white text-white" />
      </span>
      <span
        className={cn(
          "text-lg font-extrabold tracking-[-0.03em]",
          compactOnNarrow && "hidden min-[360px]:inline",
        )}
      >
        happyday
      </span>
    </Link>
  );
}
