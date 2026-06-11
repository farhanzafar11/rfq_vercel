import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[12px] font-medium whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--gc-orange-50)] text-[var(--gc-orange-700)]",
        secondary: "bg-[var(--gc-navy-700)] text-white",
        success: "bg-[var(--gc-success-bg)] text-[var(--gc-success)]",
        error: "bg-[var(--gc-error-bg)] text-[var(--gc-error)]",
        warning: "bg-[var(--gc-warning-bg)] text-[var(--gc-warning)]",
        info: "bg-[var(--gc-orange-50)] text-[var(--gc-orange-700)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
