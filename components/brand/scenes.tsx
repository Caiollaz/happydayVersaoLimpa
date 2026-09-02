import type { CSSProperties } from "react";

import { hues, ink } from "./palette";
import {
  Arch,
  Balloon,
  Boulder,
  Cake,
  Candle,
  Envelope,
  Flower,
  GiftBox,
  Heart,
  Isle,
  PaperPlane,
  Phone,
  Photos,
  QrCard,
  Record,
  Ring,
  Shrub,
  Star,
  Stone,
} from "./primitives";

interface SceneProps {
  className?: string;
}

export function HeroLeft({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 300 270" className={className} aria-hidden fill="none">
      <Isle x={-30} y={70} s={1.15} />
      <Shrub x={40} y={31} s={0.95} />
      <Boulder x={182} y={52} s={0.7} />
    </svg>
  );
}

export function HeroRight({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 300 270" className={className} aria-hidden fill="none">
      <Isle x={30} y={62} s={1.15} />
      <Boulder x={148} y={38} s={0.95} />
      <Stone x={12} y={22} w={70} h={20} fill={hues.sun.pale} />
    </svg>
  );
}

export function HeroHeart({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 110 100" className={className} aria-hidden fill="none">
      <Heart x={5} y={4} s={1} />
    </svg>
  );
}

const FIGURES = {
  phone: ["0 0 84 150", Phone],
  photos: ["-4 -10 138 132", Photos],
  envelope: ["0 0 120 96", Envelope],
  record: ["0 0 100 100", Record],
  giftbox: ["-4 0 128 112", GiftBox],
  qrcard: ["0 0 100 100", QrCard],
  heart: ["0 0 100 92", Heart],
  "paper-plane": ["0 0 120 84", PaperPlane],
  balloon: ["0 0 90 134", Balloon],
  cake: ["0 -4 120 116", Cake],
  candle: ["0 0 80 122", Candle],
  flower: ["0 0 100 122", Flower],
  ring: ["0 0 100 110", Ring],
} as const;

export type FigureName = keyof typeof FIGURES;

interface FigureProps extends SceneProps {
  name: FigureName;
  style?: CSSProperties;
}

export function Figure({ name, className, style }: FigureProps) {
  const [viewBox, Shape] = FIGURES[name];
  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden fill="none">
      <Shape />
    </svg>
  );
}

export function SceneMain({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 960 350" className={className} aria-hidden fill="none">
      <Stone x={190} y={70} w={78} h={22} fill={hues.blue.pale} />
      <Stone x={286} y={36} w={54} h={20} fill={hues.sun.pale} />
      <Stone x={648} y={54} w={68} h={22} fill={hues.mint.pale} />
      <Stone x={744} y={98} w={46} h={18} />
      <Arch x={358} y={28} s={1} />
      <Isle x={40} y={200} s={0.62} />
      <GiftBox x={66} y={135} s={0.8} />
      <Isle x={740} y={196} s={0.6} />
      <Envelope x={769} y={150} s={0.72} />
      <Isle x={340} y={155} s={1.15} hole />
      <Boulder x={366} y={136} s={0.85} />
      <Record x={528} y={146} s={0.52} />
      <Phone x={445} y={77} s={0.78} />
    </svg>
  );
}

export function SceneTell({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 440 340" className={className} aria-hidden fill="none">
      <Stone x={20} y={40} w={64} h={20} fill={hues.coral.pale} />
      <Stone x={340} y={62} w={52} h={18} fill={hues.blue.pale} />
      <Isle x={40} y={130} s={1.3} />
      <Shrub x={58} y={99} s={0.92} />
      <Shrub x={288} y={104} s={0.86} />
      <Envelope x={136} y={82} s={1} />
    </svg>
  );
}

export function SceneShape({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 440 340" className={className} aria-hidden fill="none">
      <Stone x={36} y={54} w={58} h={20} fill={hues.mint.pale} />
      <Stone x={296} y={26} w={78} h={22} />
      <Isle x={60} y={135} s={1.25} />
      <Photos x={112} y={74} s={1} />
      <Record x={266} y={117} s={0.6} />
      <Star x={330} y={54} s={0.36} />
    </svg>
  );
}

export function SceneSend({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 440 340" className={className} aria-hidden fill="none">
      <Stone x={28} y={44} w={70} h={22} fill={hues.sun.pale} />
      <Isle x={60} y={138} s={1.25} hole />
      <Phone x={128} y={38} s={0.95} />
      <QrCard x={272} y={92} s={0.62} />
      <path
        d="M348 88 l18 -10 M350 122 l19 6 M330 62 l7 -18"
        stroke={ink}
        strokeWidth={6}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SceneLost({ className }: SceneProps) {
  return (
    <svg viewBox="0 0 320 230" className={className} aria-hidden fill="none">
      <Stone x={24} y={30} w={60} h={18} fill={hues.sun.pale} />
      <Stone x={236} y={52} w={54} h={18} fill={hues.blue.pale} />
      <g transform="rotate(-7 160 120)">
        <Isle x={40} y={40} s={1} hole />
        <Boulder x={196} y={26} s={0.7} />
      </g>
      <Star x={252} y={120} s={0.34} />
    </svg>
  );
}

export function Waves({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 1440 320"
      className={className}
      aria-hidden
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 118 C190 58 372 178 566 154 C760 130 906 44 1116 82 C1268 110 1364 152 1440 138 L1440 320 L0 320 Z"
        fill={hues.blue.pale}
      />
      <path
        d="M0 176 C206 126 388 236 606 210 C824 184 972 108 1176 146 C1308 170 1382 206 1440 196 L1440 320 L0 320 Z"
        fill={hues.blue.light}
      />
      <path
        d="M0 232 C196 196 414 282 634 258 C854 234 1016 178 1214 210 C1338 230 1396 258 1440 248 L1440 320 L0 320 Z"
        fill={hues.blue.deep}
      />
      <path
        d="M0 282 C226 256 424 306 664 292 C904 278 1084 244 1268 268 C1364 281 1412 296 1440 288 L1440 320 L0 320 Z"
        fill={ink}
      />
    </svg>
  );
}

export function WideArc({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 1200 300"
      className={className}
      aria-hidden
      fill="none"
      strokeWidth={44}
      preserveAspectRatio="xMidYMin slice"
    >
      <path d="M20 300 A580 290 0 0 1 1180 300" stroke={hues.coral.light} />
      <path d="M66 300 A534 250 0 0 1 1134 300" stroke={hues.sun.light} />
      <path d="M112 300 A488 210 0 0 1 1088 300" stroke={hues.blue.light} />
    </svg>
  );
}
