import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AuthShell } from "./AuthShell";
import { LoginForm } from "./LoginForm";

type LoginModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 bg-transparent shadow-none p-0 max-w-[520px]">
        <AnimatePresence mode="wait">
          {open ? (
            <AuthShell title={t("auth.login.title")} subtitle={t("auth.login.subtitle")}>
              <LoginForm onSuccess={() => onOpenChange(false)} />
            </AuthShell>
          ) : null}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
