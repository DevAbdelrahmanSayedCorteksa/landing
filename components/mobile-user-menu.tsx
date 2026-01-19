"use client";

import { Button } from "@/components/ui/button";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { getWorkspaceSubdomain } from "@/lib/services/AuthLocalService";

interface MobileUserMenuProps {
  user: {
    id: number;
    email: string;
    name?: string;
  };
  onLogout: () => void;
}

export function MobileUserMenu({ user, onLogout }: MobileUserMenuProps) {
  const handleWorkspaceClick = () => {
    const subdomain = getWorkspaceSubdomain();
    if (subdomain) {
      window.location.href = `https://${subdomain}.corteksa.net`;
    } else {
      window.location.href = "/multi-step-form";
    }
  };

  return (
    <div className="space-y-4">
      {/* User Info */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
        <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
          <IconUser className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {user.name || user.email.split("@")[0]}
          </span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <Button onClick={handleWorkspaceClick} className="w-full">
          Go to Workspace
        </Button>
        <Button
          variant="outline"
          onClick={onLogout}
          className="w-full gap-2 text-destructive hover:text-destructive"
        >
          <IconLogout className="size-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
