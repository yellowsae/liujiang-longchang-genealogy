import { cn } from "@/lib/utils"

export default function VerifyMark({
  note,
  className,
}: {
  note?: string
  className?: string
}) {
  return (
    <span
      title={note ?? "待核：原图字迹不清，或尚未经二次校对"}
      className={cn(
        "ml-1 inline-block translate-y-[-1px] rounded border border-amber-300 bg-amber-50 px-1 text-[10px] font-medium leading-4 text-amber-800 align-middle",
        className,
      )}
    >
      待核
    </span>
  )
}
