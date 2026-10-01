import { bagProducts, products } from "@/lib/catalog";
import { env } from "@/lib/env.server";

/** Chubz store. Admin token is SHOPIFY_ADMIN_TOKEN. */
const SHOP = "8kq1u0-db.myshopify.com";
export function shopifyConfig() {
  const shop = (env("SHOPIFY_SHOP") ?? SHOP).replace(/^https?:\/\//, "").replace(/\/$/, "");
  const token = env("SHOPIFY_ADMIN_TOKEN");
  if (!shop || !token) return null;
  return { shop, token };
}

export async function pushCatalogToShopify() {
  const cfg = shopifyConfig();
  if (!cfg) return { pushed: false as const, reason: "missing-credentials" as const, count: 0 };
  const catalog = [...products, ...bagProducts];
  let count = 0;
  for (const product of catalog) {
    const response = await fetch(`https://${cfg.shop}/admin/api/2025-01/products.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": cfg.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: {
          title: product.name,
          body_html: product.blurb,
          vendor: "Chubz",
          product_type: product.lane,
          status: "draft",
          variants: product.oneSize
            ? [{ option1: "OS", price: product.price.toFixed(2), sku: product.slug }]
            : ["S", "M", "L", "XL", "XXL"].map((size) => ({
                option1: size,
                price: product.price.toFixed(2),
                sku: `${product.slug}-${size}`,
              })),
          options: product.oneSize ? [{ name: "Size", values: ["OS"] }] : [{ name: "Size", values: ["S", "M", "L", "XL", "XXL"] }],
        },
      }),
    });
    if (response.ok) count += 1;
  }
  return { pushed: count > 0, count };
}
