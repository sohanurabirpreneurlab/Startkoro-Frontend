import { Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export function ThemeToggle() {
  const { toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={t("common.lightTheme")}
    >
      <Sun className="h-4 w-4" />
      <span className="sr-only">{t("common.lightTheme")}</span>
    </Button>
  );
}
