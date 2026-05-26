interface ChatDateSeparatorProps {
  label: string;
}

export function ChatDateSeparator({ label }: ChatDateSeparatorProps) {
  return (
    <div className="flex justify-center py-1" role="separator" aria-label={label}>
      <span className="rounded-full border border-[#ebe6df] bg-white px-3 py-1 text-[11px] font-medium text-[#6b5f52] shadow-sm">
        {label}
      </span>
    </div>
  );
}
