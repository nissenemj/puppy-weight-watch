import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Scale, Calculator, BookOpen, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const iconMap = {
  scale: Scale,
  calculator: Calculator,
  book: BookOpen,
  shield: Shield
};

interface RelatedItem {
  title: string;
  description: string;
  href: string;
  icon: keyof typeof iconMap;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedItem[];
  className?: string;
}

const RelatedContent: React.FC<RelatedContentProps> = ({
  title = 'Liittyvä sisältö',
  items,
  className = ''
}) => {
  return (
    <section className={`py-8 ${className}`}>
      <h2 className="text-xl font-serif font-semibold text-stone-900 mb-4">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const Icon = iconMap[item.icon];
          return (
            <Link key={index} to={item.href}>
              <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-terracotta-50 text-terracotta-500 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-stone-900 group-hover:text-terracotta-600 transition-colors flex items-center gap-1">
                      {item.title}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-sm text-stone-500 line-clamp-2">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedContent;
