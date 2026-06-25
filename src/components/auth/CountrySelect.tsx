import { cn } from "@/lib/utils";

type CountryOption = { code: string; label: string };

const OPTIONS: CountryOption[] = [
  { code: "+1", label: "US/CA (+1)" },
  { code: "+880", label: "BD (+880)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+234", label: "NG (+234)" },
  { code: "+91", label: "IN (+91)" },
  { code: "+61", label: "AU (+61)" },
  { code: "+33", label: "FR (+33)" },
  { code: "+49", label: "DE (+49)" },
];

type CountrySelectProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
};

export function CountrySelect({ value, onChange, disabled, error }: CountrySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium tracking-tight">Country code</label>
      <select
        className={cn(
          "mt-1 h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring",
          error ? "border-destructive/50" : "",
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        <option value="" disabled>
          Select…
        </option>
        {OPTIONS.map((o) => (
          <option key={o.code} value={o.code}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

