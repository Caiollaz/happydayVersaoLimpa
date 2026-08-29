import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { Readable } from "node:stream";

import { UploadError, resolveUploadPath } from "@/lib/storage";

/**
 * Serves an uploaded photo off the local volume.
 *
 * Filenames are the SHA-256 of the processed bytes, so a URL's content can
 * never change — which is what makes the year-long immutable cache below
 * safe, and means Caddy and every browser in the chain will only ask once.
 *
 * The path is deliberately unguessable rather than access-controlled:
 * published sites are shared as links anyway, and putting a token check in
 * front of every image would break the `<img>` tags in a shared page.
 */
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;

  let absolute: string;
  try {
    // Rebuilt from the URL segments, so this is the traversal boundary:
    // resolveUploadPath refuses anything landing outside UPLOAD_DIR.
    absolute = resolveUploadPath(path.join("/"));
  } catch (error) {
    if (error instanceof UploadError) {
      return new Response("caminho inválido", { status: 400 });
    }
    throw error;
  }

  let info;
  try {
    info = await stat(absolute);
  } catch {
    return new Response("não encontrado", { status: 404 });
  }

  if (!info.isFile()) return new Response("não encontrado", { status: 404 });

  // Streamed rather than buffered: a 2000px JPEG is ~500 KB and a busy site
  // serves dozens at once, which would otherwise all sit in memory.
  const stream = Readable.toWeb(
    createReadStream(absolute),
  ) as ReadableStream<Uint8Array>;

  return new Response(stream, {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(info.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
