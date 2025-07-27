import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Dog, User, MapPin, Heart, Edit, Trash2 } from '@/utils/iconImports';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AddFriendDialog from './AddFriendDialog';

interface Friend {
  id: string;
  name: string;
  friend_type: 'dog' | 'human';
  breed?: string;
  description?: string;
  meeting_location?: string;
  activities?: string[];
  created_at: string;
}

interface FriendsRegistryProps {
  bookId: string;
}

const FriendsRegistry: React.FC<FriendsRegistryProps> = ({ bookId }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friends')
        .select('*')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFriends((data || []) as Friend[]);
    } catch (error) {
      console.error('Error loading friends:', error);
      toast({
        title: "Virhe",
        description: "Ystävien lataaminen epäonnistui.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFriend = async (friendId: string, friendName: string) => {
    if (!confirm(`Haluatko varmasti poistaa ystävän ${friendName}?`)) return;

    try {
      const { error } = await supabase
        .from('friends')
        .delete()
        .eq('id', friendId);

      if (error) throw error;

      toast({
        title: "Ystävä poistettu",
        description: `${friendName} on poistettu ystävärekisteristä.`,
      });

      loadFriends();
    } catch (error) {
      toast({
        title: "Virhe",
        description: "Ystävän poistaminen epäonnistui.",
        variant: "destructive",
      });
      console.error('Error deleting friend:', error);
    }
  };

  useEffect(() => {
    if (bookId) {
      loadFriends();
    }
  }, [bookId]);

  const dogFriends = friends.filter(f => f.friend_type === 'dog');
  const humanFriends = friends.filter(f => f.friend_type === 'human');

  if (loading) {
    return <div className="text-center py-4">Ladataan ystäviä...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <AddFriendDialog 
          bookId={bookId} 
          friendType="dog" 
          onFriendAdded={loadFriends}
        >
          <Button variant="outline" className="flex-1">
            <Dog className="mr-2 h-4 w-4" />
            Lisää koiraystävä
          </Button>
        </AddFriendDialog>
        
        <AddFriendDialog 
          bookId={bookId} 
          friendType="human" 
          onFriendAdded={loadFriends}
        >
          <Button variant="outline" className="flex-1">
            <User className="mr-2 h-4 w-4" />
            Lisää ihmisystävä
          </Button>
        </AddFriendDialog>
      </div>

      {/* Stats */}
      {friends.length > 0 && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Yhteensä {friends.length} ystävää</span>
          </div>
          {dogFriends.length > 0 && (
            <div className="flex items-center gap-1">
              <Dog className="h-4 w-4" />
              <span>{dogFriends.length} koiraystävää</span>
            </div>
          )}
          {humanFriends.length > 0 && (
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{humanFriends.length} ihmisystävää</span>
            </div>
          )}
        </div>
      )}

      {/* Dog Friends */}
      {dogFriends.length > 0 && (
        <div>
          <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
            <Dog className="h-5 w-5" />
            Koiraystävät
          </h4>
          <div className="grid gap-3">
            {dogFriends.map((friend) => (
              <Card key={friend.id} className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg text-gray-800">{friend.name}</CardTitle>
                      {friend.breed && (
                        <p className="text-sm text-gray-600 mt-1">{friend.breed}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFriend(friend.id, friend.name)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {friend.description && (
                    <p className="text-sm text-gray-700 mb-3">{friend.description}</p>
                  )}
                  
                  {friend.meeting_location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>Tavattiin: {friend.meeting_location}</span>
                    </div>
                  )}
                  
                  {friend.activities && friend.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {friend.activities.map((activity) => (
                        <Badge key={activity} variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Separator */}
      {dogFriends.length > 0 && humanFriends.length > 0 && (
        <Separator />
      )}

      {/* Human Friends */}
      {humanFriends.length > 0 && (
        <div>
          <h4 className="text-lg font-medium flex items-center gap-2 mb-3">
            <User className="h-5 w-5" />
            Ihmisystävät
          </h4>
          <div className="grid gap-3">
            {humanFriends.map((friend) => (
              <Card key={friend.id} className="bg-gradient-to-r from-pink-50 to-rose-50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg text-gray-800">{friend.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFriend(friend.id, friend.name)}
                        className="text-gray-500 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  {friend.description && (
                    <p className="text-sm text-gray-700 mb-3">{friend.description}</p>
                  )}
                  
                  {friend.meeting_location && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>Tavattiin: {friend.meeting_location}</span>
                    </div>
                  )}
                  
                  {friend.activities && friend.activities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {friend.activities.map((activity) => (
                        <Badge key={activity} variant="secondary" className="text-xs bg-pink-100 text-pink-800">
                          {activity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {friends.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Heart className="h-8 w-8 mx-auto mb-2 text-pink-300" />
          <p className="text-lg font-medium mb-1">Ei vielä ystäviä</p>
          <p className="text-sm">Lisää ensimmäinen ystävä painamalla yllä olevia painikkeita!</p>
        </div>
      )}
    </div>
  );
};

export default FriendsRegistry;