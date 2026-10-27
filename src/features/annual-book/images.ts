import { supabase } from "@/integrations/supabase/client";
import {
  puppyBookImagePath,
  PUPPY_IMAGE_MAX_BYTES,
} from "@/services/puppyBookStorage";
import { encodeBookImage } from "./imageEncoding";

/** Authenticated download followed by local resizing; no public URL or external image service. */
export async function loadBookImage(reference: string): Promise<string> {
  const path = puppyBookImagePath(reference);
  if (!path)
    throw new Error(
      "Kuvan osoite ei ole kelvollinen. Poista muisto valinnasta tai korjaa kuva Muistot-osiossa.",
    );
  const { data, error } = await supabase.storage
    .from("puppy-books")
    .download(path);
  if (error || !data)
    throw new Error(
      "Yhden kuvan lataus epäonnistui. Yritä uudelleen tai poista muisto valinnasta.",
    );
  if (
    !/^image\/(jpeg|png|webp)$/.test(data.type) ||
    data.size > PUPPY_IMAGE_MAX_BYTES ||
    data.size === 0
  )
    throw new Error("Yhden kuvan tiedostomuoto tai koko ei sovellu kirjaan.");
  const url = URL.createObjectURL(data);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    return encodeBookImage(image);
  } finally {
    URL.revokeObjectURL(url);
  }
}
