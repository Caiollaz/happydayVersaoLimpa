import { hues, ink } from "./palette";

const STROKE = 3;
const STROKE_THIN = 2;

const HEART =
  "M50 86 C12 58 6 30 24 16 C38 5 50 14 50 26 C50 14 62 5 76 16 C94 30 88 58 50 86 Z";

interface Placed {
  x?: number;
  y?: number;
  s?: number;
}

interface IsleProps extends Placed {
  hole?: boolean;
  grass?: boolean;
}

export function Isle({ x = 0, y = 0, s = 1, hole = false, grass = true }: IsleProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M4 34 L22 88 L52 126 L88 148 L126 152 L166 136 L198 106 L220 68 L236 34 Z"
        fill={hues.blue.deep}
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
      <path
        d="M52 126 C62 100 68 76 70 58 M166 136 C160 108 156 82 154 60"
        fill="none"
        stroke={ink}
        strokeWidth={STROKE_THIN}
        strokeLinecap="round"
      />
      <ellipse
        cx="120"
        cy="34"
        rx="116"
        ry="30"
        fill={hues.mint.light}
        stroke={ink}
        strokeWidth={STROKE}
      />
      <path d="M4 34 A116 30 0 0 0 236 34 Z" fill={hues.mint.mid} opacity={0.55} />
      {hole && <ellipse cx="120" cy="40" rx="36" ry="12" fill={ink} />}
      {grass && (
        <path
          d="M30 15 l-6 -11 M42 12 l0 -13 M54 9 l6 -11 M186 9 l-6 -11 M198 12 l0 -13 M210 15 l6 -11"
          fill="none"
          stroke={ink}
          strokeWidth={STROKE_THIN}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

export function Boulder({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={ink}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    >
      <path d="M8 66 L2 26 L24 4 L52 6 L70 28 L62 66 Z" fill={hues.blue.deep} />
      <path d="M2 26 L24 4 L52 6 L70 28 L36 40 Z" fill={hues.blue.mid} />
      <path d="M36 40 L34 66" strokeLinecap="round" />
    </g>
  );
}

export function Shrub({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M46 56 L46 82" stroke={ink} strokeWidth={STROKE} strokeLinecap="round" />
      <path
        d="M32 62 C10 62 2 40 18 30 C12 10 38 0 50 12 C66 -2 88 12 82 32 C96 44 86 62 64 62 Z"
        fill={hues.mint.mid}
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </g>
  );
}

export function Star({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d="M50 4 L62 36 L96 37 L69 58 L79 91 L50 71 L21 91 L31 58 L4 37 L38 36 Z"
        fill={hues.sun.mid}
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </g>
  );
}

export function Arch({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" strokeWidth={24}>
      <path d="M8 120 A112 112 0 0 1 232 120" stroke={hues.coral.light} />
      <path d="M32 120 A88 88 0 0 1 208 120" stroke={hues.sun.light} />
      <path d="M56 120 A64 64 0 0 1 184 120" stroke={hues.blue.light} />
    </g>
  );
}

interface StoneProps {
  x: number;
  y: number;
  w: number;
  h?: number;
  fill?: string;
}

export function Stone({ x, y, w, h = 20, fill = hues.pink.pale }: StoneProps) {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} />;
}

export function Heart({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path
        d={HEART}
        fill={hues.pink.deep}
        stroke={ink}
        strokeWidth={STROKE}
        strokeLinejoin="round"
      />
    </g>
  );
}

export function Phone({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x="4"
        y="4"
        width="76"
        height="142"
        rx="16"
        fill={hues.blue.light}
        stroke={ink}
        strokeWidth={STROKE}
      />
      <rect x="13" y="13" width="58" height="108" rx="9" fill={ink} />
      <g transform="translate(25 44) scale(0.34)">
        <path d={HEART} fill={hues.pink.mid} />
      </g>
      <rect x="31" y="130" width="22" height="6" rx="3" fill={hues.blue.mid} />
    </g>
  );
}

export function Envelope({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={ink}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    >
      <path d="M10 46 L60 6 L110 46 Z" fill={hues.coral.light} />
      <rect x="28" y="20" width="64" height="48" rx="4" fill={hues.sun.pale} />
      <g transform="translate(48 30) scale(0.24)">
        <path d={HEART} fill={hues.pink.deep} />
      </g>
      <rect x="8" y="42" width="104" height="50" rx="8" fill={hues.coral.mid} />
      <path d="M8 46 L60 80 L112 46" fill="none" strokeLinecap="round" />
    </g>
  );
}

const PHOTO_CARDS: [rotation: number, tone: string, hero: boolean][] = [
  [-14, hues.mint.mid, false],
  [-4, hues.blue.mid, false],
  [6, hues.pink.mid, true],
];

export function Photos({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {PHOTO_CARDS.map(([rotation, tone, hero]) => (
        <g key={rotation} transform={`rotate(${rotation} 65 58)`}>
          <rect
            x="24"
            y="6"
            width="82"
            height="96"
            rx="6"
            fill={hues.sun.pale}
            stroke={ink}
            strokeWidth={STROKE}
            strokeLinejoin="round"
          />
          <rect x="32" y="14" width="66" height="62" rx="3" fill={tone} />
          {hero && (
            <g transform="translate(50 30) scale(0.3)">
              <path d={HEART} fill={hues.pink.pale} />
            </g>
          )}
        </g>
      ))}
    </g>
  );
}

const QR_FINDERS = [
  [16, 16],
  [60, 16],
  [16, 60],
];

const QR_MODULES = [
  [58, 58, 12, 12],
  [76, 58, 8, 8],
  [58, 76, 8, 8],
  [72, 72, 7, 7],
  [82, 80, 6, 6],
];

export function QrCard({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect
        x="4"
        y="4"
        width="92"
        height="92"
        rx="16"
        fill={hues.sun.pale}
        stroke={ink}
        strokeWidth={STROKE}
      />
      {QR_FINDERS.map(([fx, fy]) => (
        <g key={`${fx}-${fy}`}>
          <rect x={fx} y={fy} width="24" height="24" rx="6" fill="none" stroke={ink} strokeWidth={STROKE} />
          <rect x={fx + 8} y={fy + 8} width="8" height="8" rx="2" fill={ink} />
        </g>
      ))}
      {QR_MODULES.map(([mx, my, mw, mh]) => (
        <rect key={`${mx}-${my}`} x={mx} y={my} width={mw} height={mh} rx="2" fill={ink} />
      ))}
    </g>
  );
}

export function Record({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink}>
      <circle cx="50" cy="50" r="46" fill={hues.blue.deep} strokeWidth={STROKE} />
      <path
        d="M50 12 A38 38 0 0 1 86 38"
        fill="none"
        stroke={hues.blue.mid}
        strokeWidth={6}
        strokeLinecap="round"
      />
      <circle cx="50" cy="50" r="15" fill={hues.pink.light} strokeWidth={STROKE_THIN} />
      <circle cx="50" cy="50" r="4" fill={ink} strokeWidth={0} />
    </g>
  );
}

export function GiftBox({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeWidth={STROKE}>
      <rect x="18" y="48" width="84" height="58" rx="10" fill={hues.pink.light} strokeLinejoin="round" />
      <path d="M60 48 L60 106" stroke={hues.pink.deep} strokeWidth={8} strokeLinecap="round" />
      <g transform="rotate(-14 60 36)">
        <rect x="4" y="22" width="112" height="30" rx="12" fill={hues.sun.light} strokeLinejoin="round" />
      </g>
    </g>
  );
}

export function PaperPlane({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g
      transform={`translate(${x} ${y}) scale(${s})`}
      stroke={ink}
      strokeWidth={STROKE}
      strokeLinejoin="round"
    >
      <path d="M6 44 L114 8 L72 76 L54 54 Z" fill={hues.sun.pale} />
      <path d="M6 44 L54 54 L62 32 Z" fill={hues.blue.light} />
      <path d="M54 54 L114 8" fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Balloon({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeLinejoin="round">
      <path
        d="M45 96 C38 108 52 116 46 128"
        fill="none"
        strokeWidth={STROKE_THIN}
        strokeLinecap="round"
      />
      <ellipse cx="45" cy="46" rx="34" ry="42" fill={hues.pink.light} strokeWidth={STROKE} />
      <ellipse
        cx="30"
        cy="34"
        rx="7"
        ry="13"
        fill={hues.pink.pale}
        strokeWidth={0}
        transform="rotate(18 30 34)"
      />
      <path d="M39 87 L45 97 L51 87 Z" fill={hues.pink.deep} strokeWidth={STROKE} />
    </g>
  );
}

export function Cake({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeLinejoin="round">
      <ellipse cx="60" cy="98" rx="56" ry="10" fill={hues.blue.light} strokeWidth={STROKE} />
      <rect x="14" y="52" width="92" height="46" rx="8" fill={hues.pink.light} strokeWidth={STROKE} />
      <path
        d="M14 60 Q14 46 28 46 L92 46 Q106 46 106 60 L106 66 Q98 76 90 66 Q82 76 74 66 Q66 76 58 66 Q50 76 42 66 Q34 76 26 66 Q18 76 14 66 Z"
        fill={hues.pink.deep}
        strokeWidth={STROKE}
      />
      <rect x="55" y="20" width="10" height="26" rx="3" fill={hues.sun.light} strokeWidth={STROKE} />
      <path d="M60 2 C66 8 68 16 60 20 C52 16 54 8 60 2 Z" fill={hues.coral.mid} strokeWidth={STROKE_THIN} />
    </g>
  );
}

export function Candle({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeLinejoin="round">
      <ellipse cx="40" cy="110" rx="30" ry="8" fill={hues.blue.light} strokeWidth={STROKE} />
      <rect x="22" y="42" width="36" height="68" rx="6" fill={hues.sun.pale} strokeWidth={STROKE} />
      <ellipse cx="40" cy="42" rx="18" ry="6" fill={hues.sun.light} strokeWidth={STROKE} />
      <path d="M40 36 L40 28" fill="none" strokeWidth={STROKE_THIN} strokeLinecap="round" />
      <path d="M40 4 C50 14 52 24 40 30 C28 24 30 14 40 4 Z" fill={hues.coral.mid} strokeWidth={STROKE_THIN} />
      <path d="M40 16 C44 20 44 25 40 28 C36 25 36 20 40 16 Z" fill={hues.sun.light} strokeWidth={0} />
    </g>
  );
}

export function Flower({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeLinejoin="round">
      <path d="M50 58 L50 116" fill="none" stroke={hues.mint.deep} strokeWidth={6} strokeLinecap="round" />
      <path
        d="M50 94 C30 94 20 80 22 66 C40 68 50 80 50 94 Z"
        fill={hues.mint.mid}
        strokeWidth={STROKE}
      />
      <path d="M30 22 C46 28 54 44 50 60 C34 56 26 40 30 22 Z" fill={hues.pink.deep} strokeWidth={STROKE} />
      <path d="M70 22 C54 28 46 44 50 60 C66 56 74 40 70 22 Z" fill={hues.pink.deep} strokeWidth={STROKE} />
      <path d="M50 6 C64 18 68 40 50 60 C32 40 36 18 50 6 Z" fill={hues.pink.mid} strokeWidth={STROKE} />
    </g>
  );
}

export function Ring({ x = 0, y = 0, s = 1 }: Placed) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={ink} strokeLinejoin="round">
      <circle cx="50" cy="72" r="27" fill="none" stroke={hues.sun.light} strokeWidth={10} />
      <circle cx="50" cy="72" r="32" fill="none" strokeWidth={STROKE} />
      <circle cx="50" cy="72" r="22" fill="none" strokeWidth={STROKE} />
      <path d="M40 42 L60 42 L56 34 L44 34 Z" fill={hues.sun.light} strokeWidth={STROKE_THIN} />
      <path d="M50 4 L70 22 L50 36 L30 22 Z" fill={hues.blue.light} strokeWidth={STROKE} />
      <path d="M30 22 L70 22 M40 22 L50 4 L60 22 M40 22 L50 36 L60 22" fill="none" strokeWidth={STROKE_THIN} />
    </g>
  );
}
