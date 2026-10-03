import tls from "node:tls";

/** Deck uploads land here. Sent through Gmail using a send-only app password. */
export const SKATE_ART_INBOX = "questroxs18@gmail.com";

/**
 * @param {{ subject: string, message: string, filename: string, jpeg: Uint8Array, proof?: Uint8Array, proofName?: string }} input
 */
export async function sendSkateGraphic(input) {
  const password = (process.env.GMAIL_APP_PASSWORD || "").replace(/\s/g, "");
  if (password.length < 16) throw new Error("Gmail app password is not set");
  const filename = input.filename.replace(/[^a-z0-9.-]/gi, "") || "deck.jpg";
  const boundary = `chubz${crypto.randomUUID().replaceAll("-", "")}`;
  const subject = input.subject.replace(/[\r\n]/g, " ").slice(0, 180);
  const text = input.message.replace(/\r?\n/g, "\r\n");
  const files = [{ filename, jpeg: input.jpeg }];
  if (input.proof) files.push({ filename: input.proofName || "placement.jpg", jpeg: input.proof });
  const parts = [
    `From: Chubz <${SKATE_ART_INBOX}>`,
    `To: ${SKATE_ART_INBOX}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=utf-8",
    "",
    text,
  ];
  for (const file of files) {
    const safe = file.filename.replace(/[^a-z0-9.-]/gi, "") || "deck.jpg";
    const image = Buffer.from(file.jpeg).toString("base64").replace(/.{1,76}/g, "$&\r\n").trim();
    parts.push(
      `--${boundary}`,
      `Content-Type: image/jpeg; name="${safe}"`,
      `Content-Disposition: attachment; filename="${safe}"`,
      "Content-Transfer-Encoding: base64",
      "",
      image,
    );
  }
  parts.push(`--${boundary}--`, "");
  const mime = parts.join("\r\n");
  const stuffed = mime
    .split("\r\n")
    .map((line) => (line.startsWith(".") ? `.${line}` : line))
    .join("\r\n");
  await smtpSend(password, stuffed);
  return "sent";
}

/**
 * @param {string} password
 * @param {string} data
 */
function smtpSend(password, data) {
  const user = SKATE_ART_INBOX;
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com" });
    let buf = "";
    /** @type {null | (() => void)} */
    let pump = null;
    let settled = false;
    /** @type {(error: unknown) => void} */
    const fail = (error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      reject(error instanceof Error ? error : new Error(String(error)));
    };
    const done = () => {
      if (settled) return;
      settled = true;
      socket.end();
      resolve("sent");
    };
    const readReply = () =>
      new Promise((res, rej) => {
        const take = () => {
          const match = buf.match(/(?:\d{3}-[^\r]*\r\n)*\d{3} [^\r]*\r\n/);
          if (!match) return;
          const reply = match[0];
          buf = buf.slice(reply.length);
          pump = null;
          const last = reply.trim().split("\r\n").at(-1) ?? "";
          const code = Number(last.slice(0, 3));
          const text = reply.replaceAll("\r\n", " | ").slice(0, 240);
          if (code >= 400) rej(new Error(text));
          else res(text);
        };
        pump = take;
        take();
      });
    socket.on("data", (chunk) => {
      buf += chunk.toString("latin1");
      pump?.();
    });
    socket.on("error", fail);
    socket.setTimeout(20_000, () => fail(new Error("Gmail timed out")));
    void (async () => {
      try {
        await readReply();
        socket.write("EHLO mrchubz.com\r\n");
        await readReply();
        socket.write("AUTH LOGIN\r\n");
        await readReply();
        socket.write(`${Buffer.from(user).toString("base64")}\r\n`);
        await readReply();
        socket.write(`${Buffer.from(password).toString("base64")}\r\n`);
        await readReply();
        socket.write(`MAIL FROM:<${user}>\r\n`);
        await readReply();
        socket.write(`RCPT TO:<${user}>\r\n`);
        await readReply();
        socket.write("DATA\r\n");
        await readReply();
        socket.write(`${data}\r\n.\r\n`);
        await readReply();
        socket.write("QUIT\r\n");
        done();
      } catch (error) {
        fail(error);
      }
    })();
  });
}
