import type { CSSProperties } from "react";

type Pt = [number, number];

const C = {
  sageLight: "#c3ccb6",
  sage: "#a3b093",
  sageDeep: "#7f8f72",
  olive: "#66755a",
  euca: "#b3c2b6",
  eucaDeep: "#93a89b",
  blush3: "#e3b6a8",
  blush4: "#d69f90",
  blushCore: "#c98f80",
  ivoryEdge: "#d6cdbd",
  gold: "#a98f5c",
  goldLight: "#cdb98c",
  ink: "#24211d",
};

// Rounded so server- and client-rendered attribute strings always match.
const r2 = (n: number) => Math.round(n * 100) / 100;

function petalPath(len: number, halfW: number) {
  return `M0 0C${r2(-halfW * 0.95)} ${r2(-len * 0.22)} ${r2(-halfW * 1.08)} ${r2(-len * 0.86)} 0 ${r2(-len)}C${r2(halfW * 1.08)} ${r2(-len * 0.86)} ${r2(halfW * 0.95)} ${r2(-len * 0.22)} 0 0Z`;
}

function leafPath(len: number, halfW: number) {
  return `M0 0C${r2(len * 0.28)} ${r2(-halfW * 1.25)} ${r2(len * 0.72)} ${r2(-halfW * 1.05)} ${r2(len)} 0C${r2(len * 0.72)} ${r2(halfW * 1.05)} ${r2(len * 0.28)} ${r2(halfW * 1.25)} 0 0Z`;
}

function quadAt(p0: Pt, p1: Pt, p2: Pt, t: number) {
  const mt = 1 - t;
  const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0];
  const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1];
  const dx = 2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}

function sway(pivot: Pt, dur: number, delay: number, amp: number) {
  return {
    "--ox": `${pivot[0]}px`,
    "--oy": `${pivot[1]}px`,
    "--dur": `${dur}s`,
    "--delay": `${delay}s`,
    "--amp": `${amp}deg`,
  } as CSSProperties;
}

function breathe(dur: number, delay: number) {
  return { "--dur": `${dur}s`, "--delay": `${delay}s` } as CSSProperties;
}

type Curve = { from: Pt; ctrl: Pt; to: Pt };

function curvePath({ from, ctrl, to }: Curve) {
  return `M${from[0]} ${from[1]}Q${ctrl[0]} ${ctrl[1]} ${to[0]} ${to[1]}`;
}

function LeafBranch({
  curve,
  count,
  len,
  width,
  fill,
  vein,
  spread = 40,
  style,
}: {
  curve: Curve;
  count: number;
  len: number;
  width: number;
  fill: string;
  vein: string;
  spread?: number;
  style: CSSProperties;
}) {
  const leaf = leafPath(len, width / 2);
  const veinPath = `M${r2(len * 0.08)} 0L${r2(len * 0.86)} 0`;
  return (
    <g className="sway" style={style}>
      <path d={curvePath(curve)} fill="none" stroke={vein} strokeWidth="1.1" strokeLinecap="round" />
      {Array.from({ length: count }, (_, i) => {
        const k = i / (count - 1);
        const p = quadAt(curve.from, curve.ctrl, curve.to, 0.2 + 0.8 * k);
        const isTip = i === count - 1;
        const side = i % 2 === 0 ? -1 : 1;
        const angle = p.angle + (isTip ? 0 : side * spread);
        return (
          <g
            key={i}
            transform={`translate(${r2(p.x)} ${r2(p.y)}) rotate(${r2(angle)}) scale(${r2(1 - 0.4 * k)})`}
          >
            <path d={leaf} fill={fill} />
            <path d={veinPath} stroke={vein} strokeWidth="0.7" strokeLinecap="round" opacity="0.5" />
          </g>
        );
      })}
    </g>
  );
}

function Eucalyptus({
  curve,
  pairs,
  size,
  style,
}: {
  curve: Curve;
  pairs: number;
  size: number;
  style: CSSProperties;
}) {
  return (
    <g className="sway" style={style}>
      <path d={curvePath(curve)} fill="none" stroke={C.eucaDeep} strokeWidth="1.1" strokeLinecap="round" />
      {Array.from({ length: pairs }, (_, i) => {
        const k = i / (pairs - 1);
        const p = quadAt(curve.from, curve.ctrl, curve.to, 0.16 + 0.84 * k);
        const s = size * (1 - 0.5 * k);
        const isTip = i === pairs - 1;
        return (
          <g key={i} transform={`translate(${r2(p.x)} ${r2(p.y)}) rotate(${r2(p.angle)})`} opacity="0.92">
            {isTip ? (
              <ellipse cx={r2(s * 0.5)} cy="0" rx={r2(s * 0.5)} ry={r2(s * 0.36)} fill={C.euca} />
            ) : (
              <>
                <ellipse
                  cx={r2(s * 0.5)}
                  cy="0"
                  rx={r2(s * 0.5)}
                  ry={r2(s * 0.4)}
                  fill={C.euca}
                  transform="rotate(-62)"
                />
                <ellipse
                  cx={r2(s * 0.5)}
                  cy="0"
                  rx={r2(s * 0.5)}
                  ry={r2(s * 0.4)}
                  fill={C.eucaDeep}
                  transform="rotate(62)"
                />
              </>
            )}
          </g>
        );
      })}
    </g>
  );
}

function GoldSprig({
  curve,
  twigs,
  twigLen = 17,
  style,
}: {
  curve: Curve;
  twigs: number;
  twigLen?: number;
  style: CSSProperties;
}) {
  return (
    <g className="sway" style={style} stroke={C.gold} strokeWidth="0.9" strokeLinecap="round" fill="none">
      <path d={curvePath(curve)} />
      {Array.from({ length: twigs }, (_, i) => {
        const k = (i + 1) / (twigs + 1);
        const p = quadAt(curve.from, curve.ctrl, curve.to, 0.22 + 0.78 * k);
        const side = i % 2 === 0 ? -1 : 1;
        const a = ((p.angle + side * 46) * Math.PI) / 180;
        const l = twigLen * (1 - 0.3 * k);
        const ex = p.x + Math.cos(a) * l;
        const ey = p.y + Math.sin(a) * l;
        return (
          <g key={i}>
            <path d={`M${r2(p.x)} ${r2(p.y)}L${r2(ex)} ${r2(ey)}`} />
            <circle
              cx={r2(ex)}
              cy={r2(ey)}
              r={r2(2.9 - k)}
              fill={i % 3 === 0 ? "#fffdf8" : C.goldLight}
            />
          </g>
        );
      })}
      <circle cx={curve.to[0]} cy={curve.to[1]} r="2.2" fill={C.goldLight} />
    </g>
  );
}

function Ring({
  count,
  len,
  halfW,
  fill,
  stroke,
  offset = 0,
}: {
  count: number;
  len: number;
  halfW: number;
  fill: string;
  stroke: string;
  offset?: number;
}) {
  const d = petalPath(len, halfW);
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <path
          key={i}
          d={d}
          transform={`rotate(${r2(offset + (360 / count) * i)})`}
          fill={fill}
          stroke={stroke}
          strokeWidth="0.6"
        />
      ))}
    </>
  );
}

type FlowerProps = { x: number; y: number; r: number; rotate?: number; delay?: number };

function Shadow({ r }: { r: number }) {
  return <circle cx={r2(r * 0.08)} cy={r2(r * 0.12)} r={r2(r * 1.16)} fill="url(#fl-shadow)" />;
}

function Anemone({ x, y, r, rotate = 0, delay = 0 }: FlowerProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Shadow r={r} />
      <g className="breathe" style={breathe(8, delay)}>
        <Ring count={6} len={r} halfW={r * 0.78} fill="url(#fl-ivory)" stroke={C.ivoryEdge} />
        <Ring count={5} len={r * 0.74} halfW={r * 0.6} fill="url(#fl-ivory)" stroke={C.ivoryEdge} offset={30} />
        {Array.from({ length: 18 }, (_, i) => {
          const a = (Math.PI * 2 * i) / 18;
          const inner = r * 0.17;
          const outer = r * (i % 2 === 0 ? 0.31 : 0.27);
          return (
            <g key={i}>
              <path
                d={`M${r2(Math.cos(a) * inner)} ${r2(Math.sin(a) * inner)}L${r2(Math.cos(a) * outer)} ${r2(Math.sin(a) * outer)}`}
                stroke={C.gold}
                strokeWidth="0.7"
              />
              <circle cx={r2(Math.cos(a) * outer)} cy={r2(Math.sin(a) * outer)} r={r2(r * 0.026)} fill={C.gold} />
            </g>
          );
        })}
        <circle r={r2(r * 0.19)} fill={C.ink} />
        <circle cx={r2(-r * 0.05)} cy={r2(-r * 0.06)} r={r2(r * 0.07)} fill="#4a443c" />
      </g>
    </g>
  );
}

function Rose({ x, y, r, rotate = 0, delay = 0 }: FlowerProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Shadow r={r} />
      <g className="breathe" style={breathe(7, delay)}>
        <Ring count={7} len={r} halfW={r * 0.62} fill="url(#fl-blush-a)" stroke={C.blush3} />
        <Ring count={6} len={r * 0.8} halfW={r * 0.5} fill="url(#fl-blush-b)" stroke={C.blush4} offset={26} />
        <Ring count={5} len={r * 0.6} halfW={r * 0.4} fill="url(#fl-blush-c)" stroke={C.blush4} offset={10} />
        <Ring count={4} len={r * 0.4} halfW={r * 0.3} fill={C.blush4} stroke={C.blushCore} offset={40} />
        <circle r={r2(r * 0.13)} fill={C.blushCore} />
        <path
          d={`M${r2(-r * 0.07)} 0A${r2(r * 0.07)} ${r2(r * 0.07)} 0 1 1 ${r2(r * 0.05)} ${r2(r * 0.05)}`}
          fill="none"
          stroke="#b27869"
          strokeWidth="0.7"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
}

function Blossom({ x, y, r, rotate = 0, delay = 0, blush = false }: FlowerProps & { blush?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <Shadow r={r} />
      <g className="breathe" style={breathe(6, delay)}>
        <Ring
          count={5}
          len={r}
          halfW={r * 0.72}
          fill={blush ? "url(#fl-blush-a)" : "url(#fl-ivory)"}
          stroke={blush ? C.blush3 : C.ivoryEdge}
        />
        <circle r={r2(r * 0.2)} fill={C.goldLight} />
        <circle r={r2(r * 0.09)} fill={C.gold} />
      </g>
    </g>
  );
}

function BigLeaf({ at, angle, len, width, fill, vein }: { at: Pt; angle: number; len: number; width: number; fill: string; vein: string }) {
  return (
    <g transform={`translate(${at[0]} ${at[1]}) rotate(${angle})`}>
      <path d={leafPath(len, width / 2)} fill={fill} />
      <path
        d={`M${r2(len * 0.1)} 0L${r2(len * 0.9)} 0`}
        stroke={vein}
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  );
}

/** Shared gradients — render once per page, before any floral SVG. */
export function FloralDefs() {
  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
      <defs>
        <linearGradient id="fl-ivory" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e3d9c9" />
          <stop offset="0.42" stopColor="#faf6ef" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="fl-blush-a" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e7bfb1" />
          <stop offset="1" stopColor="#f9ebe5" />
        </linearGradient>
        <linearGradient id="fl-blush-b" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#dcaa9b" />
          <stop offset="1" stopColor="#f2d7cd" />
        </linearGradient>
        <linearGradient id="fl-blush-c" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#d49b8b" />
          <stop offset="1" stopColor="#eac4b7" />
        </linearGradient>
        <radialGradient id="fl-shadow">
          <stop offset="0.55" stopColor="#4a3b25" stopOpacity="0.2" />
          <stop offset="1" stopColor="#4a3b25" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * A lush corner arrangement anchored at the top-left; rotate the element for other corners.
 * Every branch is its own swaying group, pivoting from where it meets the bouquet.
 */
export function FloralCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="52 52 460 460"
      className={`block overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <GoldSprig curve={{ from: [70, 62], ctrl: [270, 36], to: [452, 128] }} twigs={8} style={sway([70, 62], 9, 0, 2.6)} />
      <GoldSprig curve={{ from: [62, 70], ctrl: [36, 270], to: [128, 452] }} twigs={8} style={sway([62, 70], 10, -3, 2.6)} />
      <GoldSprig curve={{ from: [96, 96], ctrl: [250, 190], to: [352, 340] }} twigs={6} style={sway([96, 96], 8, -1.5, 2.2)} />

      <Eucalyptus curve={{ from: [84, 70], ctrl: [250, 84], to: [398, 236] }} pairs={7} size={36} style={sway([84, 70], 8.5, -2, 1.8)} />
      <Eucalyptus curve={{ from: [70, 84], ctrl: [84, 250], to: [236, 398] }} pairs={7} size={36} style={sway([70, 84], 9.5, -4, 1.8)} />

      <LeafBranch
        curve={{ from: [96, 56], ctrl: [236, 20], to: [356, 76] }}
        count={7}
        len={52}
        width={21}
        fill={C.sageDeep}
        vein={C.olive}
        style={sway([96, 56], 7.5, -1, 1.6)}
      />
      <LeafBranch
        curve={{ from: [56, 96], ctrl: [20, 236], to: [76, 356] }}
        count={7}
        len={52}
        width={21}
        fill={C.sageDeep}
        vein={C.olive}
        style={sway([56, 96], 8.2, -3.5, 1.6)}
      />
      <LeafBranch
        curve={{ from: [124, 124], ctrl: [214, 176], to: [268, 284] }}
        count={5}
        len={48}
        width={20}
        fill={C.sage}
        vein={C.sageDeep}
        style={sway([124, 124], 8.8, -5, 1.4)}
      />

      <g className="sway" style={sway([130, 124], 9, -2.5, 1.1)}>
        <BigLeaf at={[130, 124]} angle={22} len={138} width={46} fill={C.sageLight} vein={C.sage} />
        <BigLeaf at={[130, 124]} angle={68} len={138} width={46} fill={C.sageLight} vein={C.sage} />
        <BigLeaf at={[250, 80]} angle={-32} len={84} width={30} fill={C.sage} vein={C.sageDeep} />
        <BigLeaf at={[250, 80]} angle={14} len={92} width={32} fill={C.sageLight} vein={C.sage} />
        <BigLeaf at={[82, 248]} angle={122} len={84} width={30} fill={C.sage} vein={C.sageDeep} />
        <BigLeaf at={[82, 248]} angle={76} len={92} width={32} fill={C.sageLight} vein={C.sage} />
      </g>

      <Rose x={250} y={80} r={50} rotate={12} delay={-2} />
      <Rose x={82} y={248} r={44} rotate={-20} delay={-4} />
      <Anemone x={130} y={124} r={76} rotate={8} delay={0} />
      <Blossom x={322} y={152} r={19} rotate={10} delay={-1} />
      <Blossom x={158} y={306} r={17} rotate={-14} delay={-3} blush />
      <Blossom x={228} y={214} r={15} rotate={24} delay={-5} />
    </svg>
  );
}

/** A compact rose spray for card corners, anchored at the top-left. */
export function FloralSpray({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="24 24 300 200"
      className={`block overflow-visible ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <GoldSprig curve={{ from: [74, 70], ctrl: [190, 34], to: [312, 78] }} twigs={7} twigLen={14} style={sway([74, 70], 9, -1, 2.4)} />
      <GoldSprig curve={{ from: [70, 74], ctrl: [44, 150], to: [86, 216] }} twigs={5} twigLen={14} style={sway([70, 74], 10, -4, 2.4)} />
      <Eucalyptus curve={{ from: [84, 72], ctrl: [176, 66], to: [270, 122] }} pairs={6} size={27} style={sway([84, 72], 8.5, -2, 1.8)} />
      <LeafBranch
        curve={{ from: [88, 62], ctrl: [170, 28], to: [244, 50] }}
        count={5}
        len={38}
        width={16}
        fill={C.sageDeep}
        vein={C.olive}
        style={sway([88, 62], 7.5, -3, 1.6)}
      />
      <LeafBranch
        curve={{ from: [70, 84], ctrl: [62, 150], to: [116, 198] }}
        count={5}
        len={38}
        width={16}
        fill={C.sage}
        vein={C.sageDeep}
        style={sway([70, 84], 8.2, -5, 1.6)}
      />
      <g className="sway" style={sway([74, 74], 9, -2.5, 1.1)}>
        <BigLeaf at={[74, 74]} angle={24} len={92} width={32} fill={C.sageLight} vein={C.sage} />
        <BigLeaf at={[74, 74]} angle={62} len={84} width={30} fill={C.sageLight} vein={C.sage} />
        <BigLeaf at={[74, 74]} angle={-6} len={78} width={26} fill={C.sage} vein={C.sageDeep} />
      </g>
      <Rose x={74} y={74} r={42} rotate={-8} delay={-1} />
      <Blossom x={138} y={56} r={16} rotate={12} delay={-3} />
      <Blossom x={62} y={136} r={15} rotate={-10} delay={-2} blush />
      <Blossom x={160} y={104} r={11} rotate={30} delay={-4} />
    </svg>
  );
}

function GarlandSide({ shift = 0 }: { shift?: number }) {
  return (
    <>
      <GoldSprig curve={{ from: [262, 48], ctrl: [160, 14], to: [36, 46] }} twigs={7} twigLen={12} style={sway([262, 48], 9, -1 + shift, 2)} />
      <Eucalyptus curve={{ from: [258, 50], ctrl: [190, 30], to: [104, 56] }} pairs={6} size={22} style={sway([258, 50], 8.5, -3 + shift, 1.6)} />
      <LeafBranch
        curve={{ from: [260, 54], ctrl: [204, 82], to: [140, 70] }}
        count={4}
        len={30}
        width={13}
        fill={C.sageDeep}
        vein={C.olive}
        style={sway([260, 54], 7.8, -5 + shift, 1.5)}
      />
    </>
  );
}

/** A symmetrical garland used between sections. */
export function FloralDivider({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 96" className={`block overflow-visible ${className}`} aria-hidden="true" focusable="false">
      <GarlandSide />
      <g transform="translate(560 0) scale(-1 1)">
        <GarlandSide shift={-2.2} />
      </g>
      <BigLeaf at={[280, 50]} angle={196} len={62} width={21} fill={C.sageLight} vein={C.sage} />
      <BigLeaf at={[280, 50]} angle={-16} len={62} width={21} fill={C.sageLight} vein={C.sage} />
      <Rose x={244} y={55} r={17} rotate={-12} delay={-2} />
      <Rose x={316} y={55} r={17} rotate={20} delay={-4} />
      <Anemone x={280} y={47} r={27} rotate={6} delay={0} />
    </svg>
  );
}
