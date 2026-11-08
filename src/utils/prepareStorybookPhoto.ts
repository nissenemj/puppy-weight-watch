export const STORYBOOK_PHOTO_MAX_BYTES = 5 * 1024 * 1024;
export const STORYBOOK_PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

export function validateStorybookPhoto(file: File): string | null {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    return "Valitse JPG-, PNG- tai WebP-kuva.";
  if (!file.size) return "Kuvatiedosto on tyhjä.";
  if (file.size > STORYBOOK_PHOTO_MAX_BYTES)
    return "Valitse enintään 5 Mt:n kuva.";
  return null;
}

/** Re-render locally before upload: small PNG, correct browser orientation and no original EXIF/filename. */
export async function prepareStorybookPhoto(file: File): Promise<Blob> {
  const error = validateStorybookPhoto(file);
  if (error) throw new Error(error);
  const local = URL.createObjectURL(file);
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(
          new Error(
            "Kuvaa ei voitu avata. Valitse toinen JPG-, PNG- tai WebP-kuva.",
          ),
        );
      image.src = local;
    });
    if (!image.naturalWidth || !image.naturalHeight)
      throw new Error("Kuvan koko ei ole kelvollinen.");
    const scale = Math.min(
      1,
      1024 / Math.max(image.naturalWidth, image.naturalHeight),
    );
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error(
        "Selain ei tue kuvan valmistelua. Kokeile toista selainta.",
      );
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const png = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (blob) =>
          blob
            ? resolve(blob)
            : reject(new Error("Kuvan valmistelu epäonnistui.")),
        "image/png",
      ),
    );
    if (png.size > STORYBOOK_PHOTO_MAX_BYTES)
      throw new Error(
        "Kuva on valmistelun jälkeen liian suuri. Valitse pienempi kuva.",
      );
    return png;
  } finally {
    URL.revokeObjectURL(local);
  }
}
