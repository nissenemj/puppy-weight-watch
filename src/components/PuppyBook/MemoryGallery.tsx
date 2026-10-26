import React, { useState, useEffect, useCallback, useRef } from "react";
import { Camera, Plus, Grid, List } from "@/utils/iconImports";
import { supabase } from "@/integrations/supabase/client";
import MemoryCard from "./MemoryCard";

interface Memory {
  id: string;
  book_id: string;
  timeline_entry_id?: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: any;
  created_by?: string;
  created_at: string;
  updated_at?: string;
  reactions?: MemoryReaction[];
  comments?: MemoryComment[];
}

interface MemoryReaction {
  id: string;
  memory_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

interface MemoryComment {
  id: string;
  memory_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
}

interface MemoryGalleryProps {
  bookId: string;
  onRefresh?: React.MutableRefObject<(() => void) | null>;
  onAddMemory?: () => void;
  puppyProfile?: {
    name: string;
    birthDate: string;
    profileImage?: string;
  };
}

const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  bookId,
  onRefresh,
  onAddMemory,
  puppyProfile,
}) => {
  const [state, setState] = useState<{
    bookId: string;
    memories: Memory[];
    status: "loading" | "ready" | "error";
  }>({ bookId, memories: [], status: "loading" });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const requestId = useRef(0);

  const loadMemories = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setState({ bookId, memories: [], status: "loading" });
    try {
      const { data, error } = await supabase
        .from("memories")
        .select("*, reactions:memory_reactions(*), comments:memory_comments(*)")
        .eq("book_id", bookId)
        .order("created_at", { ascending: false });
      if (currentRequest !== requestId.current) return;
      if (error) throw error;
      setState({
        bookId,
        memories: (data as unknown as Memory[]) || [],
        status: "ready",
      });
    } catch {
      if (currentRequest === requestId.current)
        setState({ bookId, memories: [], status: "error" });
    }
  }, [bookId]);

  useEffect(() => {
    void loadMemories();
    return () => {
      requestId.current += 1;
    };
  }, [loadMemories]);

  useEffect(() => {
    if (onRefresh) onRefresh.current = loadMemories;
    return () => {
      if (onRefresh?.current === loadMemories) onRefresh.current = null;
    };
  }, [onRefresh, loadMemories]);

  const memories = state.bookId === bookId ? state.memories : [];
  const loading = state.bookId !== bookId || state.status === "loading";
  if (loading)
    return (
      <div className="journal-gallery" role="status">
        <span className="sr-only">Muistoja ladataan…</span>
        <div className="animate-pulse space-y-4" aria-hidden="true">
          <div className="h-6 w-40 bg-stone-200 rounded" />
          <div className="h-40 bg-stone-100 rounded-lg" />
        </div>
      </div>
    );

  if (state.status === "error")
    return (
      <div className="journal-error" role="alert">
        <h2>Muistoja ei voitu ladata</h2>
        <p>
          Tarkista yhteys ja yritä uudelleen. Tallennetut muistosi eivät muutu.
        </p>
        <button type="button" onClick={() => void loadMemories()}>
          Yritä muistojen lataamista uudelleen
        </button>
      </div>
    );

  return (
    <section className="journal-gallery" aria-labelledby="memory-gallery-title">
      <div className="journal-gallery-heading">
        <div>
          <h2 id="memory-gallery-title">Omat muistot</h2>
          <p>Kuvia ja sanoja hetkistä, joihin haluat palata.</p>
        </div>
        {memories.length > 0 && (
          <div
            className="journal-gallery-toggle"
            role="group"
            aria-label="Muistojen esitystapa"
          >
            <button
              type="button"
              aria-label="Näytä muistot ruudukkona"
              aria-pressed={viewMode === "grid"}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Näytä muistot listana"
              aria-pressed={viewMode === "list"}
              onClick={() => setViewMode("list")}
            >
              <List size={20} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      {memories.length === 0 ? (
        <div className="journal-empty">
          <Camera size={36} aria-hidden="true" />
          <h3>Mikä hetki jäi tänään mieleen?</h3>
          <p>
            Ensimmäinen yhteinen päivä tai ihan tavallinen ilta. Muutamakin sana
            riittää aloittamaan pennun tarinan.
          </p>
          {onAddMemory && (
            <button
              type="button"
              className="journal-button"
              onClick={onAddMemory}
            >
              <Plus size={18} aria-hidden="true" /> Lisää ensimmäinen muisto
            </button>
          )}
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {memories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              viewMode={viewMode}
              onMemoryUpdated={() => void loadMemories()}
              puppyProfile={puppyProfile}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default MemoryGallery;
