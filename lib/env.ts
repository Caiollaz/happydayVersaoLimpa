import { z } from "zod";

/**
 * Environment contract. Parsed once at module load so a misconfigured
 * deploy fails at boot with a readable list of what's missing, rather
 * than at 2am when the first webhook arrives.
 *
 * Only import this from server code — it reads secrets.
 */
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  /** Public origin, no trailing slash. Used to build share links, the
   *  Mercado Pago return URLs and the webhook callback. */
  APP_URL: z.url().default("http://localhost:3000"),

  /** SQLite file. In Docker this lives on the ./data volume. */
  DATABASE_PATH: z.string().default("./data/app.db"),

  /** Root for user-uploaded photos and audio. Also on the volume. */
  UPLOAD_DIR: z.string().default("./data/uploads"),

  // --- Mercado Pago ---------------------------------------------------
  /** Server-side token. Sandbox token starts with TEST-. */
  MP_ACCESS_TOKEN: z.string().min(1).optional(),
  /** Secret from the webhook config, used to verify the x-signature
   *  header so anyone can't POST us a fake "payment approved". */
  MP_WEBHOOK_SECRET: z.string().min(1).optional(),

  // --- E-mail ---------------------------------------------------------
  SMTP_URL: z.string().optional(),
  MAIL_FROM: z.string().default("Happyday <nao-responda@localhost>"),

  /** Guards /admin. Absent in dev means the panel is closed. */
  ADMIN_TOKEN: z.string().min(16).optional(),
});

// An empty value counts as absent. Copying .env.example as-is (as the README
// says to) leaves every optional key set to "", and "" fails .min(1) where
// undefined would have passed.
const raw = Object.fromEntries(
  Object.entries(process.env).filter(([, v]) => v !== ""),
);

const parsed = schema.safeParse(raw);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  ${i.path.join(".")}: ${i.message}`)
    .join("\n");
  throw new Error(`Variáveis de ambiente inválidas:\n${issues}`);
}

export const env = parsed.data;

/** True once real money can move. Checkout routes refuse to run without it. */
export const paymentsConfigured = Boolean(env.MP_ACCESS_TOKEN);

/** True once we can actually deliver the link. */
export const mailConfigured = Boolean(env.SMTP_URL);
