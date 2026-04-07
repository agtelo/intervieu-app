"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, FileText, Mic2 } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
  iconType?: string;
}

function getBreadcrumbIcon(iconType?: string) {
  const iconProps = "w-4 h-4";
  switch (iconType) {
    case "home":
      return <Home className={iconProps} />;
    case "dashboard":
      return <BarChart3 className={iconProps} />;
    case "prep":
      return <FileText className={iconProps} />;
    case "session":
      return <Mic2 className={iconProps} />;
    default:
      return null;
  }
}

export function Breadcrumb() {
  const pathname = usePathname();

  let items: BreadcrumbItem[] = [
    { label: "Inicio", href: "/", iconType: "home" },
  ];

  if (pathname.startsWith("/dashboard")) {
    items.push({ label: "Dashboard", href: "/dashboard", iconType: "dashboard" });
  } else if (pathname.startsWith("/prep/") && pathname !== "/prep") {
    items.push(
      { label: "Preparar", href: "/prep", iconType: "prep" },
      { label: "Sesión", iconType: "session" }
    );
  } else if (pathname === "/prep") {
    items.push({ label: "Preparar", iconType: "prep" });
  }

  return (
    <nav className="flex items-center gap-2 text-xs text-text-muted font-mono px-5 py-3 border-b border-border/50">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {item.href ? (
            <Link
              href={item.href}
              className="flex items-center gap-1 hover:text-text transition-colors"
            >
              {item.iconType && getBreadcrumbIcon(item.iconType)}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="flex items-center gap-1 text-text-dim">
              {item.iconType && getBreadcrumbIcon(item.iconType)}
              <span>{item.label}</span>
            </span>
          )}
          {idx < items.length - 1 && (
            <span className="text-text-dim">/</span>
          )}
        </div>
      ))}
    </nav>
  );
}
