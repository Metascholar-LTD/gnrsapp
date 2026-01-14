import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Clock, Route, ExternalLink } from 'lucide-react';

// Import leaflet-routing-machine dynamically
let Routing: any = null;
if (typeof window !== 'undefined') {
  try {
    // @ts-ignore
    Routing = require('leaflet-routing-machine');
    require('leaflet-routing-machine/dist/leaflet-routing-machine.css');
  } catch (e) {
    console.warn('leaflet-routing-machine not available, using fallback routing');
  }
}

// Extend Leaflet types for routing
declare module 'leaflet' {
  namespace Routing {
    function control(options: any): any;
    function osrmv1(options: any): any;
    function graphHopper(apiKey: string, options?: any): any;
  }
}

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  rating?: number;
  cuisine?: string;
}

interface RestaurantMapProps {
  restaurant: Restaurant;
  nearbyRestaurants?: Restaurant[];
  onClose?: () => void;
}

// Custom marker icons
const createRestaurantIcon = (isMain: boolean = false) => {
  return L.divIcon({
    className: 'custom-restaurant-marker',
    html: `
      <div style="
        background: ${isMain ? '#006B3F' : '#fff'};
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid ${isMain ? '#fff' : '#006B3F'};
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          transform: rotate(45deg);
          color: ${isMain ? '#fff' : '#006B3F'};
          font-size: 20px;
          font-weight: bold;
        ">📍</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });
};

const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        background: #4285F4;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 3px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <div style="
          color: #fff;
          font-size: 16px;
          font-weight: bold;
        ">👤</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

// Calculate distance between two points (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Routing component with proper road routing
const RoutingControl: React.FC<{
  start: [number, number];
  end: [number, number];
  onRouteFound?: (distance: number, time: number) => void;
}> = ({ start, end, onRouteFound }) => {
  const map = useMap();
  const routingControlRef = useRef<any>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    // Clean up previous routing
    if (routingControlRef.current) {
      try {
        map.removeControl(routingControlRef.current);
      } catch (e) {
        // Ignore errors
      }
      routingControlRef.current = null;
    }
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (Routing && typeof (Routing as any).control === 'function') {
      try {
        // Use OSRM routing service for actual road routing
        const router = (Routing as any).osrmv1({
          serviceUrl: 'https://router.project-osrm.org/route/v1',
          profile: 'driving',
          timeout: 30000,
        });

        const routingControl = (Routing as any).control({
          waypoints: [
            L.latLng(start[0], start[1]),
            L.latLng(end[0], end[1]),
          ],
          router: router,
          routeWhileDragging: false,
          showAlternatives: false,
          addWaypoints: false,
          fitSelectedRoutes: true,
          lineOptions: {
            styles: [
              {
                color: '#006B3F',
                weight: 6,
                opacity: 0.8,
                className: 'route-line',
              },
            ],
            extendToWaypoints: true,
            missingRouteTolerance: 0,
          },
          createMarker: function() {
            return null; // Don't create default markers, we use custom ones
          },
        }).addTo(map);

        routingControlRef.current = routingControl;

        // Handle successful route
        routingControl.on('routesfound', function(e: any) {
          const routes = e.routes;
          if (routes && routes.length > 0) {
            const route = routes[0];
            const distance = route.summary.totalDistance / 1000; // Convert to km
            const time = route.summary.totalTime / 60; // Convert to minutes
            
            // Fit map to show the entire route
            const bounds = L.latLngBounds(
              route.coordinates.map((coord: any) => [coord.lat, coord.lng])
            );
            map.fitBounds(bounds, { padding: [50, 50] });
            
            if (onRouteFound) {
              onRouteFound(distance, time);
            }
          }
        });

        // Handle routing errors - try alternative service
        routingControl.on('routingerror', function(e: any) {
          console.warn('OSRM routing error, trying GraphHopper fallback:', e);
          
          // Try GraphHopper as fallback (free tier available)
          try {
            const graphHopperRouter = (Routing as any).graphHopper('', {
              urlParameters: {
                vehicle: 'car',
                locale: 'en',
              },
            });

            const fallbackControl = (Routing as any).control({
              waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1]),
              ],
              router: graphHopperRouter,
              routeWhileDragging: false,
              showAlternatives: false,
              addWaypoints: false,
              lineOptions: {
                styles: [
                  {
                    color: '#006B3F',
                    weight: 6,
                    opacity: 0.8,
                  },
                ],
              },
              createMarker: function() {
                return null;
              },
            }).addTo(map);

            // Remove old control
            if (routingControlRef.current) {
              map.removeControl(routingControlRef.current);
            }
            routingControlRef.current = fallbackControl;

            fallbackControl.on('routesfound', function(e: any) {
              const routes = e.routes;
              if (routes && routes.length > 0) {
                const route = routes[0];
                const distance = route.summary.totalDistance / 1000;
                const time = route.summary.totalTime / 60;
                if (onRouteFound) {
                  onRouteFound(distance, time);
                }
              }
            });

            fallbackControl.on('routingerror', function() {
              // Last resort: use API call to get route
              fetchRouteFromAPI(start, end, map, onRouteFound, polylineRef);
            });
          } catch (ghError) {
            console.warn('GraphHopper also failed, using API fallback:', ghError);
            fetchRouteFromAPI(start, end, map, onRouteFound, polylineRef);
          }
        });
      } catch (error) {
        console.warn('Routing initialization error, using API fallback:', error);
        fetchRouteFromAPI(start, end, map, onRouteFound, polylineRef);
      }
    } else {
      // If routing machine not available, use API directly
      fetchRouteFromAPI(start, end, map, onRouteFound, polylineRef);
    }

    return () => {
      if (routingControlRef.current) {
        try {
          map.removeControl(routingControlRef.current);
        } catch (e) {
          // Ignore errors
        }
        routingControlRef.current = null;
      }
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map, start, end, onRouteFound]);

  return null;
};

// Fallback function to fetch route from OSRM API directly
const fetchRouteFromAPI = async (
  start: [number, number],
  end: [number, number],
  map: L.Map,
  onRouteFound?: (distance: number, time: number) => void,
  polylineRef?: React.MutableRefObject<L.Polyline | null>
) => {
  try {
    // Use OSRM API directly
    const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const geometry = route.geometry.coordinates;
      
      // Convert GeoJSON coordinates [lng, lat] to Leaflet [lat, lng]
      const latLngs = geometry.map((coord: [number, number]) => [coord[1], coord[0]] as [number, number]);
      
      // Remove old polyline
      if (polylineRef?.current) {
        map.removeLayer(polylineRef.current);
      }
      
      // Draw route polyline following roads
      const polyline = L.polyline(latLngs, {
        color: '#006B3F',
        weight: 6,
        opacity: 0.8,
        smoothFactor: 1,
      }).addTo(map);
      
      if (polylineRef) {
        polylineRef.current = polyline;
      }
      
      // Fit map to route
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      
      // Calculate distance and time
      const distance = route.distance / 1000; // Convert to km
      const time = route.duration / 60; // Convert to minutes
      
      if (onRouteFound) {
        onRouteFound(distance, time);
      }
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('API routing failed:', error);
    // Last resort: straight line
    const distance = calculateDistance(start[0], start[1], end[0], end[1]);
    const estimatedTime = distance * 2;
    
    if (polylineRef?.current) {
      map.removeLayer(polylineRef.current);
    }
    
    const polyline = L.polyline(
      [[start[0], start[1]], [end[0], end[1]]],
      {
        color: '#006B3F',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
      }
    ).addTo(map);
    
    if (polylineRef) {
      polylineRef.current = polyline;
    }
    
    if (onRouteFound) {
      onRouteFound(distance, estimatedTime);
    }
  }
};

const RestaurantMap: React.FC<RestaurantMapProps> = ({
  restaurant,
  nearbyRestaurants = [],
  onClose,
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; time: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showRoute, setShowRoute] = useState(false);

  // Get user location
  const getUserLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setShowRoute(true);
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLocating(false);
          // Fallback to Accra center if location denied
          setUserLocation([5.6037, -0.1870]);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      // Fallback to Accra center
      setUserLocation([5.6037, -0.1870]);
      setIsLocating(false);
    }
  };

  useEffect(() => {
    // Try to get location automatically
    getUserLocation();
  }, []);

  const center: [number, number] = userLocation || [restaurant.lat, restaurant.lng];
  const bounds = L.latLngBounds(
    [restaurant.lat, restaurant.lng],
    ...(nearbyRestaurants.map((r) => [r.lat, r.lng] as [number, number])),
    ...(userLocation ? [userLocation] : [])
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Control Panel */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          zIndex: 1000,
          background: 'white',
          borderRadius: '0.75rem',
          padding: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          minWidth: '280px',
          maxWidth: '320px',
        }}
      >
        <div style={{ marginBottom: '0.75rem' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#006B3F',
              marginBottom: '0.5rem',
            }}
          >
            {restaurant.name}
          </h3>
          <div style={{ fontSize: '0.875rem', color: '#666' }}>
            {restaurant.cuisine && <span>{restaurant.cuisine}</span>}
            {restaurant.rating && (
              <span style={{ marginLeft: '0.5rem' }}>⭐ {restaurant.rating}</span>
            )}
          </div>
        </div>

        {!userLocation && (
          <button
            onClick={getUserLocation}
            disabled={isLocating}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#006B3F',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: isLocating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <Navigation size={16} />
            {isLocating ? 'Locating...' : 'Get Directions'}
          </button>
        )}

        {userLocation && showRoute && (
          <div
            style={{
              padding: '0.75rem',
              background: '#f5f5f5',
              borderRadius: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            {routeInfo ? (
              <>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#333',
                  }}
                >
                  <Route size={16} color="#006B3F" />
                  <span>{routeInfo.distance.toFixed(1)} km</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#333',
                  }}
                >
                  <Clock size={16} color="#006B3F" />
                  <span>~{Math.round(routeInfo.time)} min</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: '0.875rem', color: '#666' }}>Calculating route...</div>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <button
            onClick={() => {
              setShowRoute(!showRoute);
              if (!showRoute && !userLocation) {
                getUserLocation();
              }
            }}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: showRoute ? '#e5e5e5' : '#006B3F',
              color: showRoute ? '#333' : 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!showRoute) {
                e.currentTarget.style.background = '#005a33';
              }
            }}
            onMouseLeave={(e) => {
              if (!showRoute) {
                e.currentTarget.style.background = '#006B3F';
              }
            }}
          >
            <Route size={16} />
            {showRoute ? 'Hide Route' : 'Show Route'}
          </button>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'white',
              color: '#006B3F',
              border: '2px solid #006B3F',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#006B3F';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#006B3F';
            }}
          >
            <ExternalLink size={16} />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserIcon()}>
            <Popup>
              <div>
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Main restaurant marker */}
        <Marker
          position={[restaurant.lat, restaurant.lng]}
          icon={createRestaurantIcon(true)}
        >
          <Popup>
            <div>
              <strong>{restaurant.name}</strong>
              {restaurant.cuisine && <div style={{ fontSize: '0.875rem', color: '#666' }}>{restaurant.cuisine}</div>}
              {restaurant.rating && (
                <div style={{ fontSize: '0.875rem', color: '#666' }}>⭐ {restaurant.rating}</div>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Nearby restaurants markers */}
        {nearbyRestaurants.map((nearby) => (
          <Marker
            key={nearby.id}
            position={[nearby.lat, nearby.lng]}
            icon={createRestaurantIcon(false)}
          >
            <Popup>
              <div>
                <strong>{nearby.name}</strong>
                {nearby.cuisine && <div style={{ fontSize: '0.875rem', color: '#666' }}>{nearby.cuisine}</div>}
                {nearby.rating && (
                  <div style={{ fontSize: '0.875rem', color: '#666' }}>⭐ {nearby.rating}</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Routing */}
        {showRoute && userLocation && (
          <RoutingControl
            start={userLocation}
            end={[restaurant.lat, restaurant.lng]}
            onRouteFound={(distance, time) => {
              setRouteInfo({ distance, time });
            }}
          />
        )}
      </MapContainer>

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          right: '1rem',
          zIndex: 1000,
          background: 'white',
          borderRadius: '0.5rem',
          padding: '0.75rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontSize: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#4285F4',
              borderRadius: '50%',
              border: '2px solid #fff',
            }}
          />
          <span>Your Location</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#006B3F',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '2px solid #fff',
            }}
          />
          <span>This Restaurant</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '20px',
              height: '20px',
              background: '#fff',
              borderRadius: '50% 50% 50% 0',
              transform: 'rotate(-45deg)',
              border: '2px solid #006B3F',
            }}
          />
          <span>Other Restaurants</span>
        </div>
      </div>
    </div>
  );
};

export default RestaurantMap;
