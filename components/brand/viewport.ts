import type { Viewport } from "next";

import { brand } from "./palette";

export const brandViewport: Viewport = {
  themeColor: brand.ground,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};
