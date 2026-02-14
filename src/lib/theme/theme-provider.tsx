"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState, type ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      // storageKey="theme"
      enableSystem={false}
      themes={["dark", "light"]}
    >
      {children}
    </NextThemesProvider>
  );
}
