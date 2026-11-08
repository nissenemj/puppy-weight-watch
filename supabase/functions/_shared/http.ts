export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(status === 204 ? null : JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function readSmallJson(request: Request): Promise<unknown> {
  if (
    !request.headers.get("content-type")?.includes("application/json") ||
    Number(request.headers.get("content-length")) > 4096 ||
    !request.body
  )
    throw new Error("invalid_request");
  const reader = request.body.getReader();
  let text = "",
    length = 0;
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 4096) throw new Error("invalid_request");
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally {
    await reader.cancel();
  }
}

export async function secretMatches(
  supplied: string | null,
  expected: string | undefined,
): Promise<boolean> {
  if (!expected || expected.length < 32 || !supplied || supplied.length > 256)
    return false;
  const encode = (text: string) =>
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const [a, b] = await Promise.all([encode(supplied), encode(expected)]);
  const left = new Uint8Array(a),
    right = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < left.length; i++) diff |= left[i] ^ right[i];
  return diff === 0;
}
