import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Globe } from "lucide-react";

const locales = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(currentPath);
  };

  return (
    <div className="relative group">
      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-accent transition-colors">
        <Globe className="w-5 h-5 text-muted-foreground" />
      </button>

      <div className="absolute right-0 top-full mt-2 w-40 py-2 bg-popover rounded-lg border border-border shadow-lg opacity-0 translate-y-2 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-200">
        {locales.map((l) => (
          <button
            key={l.code}
            onClick={() => handleLocaleChange(l.code)}
            className={`
              w-full px-4 py-2 text-sm text-left transition-colors
              ${
                locale === l.code
                  ? "text-foreground bg-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }
            `}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
