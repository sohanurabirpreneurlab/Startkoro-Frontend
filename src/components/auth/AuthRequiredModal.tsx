import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  title = "Authorization required",
  description = "Please login or sign up to continue.",
}: AuthRequiredModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:justify-start sm:space-x-0">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onLogin();
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onSignup();
            }}
          >
            Sign up
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
