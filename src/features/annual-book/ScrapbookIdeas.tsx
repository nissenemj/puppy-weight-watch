import { useId, useRef, useState, type MouseEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Bone, Camera, Check, Compass, House, Lightbulb, Moon, PawPrint, RefreshCw, Shirt, Users, X } from "lucide-react";
import { SCRAPBOOK_TOPICS, SCRAPBOOK_TOPIC_KEYS, type ScrapbookPage } from "./scrapbook";

type Topic = ScrapbookPage["topic"];
const icons = {
  moment: Camera, paw: PawPrint, sleep: Moon, toy: Bone, outfit: Shirt,
  home: House, together: Users, adventure: Compass, mishap: PawPrint,
};

export function ScrapbookIdeas({
  open, onOpenChange, selected, onChoose, onCloseFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Topic;
  onChoose: (topic: Topic) => void;
  onCloseFocus: () => void;
}) {
  const id = useId();
  const heading = useRef<HTMLHeadingElement>(null);
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="scrap-ideas-overlay" />
        <Dialog.Content
          className="puppy-journal scrap-ideas-dialog"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            heading.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            onCloseFocus();
          }}
        >
          <header className="scrap-ideas-header">
            <div>
              <Dialog.Title ref={heading} tabIndex={-1}>Valitse kuvausidea</Dialog.Title>
              <Dialog.Description>
                Yksi kuva riittää. Idea vaihtuu tälle sivulle, ja kuva, omat tekstit sekä päivä säilyvät.
              </Dialog.Description>
            </div>
            <Dialog.Close className="scrap-ideas-close">
              <X size={20} aria-hidden="true" />
              <span className="sr-only">Sulje kuvausideat</span>
            </Dialog.Close>
          </header>
          <div className="scrap-ideas-scroll">
            <div className="scrap-ideas-grid" role="group" aria-label="Kirjasivun aihe">
              {SCRAPBOOK_TOPIC_KEYS.map((topic) => {
                const idea = SCRAPBOOK_TOPICS[topic];
                const Icon = icons[topic];
                return (
                  <button
                    type="button"
                    key={topic}
                    className="scrap-idea-card"
                    aria-label={idea.name}
                    aria-describedby={`${id}-${topic}`}
                    aria-pressed={selected === topic}
                    onClick={() => onChoose(topic)}
                  >
                    <span className={`scrap-idea-cover scrap-idea-cover-${topic}`} aria-hidden="true">
                      <span>{idea.title}</span>
                      <Icon size={42} strokeWidth={1.4} />
                      <span className="scrap-idea-cover-lines" />
                    </span>
                    <span className="scrap-idea-card-title">{idea.name}</span>
                    <span id={`${id}-${topic}`} className="scrap-idea-card-copy">{idea.idea}</span>
                    {selected === topic && <span className="scrap-idea-selected"><Check size={15} aria-hidden="true" /> Valittu</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function ScrapbookIdeaPrompt({ topic, disabled, onOpenIdeas }: {
  topic: Topic;
  disabled: boolean;
  onOpenIdeas: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const [question, setQuestion] = useState(0);
  const idea = SCRAPBOOK_TOPICS[topic];
  return (
    <aside className="scrap-idea-prompt" aria-label="Ideoita kuvahetkeen">
      <div className="scrap-idea-prompt-heading">
        <Lightbulb size={20} aria-hidden="true" />
        <h3>{idea.name}</h3>
      </div>
      <p>{idea.idea}</p>
      <p className="scrap-question-label">Kysykää yhdessä</p>
      <p className="scrap-question" role="status" aria-label="Kuvahetken kysymys" aria-atomic="true">
        {idea.questions[question]}
      </p>
      <p className="scrap-question-hint">Kirjoittakaa halutessanne vastaus suoraan sivulle.</p>
      <div className="scrap-idea-prompt-actions">
        <button type="button" className="journal-text-link" disabled={disabled} onClick={() => setQuestion((current) => (current + 1) % idea.questions.length)}>
          <RefreshCw size={16} aria-hidden="true" /> Toinen kysymys
        </button>
        <button type="button" className="journal-text-link" disabled={disabled} onClick={onOpenIdeas}>Vaihda kuvausideaa</button>
      </div>
    </aside>
  );
}
