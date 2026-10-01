import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { CartSheet } from "@/components/cart-sheet";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { ShopHydrated } from "@/components/shop-hydrated";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Chubz" },
      { name: "description", content: "Chubz streetwear. Unisex Printful tees, hoodies, and embroidered caps, plus a wall for city pieces." },
      { name: "theme-color", content: "#070708" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=Rubik+Spray+Paint&display=swap",
      },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <ShopHydrated />
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <CartSheet />
            <div className="flex-1">
              <Outlet />
            </div>
            <SiteFooter />
          </div>
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
