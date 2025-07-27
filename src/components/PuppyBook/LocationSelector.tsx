import React, { useState } from 'react';
import { MapPin, X, Navigation } from '@/utils/iconImports';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface LocationData {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface LocationSelectorProps {
  onLocationAdded: (location: LocationData) => void;
  location?: LocationData;
  onLocationRemoved: () => void;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onLocationAdded,
  location,
  onLocationRemoved
}) => {
  const [showInput, setShowInput] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationAdded({
            name: `Sijainti: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            coordinates: { lat: latitude, lng: longitude }
          });
          setGettingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
          setShowInput(true);
        }
      );
    } else {
      setGettingLocation(false);
      setShowInput(true);
    }
  };

  const addManualLocation = () => {
    if (locationName.trim()) {
      onLocationAdded({ name: locationName.trim() });
      setLocationName('');
      setShowInput(false);
    }
  };

  if (location) {
    return (
      <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
        <MapPin className="w-3 h-3 text-green-600" />
        <span className="text-xs text-green-700 flex-1">{location.name}</span>
        <button
          onClick={onLocationRemoved}
          className="w-4 h-4 text-green-600 hover:text-red-600"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    );
  }

  if (showInput) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Kirjoita sijainnin nimi..."
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="text-xs h-8"
          />
          <Button
            size="sm"
            onClick={addManualLocation}
            disabled={!locationName.trim()}
            className="h-8 px-2 text-xs"
          >
            Lisää
          </Button>
        </div>
        <button
          onClick={() => setShowInput(false)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Peruuta
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={getCurrentLocation}
        disabled={gettingLocation}
        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
      >
        <Navigation className={`w-3 h-3 ${gettingLocation ? 'animate-pulse' : ''}`} />
        {gettingLocation ? 'Hakee sijaintia...' : 'Nykyinen sijainti'}
      </button>
      <span className="text-xs text-gray-400">|</span>
      <button
        onClick={() => setShowInput(true)}
        className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700"
      >
        <MapPin className="w-3 h-3" />
        Lisää sijainti
      </button>
    </div>
  );
};