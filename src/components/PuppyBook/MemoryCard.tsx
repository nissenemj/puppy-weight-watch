import React, { useId, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  MapPin,
  MoreVertical,
  Edit2,
  Trash2,
  Share2,
  Sparkles,
  Lock,
} from "@/utils/iconImports";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SocialShareGenerator } from "./SocialShareGenerator";
import CommentSection from "./CommentSection";
import StickerEditor from "./StickerEditor";
import { PrivatePuppyImage } from "./PrivatePuppyImage";
import { removePuppyBookImage } from "@/services/puppyBookStorage";

interface Memory {
  id: string;
  book_id: string;
  content_type: string;
  content_url?: string;
  caption?: string;
  tags: string[];
  location?: any;
  created_at: string;
  privacy_settings?: {
    visibility: "private" | "public";
  };
  reactions?: Array<{ id: string; user_id: string; reaction_type: string }>;
  comments?: Array<{
    id: string;
    memory_id: string;
    user_id: string;
    comment_text: string;
    created_at: string;
  }>;
}

interface MemoryCardProps {
  memory: Memory;
  viewMode: "grid" | "list";
  onMemoryUpdated: () => void;
  puppyProfile?: {
    name: string;
    birthDate: string;
    profileImage?: string;
  };
}

const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  viewMode,
  onMemoryUpdated,
  puppyProfile,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showStickerEditor, setShowStickerEditor] = useState(false);
  const { toast } = useToast();
  const menuId = useId();
  const commentsId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const createdAt = new Date(memory.created_at);
  const dateLabel = Number.isNaN(createdAt.getTime())
    ? null
    : new Intl.DateTimeFormat("fi-FI").format(createdAt);

  const handleReaction = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      if (isLiked) {
        // Remove reaction
        const { error } = await supabase
          .from("memory_reactions")
          .delete()
          .eq("memory_id", memory.id)
          .eq("user_id", user.user.id);

        if (error) throw error;
        setIsLiked(false);
      } else {
        // Add reaction
        const { error } = await supabase.from("memory_reactions").insert({
          memory_id: memory.id,
          user_id: user.user.id,
          reaction_type: "heart",
        });

        if (error) throw error;
        setIsLiked(true);
      }

      onMemoryUpdated();
    } catch (error) {
      console.error("Error handling reaction:", error);
      toast({
        title: "Virhe",
        description: "Reaktion lisääminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!confirm("Haluatko varmasti poistaa tämän muiston?")) return;

    try {
      // Delete associated file from storage if exists
      if (memory.content_url) {
        await removePuppyBookImage(memory.content_url);
      }

      // Delete memory from database
      const { error } = await supabase
        .from("memories")
        .delete()
        .eq("id", memory.id);

      if (error) throw error;

      toast({
        title: "Poistettu",
        description: "Muisto poistettu onnistuneesti",
      });

      onMemoryUpdated();
    } catch (error) {
      toast({
        title: "Virhe",
        description: "Muiston poistaminen epäonnistui",
        variant: "destructive",
      });
    }
  };

  return (
    <article
      className={`journal-memory-card ${viewMode === "list" ? "journal-memory-card-list" : ""}`}
      onKeyDown={(event) => {
        if (event.key === "Escape" && showMenu) {
          event.stopPropagation();
          setShowMenu(false);
          menuButtonRef.current?.focus();
        }
      }}
    >
      {memory.content_url ? (
        <PrivatePuppyImage
          src={memory.content_url}
          alt={memory.caption || "Pennun muisto"}
          className="journal-memory-image"
        />
      ) : (
        <div className="journal-memory-placeholder" aria-hidden="true">
          <Heart size={28} />
        </div>
      )}
      <div className="journal-memory-content">
        {memory.caption && (
          <p className="journal-memory-caption">{memory.caption}</p>
        )}
        <div className="journal-memory-meta">
          <span>
            <Lock size={14} aria-hidden="true" /> Vain omistajalle
          </span>
          {dateLabel && <time dateTime={memory.created_at}>{dateLabel}</time>}
          {memory.location?.name && (
            <span>
              <MapPin size={14} aria-hidden="true" />
              {memory.location.name}
            </span>
          )}
        </div>
        {memory.tags?.length > 0 && (
          <ul
            className="journal-memory-tags"
            aria-label="Muiston aihetunnisteet"
          >
            {memory.tags.map((tag, index) => (
              <li key={`${tag}-${index}`}>#{tag}</li>
            ))}
          </ul>
        )}
        <div
          className="journal-memory-actions"
          role="group"
          aria-label="Muiston toiminnot"
        >
          <button
            type="button"
            onClick={() => void handleReaction()}
            aria-label={isLiked ? "Poista sydänreaktio" : "Lisää sydänreaktio"}
            aria-pressed={isLiked}
          >
            <Heart
              size={18}
              aria-hidden="true"
              className={isLiked ? "fill-current" : ""}
            />
            {memory.reactions?.length || 0}
          </button>
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            aria-label={showComments ? "Piilota kommentit" : "Näytä kommentit"}
            aria-expanded={showComments}
            aria-controls={commentsId}
          >
            <MessageCircle size={18} aria-hidden="true" />
            {memory.comments?.length || 0}
          </button>
          <button
            ref={menuButtonRef}
            type="button"
            aria-label="Muiston valinnat"
            aria-expanded={showMenu}
            aria-controls={menuId}
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} aria-hidden="true" /> Valinnat
          </button>
        </div>
        {showMenu && (
          <div
            id={menuId}
            className="journal-memory-options"
            role="group"
            aria-label="Muiston valinnat"
          >
            <p>Vain omistajalle. Julkinen jakaminen ei ole käytössä.</p>
            <button
              type="button"
              disabled={!puppyProfile}
              onClick={() => setShowShareDialog(true)}
            >
              <Share2 size={18} aria-hidden="true" /> Jaa
            </button>
            {memory.content_url && (
              <button type="button" onClick={() => setShowStickerEditor(true)}>
                <Sparkles size={18} aria-hidden="true" /> Lisää tarroja
              </button>
            )}
            <button type="button" disabled>
              <Edit2 size={18} aria-hidden="true" /> Muokkaa (ei käytössä)
            </button>
            <button
              type="button"
              className="journal-memory-delete"
              onClick={() => {
                menuButtonRef.current?.focus();
                setShowMenu(false);
                void handleDelete();
              }}
            >
              <Trash2 size={18} aria-hidden="true" /> Poista
            </button>
          </div>
        )}
        {/* Comment Section */}
        {showComments && (
          <div id={commentsId}>
            <CommentSection
              memoryId={memory.id}
              initialComments={memory.comments}
              onCommentAdded={onMemoryUpdated}
            />
          </div>
        )}

        {/* Social Share Dialog */}
        {puppyProfile && (
          <SocialShareGenerator
            memory={memory}
            puppyProfile={puppyProfile}
            isOpen={showShareDialog}
            onClose={() => setShowShareDialog(false)}
          />
        )}

        {/* Sticker Editor */}
        {memory.content_url && (
          <StickerEditor
            isOpen={showStickerEditor}
            onClose={() => setShowStickerEditor(false)}
            imageUrl={memory.content_url}
            onStickerAdded={(editedUrl) => {
              // Could save the edited image or share it
              setShowStickerEditor(false);
            }}
          />
        )}
      </div>
    </article>
  );
};

export default MemoryCard;
