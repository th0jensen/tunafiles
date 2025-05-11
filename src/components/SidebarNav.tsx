"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import {
  Home,
  Car,
  ShoppingCart,
  Users,
  Contact,
  FileArchive,
  Tags,
  Fish,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/cars", label: "Cars", icon: Car },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/customers", label: "Customers", icon: Contact },
  { href: "/binaries", label: "Binaries", icon: FileArchive },
  { href: "/tags", label: "Tags", icon: Tags },
  { href: "/users", label: "Users", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (window.innerWidth < 640) {
      setIsExpanded(false);
    }
  }, []);

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen flex-col space-y-2 border-r border-gray-200 bg-gray-50 p-4 transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900",
        isExpanded ? "w-64" : "w-20",
      )}
    >
      <div className="mb-4 flex items-center justify-between px-2">
        <Link
          href="/"
          className={cn(
            "flex items-center space-x-2",
            !isExpanded && "justify-start",
          )}
        >
          <Fish className="h-8 w-8 flex-shrink-0 text-blue-600" />
          {isExpanded && (
            <span className="mr-5 text-xl font-bold text-gray-800 dark:text-gray-100">
              TunaFiles
            </span>
          )}
        </Link>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <li className="flex justify-start" key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex w-40 items-center space-x-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    !isExpanded && "justify-start",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50",
                  )}
                  title={!isExpanded ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {isExpanded && (
                    <span className="sm:hidden md:inline">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      {isExpanded && (
        <div className="mb-4 flex justify-start px-2">
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>
      )}
      {!isExpanded && (
        <div className="mb-4 flex justify-start px-2">
          <button
            onClick={toggleSidebar}
            className="flex h-8 w-8 items-center justify-center rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-5 w-5" />
          </button>
        </div>
      )}
    </aside>
  );
}
