import type { SketchData } from "@/lib/sketch-types";
import { formatSketchSummary } from "@/lib/sketch-types";
import { SketchPreview } from "@/components/sketch/SketchPreview";

interface SketchMessageCardProps {
  sketch: SketchData;
  variant?: "customer" | "admin";
}

export function SketchMessageCard({ sketch, variant = "customer" }: SketchMessageCardProps) {
  const isCustomer = variant === "customer";

  return (
    <div className="space-y-2">
      <p className={`text-xs font-semibold ${isCustomer ? "text-white/90" : "text-[#6b5f52]"}`}>
        📐 Individual eskiz
      </p>
      <div
        className={`overflow-hidden rounded-[14px] border ${
          isCustomer ? "border-white/25 bg-white/15" : "border-[#ebe6df] bg-[#faf8f5]"
        }`}
      >
        <div className="pointer-events-none scale-[0.85] origin-top-left w-[118%] max-h-[140px] overflow-hidden">
          <SketchPreview
            length={sketch.length}
            width={sketch.width}
            height={sketch.height}
            type={sketch.type}
            material={sketch.material}
          />
        </div>
      </div>
      <p className={`text-[11px] ${isCustomer ? "text-white/85" : "text-[#6b5f52]"}`}>
        {formatSketchSummary(sketch)}
      </p>
    </div>
  );
}
