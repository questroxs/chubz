/** Deck uploads land here. FormSubmit delivers the JPEG; no mail password is stored in the shop. */
export const SKATE_ART_INBOX = "questroxs18@gmail.com";

/**
 * @param {{ subject: string, message: string, filename: string, jpeg: Uint8Array }} input
 * @returns {Promise<string>}
 */
export async function sendSkateGraphic(input) {
  const filename = input.filename.replace(/[^a-z0-9.-]/gi, "") || "deck.jpg";
  const boundary = `----chubz${crypto.randomUUID().replaceAll("-", "")}`;
  const enc = new TextEncoder();
  /** @param {string} name @param {string} value */
  const field = (name, value) =>
    enc.encode(`--${boundary}\r\nContent-Disposition: form-data; name="${name}"\r\n\r\n${value}\r\n`);
  const parts = [
    field("_subject", input.subject),
    field("_captcha", "false"),
    field("_template", "table"),
    field("deck", input.message),
    enc.encode(
      `--${boundary}\r\nContent-Disposition: form-data; name="attachment"; filename="${filename}"\r\nContent-Type: image/jpeg\r\n\r\n`,
    ),
    input.jpeg,
    enc.encode(`\r\n--${boundary}--\r\n`),
  ];
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const body = new Uint8Array(length);
  let offset = 0;
  for (const part of parts) {
    body.set(part, offset);
    offset += part.length;
  }
  const response = await fetch(`https://formsubmit.co/ajax/${SKATE_ART_INBOX}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${boundary}`,
      Origin: "https://mrchubz.com",
      Referer: "https://mrchubz.com/skate",
    },
    body,
  });
  const text = await response.text();
  if (!response.ok) throw new Error(text.slice(0, 240) || `Mail failed (${response.status})`);
  return text.slice(0, 240);
}
