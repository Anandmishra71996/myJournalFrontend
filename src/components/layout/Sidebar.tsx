"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import ThemeToggle from "@/components/ThemeToggle";
import { BRAND_NAME, BRAND_TAGLINE } from "@/constants/brand.constants";
import {
  BookOpenIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isMobileMenuOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const isLocalEnv = process.env.NEXT_PUBLIC_NODE_ENV === "local";

  const navigation = [
    { name: "Journal", href: "/journal", icon: BookOpenIcon },
    { name: "Templates", href: "/templates", icon: DocumentTextIcon },
    ...(isLocalEnv
      ? [{ name: "Chat", href: "/chat", icon: ChatBubbleLeftRightIcon }]
      : []),
    { name: "Goals", href: "/goals", icon: ChartBarIcon },
    { name: "Insights", href: "/insights", icon: SparklesIcon },
    { name: "Profile", href: "/profile", icon: UserCircleIcon },
    { name: "Subscription", href: "/subscription", icon: CreditCardIcon },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isActivePath = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-72 flex flex-col h-screen
        border-r backdrop-blur-xl
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-surface-elevated) 92%, transparent)",
        borderColor: "color-mix(in srgb, var(--color-border) 55%, transparent)",
      }}
    >
      <div
        className="relative overflow-hidden p-6 border-b flex items-center justify-between"
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-border) 50%, transparent)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-20 -right-8 h-44 w-44 rounded-full blur-3xl"
          style={{
            background:
              "color-mix(in srgb, var(--color-primary) 30%, transparent)",
          }}
        />
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Journal Logo" className="w-10 h-10" />
          <div>
            <h1
              className="text-xl font-semibold tracking-tight"
              style={{ color: "var(--color-text-primary)" }}
            >
              {BRAND_NAME}
            </h1>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {BRAND_TAGLINE}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg transition-colors"
          style={{ color: "var(--color-text-secondary)" }}
          aria-label="Close menu"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = isActivePath(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className="group relative flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
              style={{
                color: isActive
                  ? "var(--color-text-primary)"
                  : "var(--color-text-secondary)",
                backgroundColor: isActive
                  ? "color-mix(in srgb, var(--color-primary) 16%, transparent)"
                  : "transparent",
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-2.5 h-7 w-1 rounded-r-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
              )}
              <item.icon
                className="w-5 h-5 mr-3 transition-colors"
                style={{
                  color: isActive
                    ? "var(--color-primary)"
                    : "var(--color-text-tertiary)",
                }}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div
        className="p-4 border-t space-y-2"
        style={{
          borderColor:
            "color-mix(in srgb, var(--color-border) 50%, transparent)",
        }}
      >
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-xl transition-colors"
          style={{
            color: "var(--color-error)",
            backgroundColor: "transparent",
          }}
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
          Logout
        </button>
        {user?.email && (
          <p
            className="px-4 text-xs"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            {user.email}
          </p>
        )}
      </div>
    </div>
  );
}
