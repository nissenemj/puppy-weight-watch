import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight } from "lucide-react";
import PuppyBookSelector from "@/components/PuppyBook/PuppyBookSelector";
import type { User } from "@/types/user";
import type { PuppyBook } from "@/types/dog";

interface CreateBookPromptProps {
  onBookCreated: (
    title: string,
    birthDate?: string,
    coverImageUrl?: string,
  ) => void;
  user: User;
  onBookSelect: (bookId: string, bookData: PuppyBook) => void;
}

export const CreateBookPrompt: React.FC<CreateBookPromptProps> = ({
  user,
  onBookSelect,
}) => (
  <div className="puppy-journal">
    <section className="journal-create">
      <p className="journal-kicker">
        <BookOpen size={20} aria-hidden="true" /> Oma pentukirja
      </p>
      <h1>Jokaisella pennulla on oma tarinansa.</h1>
      <p>
        Valitse olemassa oleva kirja tai luo ensimmäinen. Tarvitset kirjan nimen
        ja koiran profiilin. Sen jälkeen voit lisätä kuvia ja muistoja.
      </p>
      <PuppyBookSelector
        user={user}
        selectedBookId=""
        onBookSelect={onBookSelect}
      />
      <Link className="journal-text-link" to="/muistokirja">
        Katso ensin esimerkkikirjaa <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </section>
  </div>
);
