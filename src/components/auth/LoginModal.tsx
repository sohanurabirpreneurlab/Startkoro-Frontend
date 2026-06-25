import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import { AuthShell } from "./AuthShell";
import { LoginForm } from "./LoginForm";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-transparent shadow-none p-0 max-w-[520px]">
        <AnimatePresence mode="wait">
          {open ? (
            <AuthShell
              title="Welcome back"
              subtitle="Login to continue using your real backend account."
            >
              <LoginForm onSuccess={() => onOpenChange(false)} />
            </AuthShell>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
