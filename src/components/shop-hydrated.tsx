import { useEffect } from "react";
import { useShop } from "@/lib/shop-store";

export function ShopHydrated() {
  const setHydrated = useShop((state) => state.setHydrated);

  useEffect(() => {
    void Promise.resolve(useShop.persist.rehydrate()).finally(() => setHydrated(true));
  }, [setHydrated]);

  return null;
}
