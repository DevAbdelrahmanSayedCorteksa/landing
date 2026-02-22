"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconUser, IconLogout, IconChevronDown } from "@tabler/icons-react";
import { getWorkspaceSubdomain, getToken, getRefreshToken, buildSSORedirectUrl } from "@/lib/services/AuthLocalService";

interface UserProfileDropdownProps {
  user: {
    id: number;
    email: string;
    name?: string;
  };
  onLogout: () => void;
}

export function UserProfileDropdown({
  user,
  onLogout,
}: UserProfileDropdownProps) {
  const handleWorkspaceClick = () => {
    const subdomain = getWorkspaceSubdomain();
    if (subdomain) {
      const token = getToken();
      const refreshToken = getRefreshToken();
      if (token && refreshToken) {
        window.location.href = buildSSORedirectUrl(subdomain, token, refreshToken, false);
      } else {
        window.location.href = `https://${subdomain}.corteksa.net`;
      }
    } else {
      window.location.href = "/multi-step-form";
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Go to Workspace Button */}
      <Button onClick={handleWorkspaceClick}>Go to Workspace</Button>

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary">
              <IconUser className="size-4" />
            </div>
            <span className="hidden sm:inline-block max-w-[120px] truncate text-sm">
              {user.name || user.email.split("@")[0]}
            </span>
            <IconChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={onLogout}
            variant="destructive"
            className="cursor-pointer"
          >
            <IconLogout className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
