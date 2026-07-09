"use client";

type StateMapProps = {
  states: string[];
  selectedState: string | null;
  onSelectState: (state: string | null) => void;
};

const statePoints: Record<string, { label: string; x: number; y: number }> = {
  CA: { label: "California", x: 72, y: 182 },
  FL: { label: "Florida", x: 462, y: 245 },
  IL: { label: "Illinois", x: 334, y: 143 },
  NM: { label: "New Mexico", x: 204, y: 207 },
  NY: { label: "New York", x: 468, y: 91 },
  PA: { label: "Pennsylvania", x: 444, y: 112 },
  TX: { label: "Texas", x: 276, y: 238 },
  WA: { label: "Washington", x: 101, y: 50 }
};

export function StateMap({ states, selectedState, onSelectState }: StateMapProps) {
  const uniqueStates = Array.from(new Set(states));

  return (
    <div className="border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Map View</h3>
          <p className="mt-1 text-xs text-slate-500">Dots show states with matching records. Select a dot to filter.</p>
        </div>
        <button
          type="button"
          onClick={() => onSelectState(null)}
          className="focus-ring rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-600"
        >
          {selectedState ? "Clear" : `${uniqueStates.length} states`}
        </button>
      </div>
      <svg viewBox="0 0 560 310" role="img" aria-label="United States map with matching record states" className="h-auto w-full">
        <path
          d="M69 67 120 48l58 20 71 9 78 2 73-5 56 13 39 37 17 56-27 62-74 28-96-6-62 17-68-22-77 5-59-42-21-70 22-85Z"
          fill="#e7edf6"
          stroke="#a8b7ca"
          strokeWidth="1.5"
        />
        <path d="M93 70 82 197l65 31 34-28-10-130" fill="none" stroke="#b7c4d6" />
        <path d="M176 69 165 252M249 78l-7 185M327 80l4 184M402 75l-23 189" fill="none" stroke="#b7c4d6" />
        <path d="M69 142h443M117 223l333-104M215 276l151-192" fill="none" stroke="#c4cedd" strokeDasharray="4 5" />
        {uniqueStates.map((state) => {
          const point = statePoints[state];

          if (!point) {
            return null;
          }

          const selected = selectedState === state;

          return (
            <g key={state}>
              <button type="button" onClick={() => onSelectState(selected ? null : state)} aria-label={`Filter ${point.label}`}>
                <circle cx={point.x} cy={point.y} r={selected ? 8 : 5} fill={selected ? "#1d4ed8" : "#294899"} />
                <circle cx={point.x} cy={point.y} r={selected ? 13 : 9} fill="transparent" stroke="#1d4ed8" strokeOpacity="0.25" />
              </button>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
