import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from '@/utils/iconImports';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 mobile-text-wrap">
      <ol className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground mobile-focus-enhanced">
        <li>
          <Link 
            to="/" 
            className="hover:text-foreground transition-colors flex items-center"
            aria-label="Etusivu"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-1 sm:mx-2 flex-shrink-0" aria-hidden="true" />
            {item.current ? (
              <span className="font-medium text-foreground" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link 
                to={item.href} 
                className="hover:text-foreground transition-colors min-h-[44px] flex items-center touch-manipulation"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;