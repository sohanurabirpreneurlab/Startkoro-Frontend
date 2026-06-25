import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type AuthShellProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={cn(
        "rounded-2xl bg-gradient-to-b from-primary/40 via-border to-transparent p-[1px]",
        "shadow-[0_0_0_1px_hsl(var(--primary)/0.15),0_25px_80px_rgba(0,0,0,0.55)]",
      )}
    >
      <div className="rounded-2xl border bg-card/55 backdrop-blur-xl px-5 py-5">
        <div>
          <div className="text-lg font-semibold tracking-tight">{title}</div>
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}

