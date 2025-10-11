import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean; // Show back button on mobile instead of full breadcrumbs
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showBackButton = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Don't show breadcrumbs on home page
  if (location.pathname === '/') {
    return null;
  }

  // Get current page name for mobile
  const currentPage = items.find(item => item.current);
  const currentPageName = currentPage?.name || items[items.length - 1]?.name;

  return (
    <>
      {/* Mobile: Back button with current page name */}
      {showBackButton && (
        <div className="mb-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-brand-ink/80 hover:text-brand-ink transition-all duration-200 hover:scale-105 self-start"
              aria-label="Takaisin edelliselle sivulle"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Takaisin</span>
            </Button>
            {currentPageName && (
              <h1 className="text-xl font-bold text-brand-ink ml-1">
                {currentPageName}
              </h1>
            )}
          </div>
        </div>
      )}

      {/* Desktop: Full breadcrumbs */}
      <nav aria-label="Breadcrumb" className="hidden md:block mb-6">
        <ol className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
          <li>
            <Link 
              to="/" 
              className="hover:text-brand-orange transition-all duration-200 flex items-center hover:scale-105"
              aria-label="Etusivu"
            >
              <Home className="h-4 w-4" />
            </Link>
          </li>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0" aria-hidden="true" />
              {item.current ? (
                <span className="font-medium text-brand-ink" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.href} 
                  className="hover:text-brand-orange transition-all duration-200 hover:scale-105"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;