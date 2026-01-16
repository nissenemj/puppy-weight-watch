import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Dog } from '@/types/dog';
import { useUser } from './UserContext';

interface DogContextValue {
    dogs: Dog[];
    activeDog: Dog | null;
    loading: boolean;
    setActiveDog: (dog: Dog | null) => void;
    refreshDogs: () => Promise<void>;
}

const DogContext = createContext<DogContextValue | undefined>(undefined);

export function DogProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useUser();
    const [dogs, setDogs] = useState<Dog[]>([]);
    const [activeDog, setActiveDog] = useState<Dog | null>(null);
    const [loading, setLoading] = useState(false);

    // Use ref to avoid circular dependency in fetchDogs
    const activeDogRef = useRef(activeDog);
    activeDogRef.current = activeDog;

    const fetchDogs = useCallback(async () => {
        if (!user) {
            setDogs([]);
            setActiveDog(null);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('dogs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const dogsData = (data || []) as Dog[];
            setDogs(dogsData);

            // Auto-select first dog if none is selected (using ref to avoid circular dependency)
            if (dogsData.length > 0 && !activeDogRef.current) {
                setActiveDog(dogsData[0]);
            }
        } catch (error) {
            console.error('Error fetching dogs:', error);
            setDogs([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchDogs();
        } else {
            setDogs([]);
            setActiveDog(null);
        }
    }, [isAuthenticated, fetchDogs]);

    const value: DogContextValue = {
        dogs,
        activeDog,
        loading,
        setActiveDog,
        refreshDogs: fetchDogs,
    };

    return <DogContext.Provider value={value}>{children}</DogContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDog() {
    const context = useContext(DogContext);
    if (context === undefined) {
        throw new Error('useDog must be used within a DogProvider');
    }
    return context;
}
