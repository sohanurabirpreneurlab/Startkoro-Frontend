import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginValues>({ mode: "onChange", defaultValues: { email: "", password: "" } });

  async function onSubmit(values: LoginValues) {
    console.log("Login submit:", values);
    await login(values);
    onSuccess();
  }

  return (
    <div className="space-y-4">
      {/* <Button
        type="button"
        variant="outline"
        className="w-full justify-center bg-background/30 backdrop-blur"
        onClick={() => console.log("Google auth (demo)")}
      >
        <Chrome className="h-4 w-4" />
        {t("auth.login.google")}
      </Button> */}

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">{t("auth.login.divider")}</span>
        <Separator className="flex-1" />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="block text-sm font-medium tracking-tight">{t("auth.login.email")}</label>
          <Input
            className={cn("mt-1", errors.email ? "border-destructive/50" : "")}
            placeholder={t("auth.login.emailPlaceholder")}
            type="email"
            autoComplete="email"
            {...register("email", {
              required: t("auth.login.emailRequired"),
              pattern: { value: /^\S+@\S+\.\S+$/, message: t("auth.login.emailInvalid") },
            })}
          />
          {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium tracking-tight">{t("auth.login.password")}</label>
          <Input
            className={cn("mt-1", errors.password ? "border-destructive/50" : "")}
            placeholder={t("auth.login.passwordPlaceholder")}
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: t("auth.login.passwordRequired"),
              minLength: { value: 8, message: t("auth.login.passwordMin") },
            })}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button className="w-full" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
        </Button>
      </form>
    </div>
  );
}
