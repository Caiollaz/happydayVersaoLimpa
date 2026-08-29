import { ImageResponse } from "next/og";

import { interpolate } from "@/lib/config/schema";
import { findPublishedSite } from "@/lib/sites";

/**
 * The link preview card.
 *
 * Essentially every one of these sites is delivered by pasting the link
 * into WhatsApp, so this image is the first thing the recipient sees —
 * before the site, before the music. A generic preview here undoes a lot
 * of what the site does.
 *
 * Drawn rather than photographed on purpose: the couple's own photo would
 * spoil the surprise right in the chat list, and would leak into any
 * preview cache along the way.
 */
export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Um presente";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const loaded = findPublishedSite(slug);

  const couple = loaded?.config.couple ?? {
    authorName: "",
    recipientName: "",
  };
  const title = loaded
    ? interpolate(loaded.config.meta.title, couple)
    : "Um presente";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #FF3D78 0%, #C9184A 48%, #1E060F 100%)",
          fontFamily: "sans-serif",
          padding: 80,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 10,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.75)",
            fontWeight: 700,
          }}
        >
          Para você
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 82,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>

        {loaded && (
          <div
            style={{
              // Satori requires an explicit display on any element with
              // more than one child, and it has no cascade to inherit from
              // — so every node here carries its own. The names are joined
              // into one string for the same reason.
              display: "flex",
              marginTop: 32,
              fontSize: 34,
              fontWeight: 800,
              color: "#F5C36A",
            }}
          >
            {`${couple.authorName} & ${couple.recipientName}`}
          </div>
        )}
      </div>
    ),
    size,
  );
}
