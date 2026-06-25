import { Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title="Light theme"
    >
      <Sun className="h-4 w-4" />
      <span className="sr-only">Light theme</span>
    </Button>
  );
}
