import { getRequest } from "@tanstack/react-start/server";

function skateHost(hostname: string) {
  const host = hostname.toLowerCase().split(":")[0];
  if (host === "mrchubz.com" || host === "www.mrchubz.com") return false;
  return host === "localhost" || host === "127.0.0.1" || host === "vercel.app" || host.endsWith(".vercel.app");
}

export function requestIsSkateHost() {
  const request = getRequest();
  const hosts = [request.headers.get("host"), request.headers.get("x-forwarded-host")]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((host) => host.trim().split(":")[0].toLowerCase())
    .filter(Boolean);
  if (hosts.length === 0) return false;
  if (hosts.some((host) => host === "mrchubz.com" || host === "www.mrchubz.com")) return false;
  return hosts.every((host) => skateHost(host));
}
