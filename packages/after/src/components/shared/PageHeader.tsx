import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageHeaderVariants = cva("mb-6", {
  variants: {
    size: {
      sm: "[&_h1]:text-xl [&_h1]:mb-1 [&_p]:text-xs",
      md: "[&_h1]:text-2xl [&_h1]:mb-2 [&_p]:text-sm",
      lg: "[&_h1]:text-3xl [&_h1]:mb-3 [&_p]:text-base",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    size: "md",
    align: "left",
  },
});

interface PageHeaderProps extends VariantProps<typeof pageHeaderVariants> {
  title: string;
  description?: string;
  className?: string;
}

export const PageHeader = ({
  title,
  description,
  size,
  align,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn(pageHeaderVariants({ size, align }), className)}>
      <h1 className="font-bold text-foreground">{title}</h1>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
};
