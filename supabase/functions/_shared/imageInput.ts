import { ImageFailure } from "./storybook.ts";

const MAX = 5 * 1024 * 1024;
const signature = [137, 80, 78, 71, 13, 10, 26, 10];
const table = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let n = 0; n < 8; n++)
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  return value >>> 0;
});
function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;
  for (const value of bytes) crc = table[(crc ^ value) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** Browser-normalized PNG only. Strip EXIF, text and all other nonessential metadata again on the server. */
export function sanitizePhotoPng(bytes: Uint8Array): Uint8Array {
  const invalid = () => new ImageFailure("invalid_input_image", "rejected");
  if (
    bytes.length < 45 ||
    bytes.length > MAX ||
    !signature.every((value, index) => bytes[index] === value)
  )
    throw invalid();
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const kept: Uint8Array[] = [bytes.subarray(0, 8)];
  let offset = 8,
    chunks = 0,
    sawData = false,
    sawEnd = false;
  while (offset < bytes.length) {
    if (++chunks > 1000 || offset + 12 > bytes.length) throw invalid();
    const length = view.getUint32(offset);
    const end = offset + 12 + length;
    if (end > bytes.length) throw invalid();
    const kind = String.fromCharCode(...bytes.subarray(offset + 4, offset + 8));
    if (crc32(bytes.subarray(offset + 4, end - 4)) !== view.getUint32(end - 4))
      throw invalid();
    if (chunks === 1) {
      if (kind !== "IHDR" || length !== 13) throw invalid();
      const width = view.getUint32(offset + 8),
        height = view.getUint32(offset + 12);
      if (
        !width ||
        !height ||
        width > 1024 ||
        height > 1024 ||
        bytes[offset + 16] !== 8 ||
        ![2, 6].includes(bytes[offset + 17])
      )
        throw invalid();
    } else if (kind === "IHDR") throw invalid();
    if (["IHDR", "PLTE", "tRNS", "IDAT", "IEND"].includes(kind))
      kept.push(bytes.subarray(offset, end));
    if (kind === "IDAT") sawData = true;
    if (kind === "IEND") {
      if (length !== 0 || end !== bytes.length) throw invalid();
      sawEnd = true;
    }
    offset = end;
  }
  if (!sawData || !sawEnd) throw invalid();
  const result = new Uint8Array(
    kept.reduce((sum, part) => sum + part.length, 0),
  );
  let cursor = 0;
  for (const part of kept) {
    result.set(part, cursor);
    cursor += part.length;
  }
  return result;
}
