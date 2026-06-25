import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Chrome } from "lucide-react";
import { useForm } from "react-hook-form";

type LoginValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  onSuccess: () => void;
};

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useAuth();
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
          <label className="block text-sm font-medium tracking-tight">Password</label>
          <Input
            className={cn("mt-1", errors.password ? "border-destructive/50" : "")}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 8, message: "Password must be at least 8 characters" },
            })}
          />
          {errors.password ? (
            <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button className="w-full" type="submit" disabled={!isValid || isSubmitting}>
          {isSubmitting ? "Signing in…" : "Login"}
        </Button>
      </form>
    </div>
  );
}

