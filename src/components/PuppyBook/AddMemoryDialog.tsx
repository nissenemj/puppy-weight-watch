import React, { useEffect, useState, useRef } from "react";
import {
  X,
  Camera,
  Upload,
  MapPin,
  Tag,
  Type,
  Image,
  Heart,
  Calendar,
  Award,
} from "@/utils/iconImports";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  PUPPY_IMAGE_ACCEPT,
  uploadPuppyBookImage,
  validatePuppyImage,
} from "@/services/puppyBookStorage";

interface AddMemoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  bookId: string;
  type: "photo" | "text" | "event" | "milestone";
  onMemoryAdded: () => void;
  onTypeChange?: (type: "photo" | "text" | "event" | "milestone") => void;
}

const AddMemoryDialog: React.FC<AddMemoryDialogProps> = ({
  isOpen,
  onClose,
  bookId,
  type,
  onMemoryAdded,
  onTypeChange,
}) => {
  const [uploading, setUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const selectFile = (file: File) => {
    if (uploading) return;
    const validationError = validatePuppyImage(file);
    if (validationError) {
      setSubmitError(validationError);
      toast({
        title: "Virheellinen tiedosto",
        description: validationError,
        variant: "destructive",
      });
      return;
    }
    setSubmitError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) selectFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (uploading) return;

    setSubmitError(null);
    if (type === "photo" && !selectedFile) {
      setSubmitError("Valitse kuva ensin.");
      toast({
        title: "Virhe",
        description: "Valitse kuva ensin",
        variant: "destructive",
      });
      return;
    }

    if (type === "text" && !caption.trim()) {
      setSubmitError("Kirjoita muisto ensin.");
      toast({
        title: "Virhe",
        description: "Kirjoita muisto ensin",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Check authentication first
      const { data: user, error: authError } = await supabase.auth.getUser();

      if (authError || !user.user) {
        throw new Error("Et ole kirjautunut sisään");
      }

      // Check if book belongs to user
      const { data: bookCheck, error: bookError } = await supabase
        .from("puppy_books")
        .select("owner_id")
        .eq("id", bookId)
        .single();

      if (bookError || !bookCheck) {
        throw new Error("Pentukirjaa ei löydy");
      }

      if (bookCheck.owner_id !== user.user.id) {
        throw new Error("Sinulla ei ole oikeutta muokata tätä pentukirjaa");
      }

      let contentUrl = null;

      if (selectedFile && type === "photo") {
        contentUrl = await uploadPuppyBookImage(selectedFile, bookId);
      }

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const locationData = location.trim() ? { name: location.trim() } : null;

      // Map type to correct content_type
      const contentType =
        type === "photo"
          ? "image"
          : type === "milestone"
            ? "milestone"
            : type === "event"
              ? "event"
              : "text";

      const memoryData = {
        book_id: bookId,
        content_type: contentType,
        content_url: contentUrl,
        caption: caption.trim() || null,
        tags: tagsArray,
        location: locationData,
        created_by: user.user.id,
      };

      const { error } = await supabase
        .from("memories")
        .insert(memoryData)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Onnistui!",
        description:
          type === "photo" ? "Kuva lisätty muistoihin" : "Muisto lisätty",
      });

      // Reset form
      setCaption("");
      setTags("");
      setLocation("");
      setSelectedFile(null);
      setPreviewUrl("");

      onMemoryAdded();
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Muiston lisääminen epäonnistui. Tarkista käyttöoikeus ja yhteys.";
      setSubmitError(errorMessage);
      toast({
        title: "Virhe",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getDialogTitle = () => {
    switch (type) {
      case "photo":
        return "Lisää kuva";
      case "text":
        return "Lisää muisto";
      case "event":
        return "Lisää tapahtuma";
      case "milestone":
        return "Lisää virstanpylväs";
      default:
        return "Lisää muisto";
    }
  };

  const getDialogIcon = () => {
    switch (type) {
      case "photo":
        return Camera;
      case "text":
        return Heart;
      case "event":
        return Calendar;
      case "milestone":
        return Award;
      default:
        return Camera;
    }
  };

  const Icon = getDialogIcon();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open && !uploading) onClose();
      }}
    >
      <DialogContent
        className="puppy-journal max-w-md"
        onEscapeKeyDown={(event) => {
          if (uploading) event.preventDefault();
        }}
        onInteractOutside={(event) => {
          if (uploading) event.preventDefault();
        }}
        onOpenAutoFocus={() => {
          if (document.activeElement instanceof HTMLElement)
            returnFocusRef.current = document.activeElement;
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          if (returnFocusRef.current?.isConnected)
            returnFocusRef.current.focus();
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 pr-8">
            <Icon size={22} className="text-[#245246]" aria-hidden="true" />
            {getDialogTitle()}
          </DialogTitle>
          <DialogDescription>
            Kuva, pieni tarina tai molemmat. Tallenna hetki pennun omaan
            kirjaan.
          </DialogDescription>
        </DialogHeader>
        {onTypeChange && (type === "photo" || type === "text") && (
          <div className="flex gap-2" role="group" aria-label="Muiston tyyppi">
            <button
              type="button"
              className={`journal-button ${type === "text" ? "" : "journal-button-secondary"}`}
              aria-pressed={type === "text"}
              disabled={uploading}
              onClick={() => onTypeChange("text")}
            >
              Teksti
            </button>
            <button
              type="button"
              className={`journal-button ${type === "photo" ? "" : "journal-button-secondary"}`}
              aria-pressed={type === "photo"}
              disabled={uploading}
              onClick={() => onTypeChange("photo")}
            >
              Kuva
            </button>
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          aria-busy={uploading}
          className="space-y-4"
        >
          <fieldset disabled={uploading} className="space-y-4 min-w-0">
            {type === "photo" && (
              <div>
                <Label htmlFor="memory-photo">Valitse kuva</Label>
                <button
                  type="button"
                  onDrop={handleDrop}
                  onDragOver={(event) => event.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="block w-full border-2 border-dashed border-stone-300 rounded-xl p-4 text-center hover:border-[#245246] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#245246]"
                  aria-label="Valitse tai vaihda muiston kuva"
                >
                  {previewUrl ? (
                    <>
                      <img
                        src={previewUrl}
                        alt="Valitun kuvan esikatselu"
                        width={320}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <span className="block text-sm mt-2">Vaihda kuva</span>
                    </>
                  ) : (
                    <>
                      <Upload
                        size={28}
                        className="mx-auto mb-2 text-[#245246]"
                        aria-hidden="true"
                      />
                      <span className="block text-sm">
                        Valitse kuva tai pudota se tähän
                      </span>
                      <span className="block text-xs mt-1 text-stone-600">
                        JPEG, PNG tai WebP, enintään 5 Mt
                      </span>
                    </>
                  )}
                </button>
                <input
                  id="memory-photo"
                  ref={fileInputRef}
                  type="file"
                  accept={PUPPY_IMAGE_ACCEPT}
                  aria-label="Valitse muiston kuva"
                  disabled={uploading}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            )}
            <div>
              <Label htmlFor="caption">
                {type === "photo" ? "Kuvateksti" : "Muisto"}
              </Label>
              <Textarea
                id="caption"
                name="caption"
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                placeholder={
                  type === "photo"
                    ? "Esimerkiksi: ensimmäinen päivä kotona…"
                    : "Esimerkiksi: tänään löysit oman lempipaikkasi…"
                }
                className="resize-y min-h-28"
                rows={4}
                aria-describedby={submitError ? "memory-save-error" : undefined}
              />
            </div>
            <details className="text-sm text-stone-700">
              <summary className="cursor-pointer py-3 font-medium min-h-11">
                Lisää aihetunnisteita tai paikka (valinnainen)
              </summary>
              <div className="space-y-4 pt-2">
                <div>
                  <Label htmlFor="tags">Aihetunnisteet</Label>
                  <Input
                    id="tags"
                    name="tags"
                    autoComplete="off"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="Esimerkiksi: leikki, koti…"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Paikka</Label>
                  <Input
                    id="location"
                    name="location"
                    autoComplete="off"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Esimerkiksi: kotipiha…"
                  />
                </div>
              </div>
            </details>
            {submitError && (
              <p
                id="memory-save-error"
                role="alert"
                className="text-sm text-red-800 bg-red-50 border border-red-200 p-3 rounded-lg"
              >
                {submitError}
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="journal-button journal-button-secondary flex-1"
                disabled={uploading}
              >
                Peruuta
              </Button>
              <Button
                type="submit"
                disabled={uploading}
                className="journal-button flex-1"
              >
                {uploading ? "Tallennetaan…" : "Tallenna"}
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemoryDialog;
