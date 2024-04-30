import { verifyKey } from "discord-interactions";

// This function can be marked `async` if using `await` inside
export function middleware(req) {
  const signature = req.get("X-Signature-Ed25519");
  const timestamp = req.get("X-Signature-Timestamp");

  const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
  if (!isValidRequest) {
    res.status(401).send("Bad request signature");
    throw new Error("Bad request signature");
  }
}
