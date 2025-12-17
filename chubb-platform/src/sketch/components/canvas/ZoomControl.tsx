import React from "react";
import { clamp } from "../../utils/geometry";

interface ZoomControlProps {
  planZoom: number;
  setPlanZoom: React.Dispatch<React.SetStateAction<number>>;
}

const ZoomControl: React.FC<ZoomControlProps> = ({ planZoom, setPlanZoom }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-white px-3 py-2 rounded-lg shadow flex items-center space-x-3">
      <span className="text-gray-700 text-sm font-medium">Zoom plan</span>
      <button
        onClick={() => setPlanZoom((z) => clamp(z - 0.1, 0.3, 4))}
        className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400"
      >
        –
      </button>
      <input
        type="range"
        min={0.3}
        max={4}
        step={0.1}
        value={planZoom}
        onChange={(e) => setPlanZoom(parseFloat(e.target.value))}
        className="w-40 accent-blue-600"
      />
      <button
        onClick={() => setPlanZoom((z) => clamp(z + 0.1, 0.3, 4))}
        className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400"
      >
        +
      </button>
    </div>
  );
};

export default ZoomControl;
