"use client";

import { PageTransition } from "@/components/page-transition";
import Script from "next/script";

export function FormClient() {
  const formUrl = process.env.NEXT_PUBLIC_CLICKUP_FORM_URL;
  const darkModeUrl = formUrl ? `${formUrl}?Theme=dark` : "";

  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        <iframe
          className="clickup-embed clickup-dynamic-height"
          src={darkModeUrl}
          width="100%"
          height="100%"
          style={{
            background: "transparent",
            border: "none",
            minHeight: "100vh",
          }}
        />
        <Script
          src="https://app-cdn.clickup.com/assets/js/forms-embed/v1.js"
          strategy="lazyOnload"
        />
      </main>
    </PageTransition>
  );
}
