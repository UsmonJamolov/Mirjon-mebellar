import type { SketchData } from "@/lib/sketch-types";
import { formatSketchSummary } from "@/lib/sketch-types";
import { SketchPreview } from "@/components/sketch/SketchPreview";
import { Trash2 } from "lucide-react";

interface SketchMessageCardProps {
  sketch: SketchData;
  variant?: "customer" | "admin";
  onOpen?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
}

export function SketchMessageCard({
  sketch,
  variant = "customer",
  onOpen,
  onDelete,
  deleteDisabled,
}: SketchMessageCardProps) {
  const isCustomer = variant === "customer";

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className={`text-xs font-semibold ${isCustomer ? "text-white/90" : "text-[#6b5f52]"}`}>
          📐 Individual eskiz
        </p>
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            disabled={deleteDisabled}
            className={`shrink-0 rounded-lg p-1.5 transition ${
              isCustomer
                ? "text-white/80 hover:bg-white/20 hover:text-white disabled:opacity-40"
                : "text-[#6b5f52] hover:bg-[#ebe6df] disabled:opacity-40"
            }`}
            aria-label="Eskizni o'chirish"
            title="O'chirish"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onOpen}
        className={`w-full text-left overflow-hidden rounded-[14px] border transition ${
          isCustomer
            ? "border-white/25 bg-white/15 hover:bg-white/20"
            : "border-[#ebe6df] bg-[#faf8f5] hover:bg-[#f5f0e8]"
        } ${onOpen ? "cursor-pointer" : "cursor-default"}`}
        aria-label="Eskizni ochish"
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
      </button>
      <p className={`text-[11px] ${isCustomer ? "text-white/85" : "text-[#6b5f52]"}`}>
        {formatSketchSummary(sketch)}
      </p>
    </div>
  );
}
