export function flattenStripeParams(
  input: unknown,
  prefix = "",
  out = new URLSearchParams(),
): URLSearchParams {
  if (input === null || input === undefined) return out;
  if (Array.isArray(input)) {
    input.forEach((value, index) => {
      flattenStripeParams(value, prefix ? `${prefix}[${index}]` : String(index), out);
    });
    return out;
  }
  if (typeof input === "object") {
    for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
      flattenStripeParams(value, prefix ? `${prefix}[${key}]` : key, out);
    }
    return out;
  }
  if (typeof input === "boolean") {
    out.append(prefix, input ? "true" : "false");
    return out;
  }
  out.append(prefix, String(input));
  return out;
}
