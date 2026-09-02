import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="text-center">
      <p className="text-sm font-medium text-brand-slate">{eyebrow}</p>
      <h2 className="mx-auto mt-3 max-w-2xl text-display sm:text-display-lg">
        {title}
      </h2>
      {description && (
        <p className="mx-auto mt-4 max-w-md text-body text-brand-slate">{description}</p>
      )}
    </div>
  );
}
