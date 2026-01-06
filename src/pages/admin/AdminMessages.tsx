import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { isAdmin } from '@/lib/admin';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Check, ArrowLeft, RefreshCw, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fi } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  read: boolean | null;
  created_at: string | null;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !isAdmin(user.email)) {
      navigate('/');
      return;
    }
    setUserEmail(user.email ?? null);
    setAuthorized(true);
    fetchMessages();
  };

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ read: true })
      .eq('id', id);

    if (!error) {
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-500"></div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => !m.read).length;

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-stone-500 hover:text-stone-700">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                <Mail className="h-6 w-6 text-terracotta-500" />
                Yhteydenotot
              </h1>
              <p className="text-stone-500 text-sm">
                {unreadCount > 0 ? `${unreadCount} lukematonta viestiä` : 'Kaikki viestit luettu'}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={fetchMessages} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Päivitä
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-terracotta-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <Card className="p-12 text-center">
            <Mail className="h-12 w-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-600">Ei viestejä</h3>
            <p className="text-stone-400">Yhteydenottoja ei ole vielä vastaanotettu.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card 
                key={message.id} 
                className={`p-6 transition-all ${!message.read ? 'border-terracotta-300 bg-terracotta-50/30' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-terracotta-100 flex items-center justify-center">
                      <User className="h-5 w-5 text-terracotta-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-stone-800">{message.name}</h3>
                      <a 
                        href={`mailto:${message.email}`} 
                        className="text-sm text-terracotta-600 hover:underline"
                      >
                        {message.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.read && (
                      <Badge variant="secondary" className="bg-terracotta-100 text-terracotta-700">
                        Uusi
                      </Badge>
                    )}
                    <span className="text-xs text-stone-400">
                      {message.created_at 
                        ? format(new Date(message.created_at), 'dd.MM.yyyy HH:mm', { locale: fi })
                        : 'Tuntematon aika'}
                    </span>
                  </div>
                </div>
                
                {message.subject && (
                  <p className="font-medium text-stone-700 mb-2">{message.subject}</p>
                )}
                
                <p className="text-stone-600 whitespace-pre-wrap mb-4">{message.message}</p>
                
                <div className="flex items-center gap-2 pt-3 border-t border-stone-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <a href={`mailto:${message.email}?subject=Re: Yhteydenotto Pentulaskuri.fi`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Vastaa
                    </a>
                  </Button>
                  {!message.read && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => markAsRead(message.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Merkitse luetuksi
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
