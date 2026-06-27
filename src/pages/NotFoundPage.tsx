import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="h-full grid place-items-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">{t("notFound.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("notFound.description")}</p>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link to="/">{t("notFound.goHome")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
