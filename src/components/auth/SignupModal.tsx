import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import { AuthShell } from "./AuthShell";
import { SignupForm } from "./SignupForm";

type SignupModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SignupModal({ open, onOpenChange }: SignupModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-transparent shadow-none p-0 max-w-[560px]">
        <AnimatePresence mode="wait">
          {open ? (
            <AuthShell
              title="Create your account"
              subtitle="Sign up to create a real backend account for testing."
            >
              <SignupForm onSuccess={() => onOpenChange(false)} />
            </AuthShell>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
