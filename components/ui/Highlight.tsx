import { Fragment } from "react";

/**
 * Renders a config string where `*asterisks*` mark the accented words.
 *
 * The original hardcoded headlines had one word wrapped in a green span
 * ("Léo preparou um <span>presente</span> especial"). Keeping that as JSX
 * would mean the accent is fixed forever; keeping it as plain text would
 * lose it. A marker in the string is the only version the wizard can let
 * someone move to a different word.
 *
 * Unpaired asterisks render literally rather than swallowing the rest of
 * the line — user-typed text will contain stray ones.
 */
export function Highlight({
  text,
  className = "text-spotify-green",
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(/\*([^*]+)\*/g);

  return (
    <>
      {parts.map((part, i) =>
        // split() puts captured groups at the odd indices.
        i % 2 === 1 ? (
          <span key={i} className={className}>
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
