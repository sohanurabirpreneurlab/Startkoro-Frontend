import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatProfileDate(value: string): string {
  return new Date(value).toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !open) {
      return;
    }

    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEmail(user.email ?? "");
    setAddress(user.address ?? "");
    setErrorMessage(null);
  }, [open, user]);

  const hasChanges = useMemo(() => {
    if (!user) {
      return false;
    }

    return (
      firstName.trim() !== (user.firstName ?? "") ||
      lastName.trim() !== (user.lastName ?? "") ||
      email.trim() !== (user.email ?? "") ||
      address.trim() !== (user.address ?? "")
    );
  }, [address, email, firstName, lastName, user]);

  const shouldShowUpdatedAt = user?.createdAt && user?.updatedAt && user.createdAt !== user.updatedAt;

  async function handleSave(): Promise<void> {
    if (!hasChanges) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      await updateProfile({
        firstName,
        lastName,
        email,
        address,
      });
      onOpenChange(false);
    } catch (error) {
      const apiMessage = axios.isAxiosError(error) ? error.response?.data?.message : null;
      setErrorMessage(typeof apiMessage === "string" && apiMessage.trim() ? apiMessage : t("profile.saveError"));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("profile.title")}</DialogTitle>
          <DialogDescription>{t("profile.description")}</DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.signup.firstName")}</label>
                <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.signup.lastName")}</label>
                <Input value={lastName} onChange={(event) => setLastName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.login.email")}</label>
                <Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("auth.signup.mobile")}</label>
                <Input value={user.mobileNumber ?? ""} disabled />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">{t("auth.signup.address")}</label>
              <Textarea className="min-h-[110px]" value={address} onChange={(event) => setAddress(event.target.value)} />
            </div>

            <div className="rounded-xl border bg-background/60 px-4 py-3 text-sm text-muted-foreground">
              <div>{t("profile.createdAt", { date: user.createdAt ? formatProfileDate(user.createdAt) : t("common.unknownDate") })}</div>
              {shouldShowUpdatedAt ? (
                <div className="mt-1">
                  {t("profile.updatedAt", { date: formatProfileDate(user.updatedAt as string) })}
                </div>
              ) : null}
            </div>

            {errorMessage ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button type="button" onClick={() => void handleSave()} disabled={!hasChanges || isSaving}>
            {isSaving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
