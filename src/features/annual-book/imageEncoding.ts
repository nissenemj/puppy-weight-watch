export const BOOK_IMAGE_MAX_EDGE = 1400;

/** Keep A5 photos sharp enough to print without embedding huge decoded WebP bitmaps. */
export function encodeBookImage(image: HTMLImageElement): string {
  const scale = Math.min(
    1,
    BOOK_IMAGE_MAX_EDGE / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Selain ei pystynyt käsittelemään kuvaa.");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const result = canvas.toDataURL("image/jpeg", 0.84);
  if (result.length > 1_000_000)
    throw new Error(
      "Yksi kuvista on liian suuri kirjan esikatseluun. Valitse pienempi kuva.",
    );
  return result;
}
