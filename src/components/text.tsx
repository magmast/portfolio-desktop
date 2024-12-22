import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const text = cva(undefined, {
  defaultVariants: {
    variant: "body",
  },
  variants: {
    variant: {
      "window-title": "font-medium",
      "icon-label": "text-sm",
      clock: "text-sm font-semibold",
      body: "",
    },
  },
});

export function Text({
  variant,
  className,
  asChild,
  ...props
}: React.ComponentPropsWithRef<"span"> &
  VariantProps<typeof text> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";
  return <Comp {...props} className={cn(text({ variant }), className)} />;
}
