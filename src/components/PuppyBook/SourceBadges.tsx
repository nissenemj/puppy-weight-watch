import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from '@/utils/iconImports';

interface Source {
  label: string;
  url: string;
  category: 'vaccination' | 'deworming' | 'growth' | 'nutrition' | 'general';
}

const SOURCES: Source[] = [
  {
    label: 'WSAVA 2024',
    url: 'https://wsava.org/global-guidelines/vaccination-guidelines/',
    category: 'vaccination'
  },
  {
    label: 'Kennelliitto',
    url: 'https://www.kennelliitto.fi/koiran-omistajalle/koiran-terveys/rokotukset',
    category: 'vaccination'
  },
  {
    label: 'Evidensia',
    url: 'https://evidensia.fi/koira/terveys/rokotukset/',
    category: 'general'
  },
  {
    label: 'Waltham Growth',
    url: 'https://www.waltham.com/research/puppy-growth-charts/',
    category: 'growth'
  },
  {
    label: 'Yliopiston Apteekki',
    url: 'https://www.yliopistonverkkoapteekki.fi/elainsairauksia/koira/madotus',
    category: 'deworming'
  }
];

interface SourceBadgesProps {
  categories?: Source['category'][];
  className?: string;
}

export const SourceBadges: React.FC<SourceBadgesProps> = ({ 
  categories, 
  className = '' 
}) => {
  const filteredSources = categories 
    ? SOURCES.filter(source => categories.includes(source.category))
    : SOURCES;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground mr-2">Lähteet:</span>
      {filteredSources.map((source) => (
        <a
          key={source.label}
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
        >
          <Badge variant="outline" className="text-xs hover:bg-muted/50">
            {source.label}
            <ExternalLink className="w-3 h-3 ml-1" />
          </Badge>
        </a>
      ))}
    </div>
  );
};