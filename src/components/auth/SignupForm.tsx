import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

type SignupValues = {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  password: string;
  confirmPassword: string;
};

type SignupFormProps = {
  onSuccess: () => void;
};

export function SignupForm({ onSuccess }: SignupFormProps) {
  const { signup } = useAuth();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignupValues>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  async function onSubmit(values: SignupValues) {
    console.log("Signup submit:", values);
    await signup({
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      mobileNumber: values.mobileNumber,
      address: values.address,
      password: values.password,
    });
    onSuccess();
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        variant="outline"
        className="w-full justify-center bg-background/30 backdrop-blur"
        onClick={() => console.log("Google auth (demo)")}
      >
        <Chrome className="h-4 w-4" />
        {t("auth.login.google")}
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">{t("auth.login.divider")}</span>
        <Separator className="flex-1" />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium tracking-tight">{t("auth.signup.firstName")}</label>
            <Input
              className={cn("mt-1", errors.firstName ? "border-destructive/50" : "")}
              placeholder={t("auth.signup.firstNamePlaceholder")}
              {...register("firstName", { required: t("auth.signup.firstNameRequired") })}
            />
            {errors.firstName ? (
              <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium tracking-tight">{t("auth.signup.lastName")}</label>
            <Input
              className={cn("mt-1", errors.lastName ? "border-destructive/50" : "")}
              placeholder={t("auth.signup.lastNamePlaceholder")}
              {...register("lastName", { required: t("auth.signup.lastNameRequired") })}
            />
            {errors.lastName ? (
              <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>
            ) : null}
          </div>
        </div>

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
          <label className="block text-sm font-medium tracking-tight">{t("auth.signup.mobile")}</label>
          <Input
            className={cn("mt-1", errors.mobileNumber ? "border-destructive/50" : "")}
            placeholder={t("auth.signup.mobilePlaceholder")}
            inputMode="tel"
            autoComplete="tel"
            {...register("mobileNumber", {
              required: t("auth.signup.mobileRequired"),
              pattern: { value: /^[0-9()+\-\s]{6,}$/, message: t("auth.signup.mobileInvalid") },
            })}
          />
          {errors.mobileNumber ? (
            <p className="mt-1 text-xs text-destructive">{errors.mobileNumber.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium tracking-tight">{t("auth.signup.address")}</label>
          <Input
            className={cn("mt-1", errors.address ? "border-destructive/50" : "")}
            placeholder={t("auth.signup.addressPlaceholder")}
            autoComplete="street-address"
            {...register("address", {
              required: t("auth.signup.addressRequired"),
              minLength: { value: 5, message: t("auth.signup.addressMin") },
            })}
          />
          {errors.address ? (
            <p className="mt-1 text-xs text-destructive">{errors.address.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium tracking-tight">{t("auth.login.password")}</label>
            <Input
              className={cn("mt-1", errors.password ? "border-destructive/50" : "")}
              placeholder={t("auth.login.passwordPlaceholder")}
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: t("auth.login.passwordRequired"),
                minLength: { value: 8, message: t("auth.login.passwordMin") },
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium tracking-tight">{t("auth.signup.confirmPassword")}</label>
            <Input
              className={cn("mt-1", errors.confirmPassword ? "border-destructive/50" : "")}
              placeholder={t("auth.login.passwordPlaceholder")}
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: t("auth.signup.confirmPasswordRequired"),
                validate: (value) => value === password || t("auth.signup.passwordMismatch"),
              })}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
            ) : null}
          </div>
        </div>

        <Button className="w-full" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? t("auth.signup.submitting") : t("auth.signup.submit")}
        </Button>
      </form>
    </div>
  );
}
