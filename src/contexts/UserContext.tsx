import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@/types/user';

interface UserContextValue {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        // Load initial session
        const loadSession = async () => {
            try {
                const { data } = await supabase.auth.getSession();
                if (isMounted) {
                    setUser(data.session?.user ?? null);
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error loading session:', error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadSession();

        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (isMounted) {
                setUser(session?.user ?? null);
            }
        });

        return () => {
            isMounted = false;
            listener.subscription.unsubscribe();
        };
    }, []);

    const value: UserContextValue = {
        user,
        loading,
        isAuthenticated: !!user,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
