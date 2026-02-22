"use client";

import { useState, useEffect } from "react";
import { Toaster } from "sileo";
import { useTheme } from "next-themes";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Toaster
      position="bottom-right"
      options={{
        fill: isDark ? "#fafafa" : "#171717",
        roundness: 16,
        styles: {
          title: isDark ? "text-neutral-900!" : "text-white!",
          description: isDark ? "text-neutral-500!" : "text-white/70!",
          badge: isDark ? "bg-black/5!" : "bg-white/10!",
          button: isDark ? "bg-black/5! hover:bg-black/10!" : "bg-white/10! hover:bg-white/15!",
        },
      }}
    >
      {children}
    </Toaster>
  );
}
