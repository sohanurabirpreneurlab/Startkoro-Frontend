import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Chrome } from "lucide-react";
import { useForm } from "react-hook-form";

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
        Continue with Google
      </Button>

      <div className="flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </div>

      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium tracking-tight">First name</label>
            <Input
              className={cn("mt-1", errors.firstName ? "border-destructive/50" : "")}
              placeholder="First"
              {...register("firstName", { required: "First name is required" })}
            />
            {errors.firstName ? (
              <p className="mt-1 text-xs text-destructive">{errors.firstName.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium tracking-tight">Last name</label>
            <Input
              className={cn("mt-1", errors.lastName ? "border-destructive/50" : "")}
              placeholder="Last"
              {...register("lastName", { required: "Last name is required" })}
            />
            {errors.lastName ? (
              <p className="mt-1 text-xs text-destructive">{errors.lastName.message}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium tracking-tight">Email</label>
          <Input
            className={cn("mt-1", errors.email ? "border-destructive/50" : "")}
            placeholder="you@example.com"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          {errors.email ? <p className="mt-1 text-xs text-destructive">{errors.email.message}</p> : null}
        </div>

        <div>
          <label className="block text-sm font-medium tracking-tight">Mobile number</label>
          <Input
            className={cn("mt-1", errors.mobileNumber ? "border-destructive/50" : "")}
            placeholder="+8801712345678"
            inputMode="tel"
            autoComplete="tel"
            {...register("mobileNumber", {
              required: "Mobile number is required",
              pattern: { value: /^[0-9()+\-\s]{6,}$/, message: "Enter a valid mobile number" },
            })}
          />
          {errors.mobileNumber ? (
            <p className="mt-1 text-xs text-destructive">{errors.mobileNumber.message}</p>
          ) : null}
        </div>

        <div>
          <label className="block text-sm font-medium tracking-tight">Address</label>
          <Input
            className={cn("mt-1", errors.address ? "border-destructive/50" : "")}
            placeholder="Street, city, country"
            autoComplete="street-address"
            {...register("address", {
              required: "Address is required",
              minLength: { value: 5, message: "Address must be at least 5 characters" },
            })}
          />
          {errors.address ? (
            <p className="mt-1 text-xs text-destructive">{errors.address.message}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium tracking-tight">Password</label>
            <Input
              className={cn("mt-1", errors.password ? "border-destructive/50" : "")}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm font-medium tracking-tight">Confirm password</label>
            <Input
              className={cn("mt-1", errors.confirmPassword ? "border-destructive/50" : "")}
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-xs text-destructive">{errors.confirmPassword.message}</p>
            ) : null}
          </div>
        </div>

        <Button className="w-full" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
