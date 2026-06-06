"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import {
  Activity,
  Gauge,
  GitBranch,
  SlidersHorizontal,
  Waves,
} from "lucide-react";

type NormMode = "pre" | "post";

type LayerDelta = {
  name: string;
  attention: number;
  mlp: number;
  hue: string;
  accent: string;
};

const layerDeltas: LayerDelta[] = [
  {
    name: "Layer 1",
    attention: 0.55,
    mlp: 0.35,
    hue: "#22d3ee",
    accent: "cyan",
  },
  {
    name: "Layer 2",
    attention: 0.35,
    mlp: 0.8,
    hue: "#c084fc",
    accent: "violet",
  },
  {
    name: "Layer 3",
    attention: 0.7,
    mlp: 0.5,
    hue: "#34d399",
    accent: "emerald",
  },
];

const vectorLabels = ["syntax", "position", "entity", "tone", "next-token"];
const channelBase = [0.42, 0.68, 0.5, 0.36, 0.58];
const channelColors = ["#67e8f9", "#a78bfa", "#f0abfc", "#fbbf24", "#86efac"];

function clamp(value: number, min = 0.08, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function buildRiverPath(
  values: number[],
  width: number,
  height: number,
  offset = 0,
) {
  const step = width / (values.length - 1);
  return values
    .map((value, index) => {
      const x = index * step;
      const wobble = Math.sin(index * 1.7 + offset) * 8;
      const y = height - value * height + wobble;
      return `${index === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export function ResidualStreamLayerNormVisualizer() {
  const [selectedLayer, setSelectedLayer] = useState(1);
  const [normMode, setNormMode] = useState<NormMode>("pre");
  const [signalScale, setSignalScale] = useState(1.6);

  const currentLayer = layerDeltas[selectedLayer];

  const streamVector = useMemo(() => {
    const deltaMix = currentLayer.attention * 0.34 + currentLayer.mlp * 0.28;
    const raw = channelBase.map(
      (value, index) =>
        value * signalScale + deltaMix * (index % 2 === 0 ? 0.62 : 0.28),
    );
    const normalized = raw.map((value) =>
      clamp(
        (value / (signalScale + deltaMix)) * (normMode === "pre" ? 0.78 : 0.9),
      ),
    );
    const output =
      normMode === "pre"
        ? normalized.map((value, index) =>
            clamp(
              value +
                (index % 2 === 0 ? currentLayer.attention : currentLayer.mlp) *
                  0.22,
            ),
          )
        : raw.map((value) => clamp(value / 2.6));
    const beforeGate = raw.map((value) => clamp(value / 2.6, 0.12, 0.96));

    return { raw, normalized, output, beforeGate };
  }, [currentLayer, normMode, signalScale]);

  const instability = Math.min(
    100,
    Math.round(
      ((signalScale * (currentLayer.attention + currentLayer.mlp)) / 2) * 62,
    ),
  );
  const stability =
    normMode === "pre"
      ? Math.max(12, 100 - Math.round(instability * 0.35))
      : Math.max(8, 100 - instability);
  const selectedCopy =
    normMode === "pre"
      ? "Pre-norm clamps the read side first: every block sees a centered, steady signal before it writes a delta back into the river."
      : "Post-norm clamps after the write: the block rides the raw river, so louder signals can slosh before the gate smooths them.";

  const riverPathBefore = buildRiverPath(
    streamVector.beforeGate,
    520,
    122,
    selectedLayer,
  );
  const riverPathAfter = buildRiverPath(
    streamVector.output,
    520,
    122,
    selectedLayer + 1.6,
  );

  return (
    <section className="overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#07111f] text-text shadow-2xl shadow-cyan-950/20">
      <div className="relative border-b border-cyan-300/15 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.20),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(8,13,25,0.98))] p-5 md:p-6">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-cyan-200/30 bg-cyan-300/10 shadow-inner shadow-cyan-200/20">
              <Waves size={23} className="text-cyan-100" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/70">
                residual river
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold text-white md:text-2xl">
                Signal bus with LayerNorm gates
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-cyan-50/70">
                The residual stream is a shared highway. Each transformer block
                taps the flow, adds a packet of change, and LayerNorm acts like
                a stabilizing clamp that keeps the current usable.
              </p>
            </div>
          </div>

          <div
            className="inline-flex w-fit rounded-full border border-cyan-200/20 bg-slate-950/60 p-1 text-sm shadow-inner shadow-black/30"
            role="group"
            aria-label="LayerNorm placement"
          >
            {(["pre", "post"] as NormMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setNormMode(mode)}
                className={clsx(
                  "rounded-full px-4 py-2 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-cyan-200/70",
                  normMode === mode
                    ? "bg-cyan-200 text-slate-950 shadow-lg shadow-cyan-400/20"
                    : "text-cyan-50/70 hover:bg-cyan-200/10 hover:text-white",
                )}
                aria-pressed={normMode === mode}
              >
                {mode === "pre" ? "Pre-norm gate first" : "Post-norm gate last"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="p-4 md:p-6">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-cyan-300/15 bg-slate-950/70 p-4 shadow-inner shadow-black/40">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(103,232,249,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
            <div className="relative mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/70">
                  horizontal workspace
                </p>
                <h3 className="font-heading text-lg font-semibold text-white">
                  Flow → tap → delta write → stabilized flow
                </h3>
              </div>
              <p className="text-xs text-cyan-50/55">
                selected:{" "}
                <span className="font-mono text-cyan-100">
                  {currentLayer.name}
                </span>
              </p>
            </div>

            <div className="relative min-h-[27rem] rounded-[1.4rem] border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-3 md:p-5">
              <svg
                className="absolute left-4 right-4 top-20 h-40 w-[calc(100%-2rem)] overflow-visible md:left-8 md:right-8 md:w-[calc(100%-4rem)]"
                viewBox="0 0 520 150"
                role="img"
                aria-label="Residual stream signal wave before and after LayerNorm"
              >
                <defs>
                  <linearGradient
                    id="residualRiver"
                    x1="0"
                    x2="1"
                    y1="0"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
                    <stop
                      offset="48%"
                      stopColor={currentLayer.hue}
                      stopOpacity="0.95"
                    />
                    <stop
                      offset="100%"
                      stopColor="#34d399"
                      stopOpacity="0.45"
                    />
                  </linearGradient>
                  <filter id="softGlow">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M 0 76 C 82 48 118 104 184 76 S 298 48 366 76 S 454 108 520 76"
                  stroke="#164e63"
                  strokeWidth="46"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.55"
                />
                <path
                  d={riverPathBefore}
                  stroke="#f59e0b"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  opacity={normMode === "post" ? 0.85 : 0.35}
                  strokeDasharray="9 10"
                />
                <path
                  d={riverPathAfter}
                  stroke="url(#residualRiver)"
                  strokeWidth="13"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  filter="url(#softGlow)"
                />
                {streamVector.output.map((value, index) => (
                  <g
                    key={vectorLabels[index]}
                    transform={`translate(${index * 130}, ${132 - value * 84})`}
                  >
                    <circle r="8" fill={channelColors[index]} opacity="0.95" />
                    <circle r="15" fill={channelColors[index]} opacity="0.14" />
                  </g>
                ))}
              </svg>

              <div className="relative grid min-h-[23rem] grid-cols-3 items-stretch gap-3 md:gap-4">
                {layerDeltas.map((layer, index) => {
                  const selected = selectedLayer === index;
                  const gateIsBefore = normMode === "pre" && selected;
                  const gateIsAfter = normMode === "post" && selected;

                  return (
                    <button
                      key={layer.name}
                      type="button"
                      onClick={() => setSelectedLayer(index)}
                      aria-pressed={selected}
                      className={clsx(
                        "group relative flex min-h-[21rem] flex-col items-center rounded-[1.3rem] border px-2 py-3 text-center transition-all focus:outline-none focus:ring-2 focus:ring-cyan-200/70 md:px-3",
                        selected
                          ? "border-cyan-200/60 bg-cyan-200/[0.08] shadow-[0_0_34px_rgba(34,211,238,0.16)]"
                          : "border-white/10 bg-white/[0.035] hover:border-cyan-200/30 hover:bg-white/[0.06]",
                      )}
                    >
                      <NormClamp active={gateIsBefore} label="pre" />

                      <div className="mt-16 flex w-full flex-1 flex-col items-center justify-center">
                        <div
                          className={clsx(
                            "relative flex h-28 w-full max-w-[8rem] flex-col justify-between rounded-2xl border p-3 transition-all",
                            selected
                              ? "border-white/25 bg-slate-950/80"
                              : "border-white/10 bg-slate-950/50",
                          )}
                          style={{
                            boxShadow: selected
                              ? `0 0 28px ${layer.hue}24`
                              : undefined,
                          }}
                        >
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-white/15 bg-slate-950 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-cyan-100/70">
                            tap
                          </div>
                          <DeltaRail
                            label="attn"
                            value={layer.attention}
                            color={layer.hue}
                          />
                          <DeltaRail
                            label="mlp"
                            value={layer.mlp}
                            color={layer.hue}
                          />
                        </div>
                        <div className="mt-3 rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[11px] font-semibold text-white/85 md:text-xs">
                          {layer.name}
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-cyan-50/40">
                          <GitBranch size={12} /> write delta
                        </div>
                      </div>

                      <NormClamp active={gateIsAfter} label="post" />
                    </button>
                  );
                })}
              </div>

              <div
                className="relative mt-4 grid gap-2 md:grid-cols-5"
                aria-label="Residual stream channel values"
              >
                {streamVector.output.map((value, index) => (
                  <div
                    key={vectorLabels[index]}
                    className="rounded-xl border border-white/10 bg-black/25 p-2"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2 text-[10px] text-cyan-50/55">
                      <span className="truncate">{vectorLabels[index]}</span>
                      <span className="font-mono">
                        {Math.round(value * 100)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(value * 100)}%`,
                          backgroundColor: channelColors[index],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="border-t border-cyan-300/15 bg-slate-950/40 p-5 md:p-6 xl:border-l xl:border-t-0">
          <div className="space-y-5">
            <div className="rounded-[1.4rem] border border-amber-200/20 bg-amber-300/[0.06] p-4">
              <div className="mb-3 flex items-center gap-2 text-white">
                <SlidersHorizontal size={18} className="text-amber-200" />
                <h3 className="font-heading font-semibold">River current</h3>
              </div>
              <input
                aria-label="Signal scale"
                type="range"
                min="0.7"
                max="2.6"
                step="0.1"
                value={signalScale}
                onChange={(event) => setSignalScale(Number(event.target.value))}
                className="w-full accent-amber-300"
              />
              <div className="mt-2 flex justify-between text-xs text-cyan-50/55">
                <span>quiet trickle</span>
                <span className="font-mono text-amber-100">
                  ×{signalScale.toFixed(1)}
                </span>
                <span>loud surge</span>
              </div>
            </div>

            <div className="rounded-[1.4rem] border border-cyan-200/20 bg-cyan-300/[0.06] p-4">
              <div className="mb-4 flex items-center gap-2 text-white">
                <Gauge size={18} className="text-cyan-100" />
                <h3 className="font-heading font-semibold">Clamp meters</h3>
              </div>
              <ClampMeter
                label="raw turbulence"
                value={instability}
                tone="amber"
              />
              <ClampMeter
                label="usable stability"
                value={stability}
                tone="cyan"
              />
              <p className="mt-4 rounded-2xl border border-cyan-200/15 bg-slate-950/45 p-3 text-sm leading-relaxed text-cyan-50/76">
                {selectedCopy}
              </p>
            </div>

            <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] p-4">
              <div className="mb-3 flex items-center gap-2 text-white">
                <Activity size={18} className="text-emerald-200" />
                <h3 className="font-heading font-semibold">Current route</h3>
              </div>
              <div className="space-y-2 text-sm">
                <RouteStep
                  active={normMode === "pre"}
                  label="Clamp before the block reads"
                />
                <RouteStep active label={`${currentLayer.name} taps the bus`} />
                <RouteStep active label="Attention + MLP packets merge back" />
                <RouteStep
                  active={normMode === "post"}
                  label="Clamp after the block writes"
                />
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function NormClamp({
  active,
  label,
}: {
  active: boolean;
  label: "pre" | "post";
}) {
  return (
    <div
      className={clsx(
        "absolute left-1/2 flex h-14 w-16 -translate-x-1/2 items-center justify-center rounded-b-2xl border-x border-b transition-all",
        label === "pre" ? "top-0" : "bottom-0 rotate-180",
        active
          ? "border-cyan-100/60 bg-cyan-200/25 shadow-[0_0_24px_rgba(103,232,249,0.28)]"
          : "border-white/10 bg-slate-950/70 opacity-55 group-hover:opacity-80",
      )}
      aria-hidden="true"
    >
      <div
        className={clsx(
          "h-8 w-10 rounded-md border-2",
          active
            ? "border-cyan-50 bg-cyan-100/15"
            : "border-white/20 bg-white/5",
        )}
      >
        <div
          className={clsx(
            "mx-auto mt-1 h-5 w-1 rounded-full",
            active ? "bg-cyan-50" : "bg-white/25",
          )}
        />
      </div>
      <span
        className={clsx(
          "absolute text-[9px] font-bold uppercase tracking-[0.2em]",
          label === "post" && "rotate-180",
          active ? "text-cyan-50" : "text-white/35",
        )}
      >
        LN
      </span>
    </div>
  );
}

function DeltaRail({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="text-left">
      <div className="mb-1 flex justify-between text-[10px] uppercase tracking-wider text-cyan-50/50">
        <span>{label}</span>
        <span>{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${Math.round(value * 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function ClampMeter({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "amber" | "cyan";
}) {
  const color = tone === "amber" ? "bg-amber-300" : "bg-cyan-200";

  return (
    <div className="mb-3">
      <div className="mb-1 flex justify-between text-xs text-cyan-50/60">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="relative h-5 overflow-hidden rounded-full border border-white/10 bg-slate-950/70">
        <div
          className={clsx(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            color,
          )}
          style={{ width: `${value}%`, opacity: 0.22 }}
        />
        <div className="absolute inset-y-1 left-2 right-2 flex justify-between">
          {[0, 1, 2, 3, 4, 5].map((tick) => (
            <span key={tick} className="h-full w-px bg-white/15" />
          ))}
        </div>
        <div
          className="absolute top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-white shadow-lg shadow-white/30 transition-all duration-300"
          style={{ left: `calc(${value}% - 2px)` }}
        />
      </div>
    </div>
  );
}

function RouteStep({ active, label }: { active: boolean; label: string }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2 rounded-full border px-3 py-2",
        active
          ? "border-cyan-200/25 bg-cyan-200/10 text-cyan-50"
          : "border-white/10 text-cyan-50/35",
      )}
    >
      <span
        className={clsx(
          "h-2 w-2 rounded-full",
          active
            ? "bg-cyan-100 shadow-[0_0_10px_rgba(207,250,254,0.8)]"
            : "bg-white/20",
        )}
      />
      <span>{label}</span>
    </div>
  );
}
