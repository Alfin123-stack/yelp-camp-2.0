"use client";

import { User, LogOut, ChevronDown } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";

interface UserMenuProps {
  username: string;
  onLogout: () => Promise<void>;
}

// Client component so the trigger/dropdown can be interactive — the
// session read (which needs to stay server-side) happens in the parent
// <NavAuthLinks>, which passes down just the display name and a server
// action for the logout form.
export default function UserMenu({ username, onLogout }: UserMenuProps) {
  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="group border border-forest-800/60 bg-forest-900/60 text-cream-100 hover:border-gold-400/60 hover:bg-forest-900 data-[state=open]:border-gold-400/60 data-[state=open]:bg-forest-900">
            <span className="flex size-6 items-center justify-center rounded-full bg-gold-400 text-forest-950">
              <User className="h-3.5 w-3.5" />
            </span>
            <span className="max-w-[10rem] truncate">{username}</span>
            <ChevronDown className="h-3.5 w-3.5 text-cream-100/60 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div className="w-48 overflow-hidden rounded-xl border border-forest-100 bg-white p-1.5 shadow-xl shadow-forest-900/10">
              <div className="px-2.5 py-1.5">
                <p className="truncate text-xs text-forest-700/60">Signed in as</p>
                <p className="truncate text-sm font-medium text-forest-950">{username}</p>
              </div>
              <div className="my-1 h-px bg-forest-100" />
              <form action={onLogout}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-forest-700 transition-colors hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </form>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}