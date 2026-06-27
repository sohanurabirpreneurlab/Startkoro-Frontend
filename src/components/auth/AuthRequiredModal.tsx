import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

type AuthRequiredModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: () => void;
  onSignup: () => void;
  title?: string;
  description?: string;
};

export function AuthRequiredModal({
  open,
  onOpenChange,
  onLogin,
  onSignup,
  title,
  description,
}: AuthRequiredModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title ?? t("auth.requiredTitle")}</DialogTitle>
          <DialogDescription>{description ?? t("auth.requiredDescription")}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-start sm:space-x-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onLogin();
            }}
          >
            {t("navbar.login")}
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onSignup();
            }}
          >
            {t("navbar.signup")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
