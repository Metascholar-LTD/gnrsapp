/**
 * RestaurantMap Component with Mapbox and TomTom Routing
 * 
 * Interactive map component using Mapbox GL JS.
 * Features:
 * - Mapbox integration with custom styling
 * - TomTom Routing API integration for turn-by-turn directions
 * - Get directions from user's current location
 * - Custom styled markers for restaurant and nearby places
 * - Interactive popups with restaurant/place information (hover support)
 * - Route display with distance and time estimates
 * - Automatic bounds fitting to show all markers
 * 
 * Environment Variables:
 * - VITE_MAPBOX_TOKEN: Your Mapbox access token
 * - VITE_TOMTOM_API_KEY: Your TomTom API key for routing
 */

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Navigation, MapPin, Clock, X } from 'lucide-react';

interface RestaurantMapProps {
  lat: number;
  lng: number;
  restaurantName: string;
  address: string;
  restaurantId?: string;
  nearbyPlaces?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: 'restaurant' | 'hotel';
  }>;
  allRestaurants?: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    rating: number;
    cuisine: string;
    reviewCount?: number;
  }>;
  height?: string;
  showControls?: boolean;
  showRouting?: boolean;
  showAllRestaurants?: boolean;
  onRestaurantClick?: (restaurantId: string) => void;
}

interface RouteInfo {
  distance: number; // in meters
  travelTime: number; // in seconds
  distanceText: string;
  timeText: string;
}

export const RestaurantMap: React.FC<RestaurantMapProps> = ({
  lat,
  lng,
  restaurantName,
  address,
  restaurantId,
  nearbyPlaces = [],
  allRestaurants = [],
  height = '400px',
  showControls = true,
  showRouting = true,
  showAllRestaurants = false,
  onRestaurantClick,
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupsRef = useRef<mapboxgl.Popup[]>([]);
  const routeSourceRef = useRef<string | null>(null);
  
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

  // Format distance
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const minutes = Math.round(seconds / 60);
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  // Get user's current location
  const getUserLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Unable to get location: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  // Calculate route using TomTom Routing API
  const calculateRoute = async (fromLat: number, fromLng: number, toLat: number, toLng: number) => {
    if (!TOMTOM_API_KEY) {
      setError('TomTom API key is not configured. Please add VITE_TOMTOM_API_KEY to your .env file.');
      return;
    }

    setIsLoadingRoute(true);
    setError(null);

    try {
      // TomTom Routing API endpoint
      const url = `https://api.tomtom.com/routing/1/calculateRoute/${fromLat},${fromLng}:${toLat},${toLng}/json?key=${TOMTOM_API_KEY}&routeType=fastest&traffic=true&travelMode=car`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || !data.routes || data.routes.length === 0) {
        throw new Error(data.error?.message || 'Failed to calculate route');
      }

      const route = data.routes[0];
      const summary = route.summary;
      
      // Extract route geometry from TomTom API
      const coordinates: [number, number][] = [];
      
      // TomTom API returns routes with legs containing points
      if (route.legs && route.legs.length > 0) {
        route.legs.forEach((leg: any) => {
          if (leg.points && leg.points.length > 0) {
            leg.points.forEach((point: any) => {
              // TomTom uses longitude, latitude format
              coordinates.push([point.longitude, point.latitude]);
            });
          }
        });
      } else if (route.sections && route.sections.length > 0) {
        // Alternative structure: sections with points
        route.sections.forEach((section: any) => {
          if (section.points && section.points.length > 0) {
            section.points.forEach((point: any) => {
              coordinates.push([point.longitude, point.latitude]);
            });
          }
        });
      }
      
      if (coordinates.length === 0) {
        throw new Error('No route coordinates found');
      }

      if (!mapRef.current) return;

      // Remove existing route if any
      if (routeSourceRef.current) {
        if (mapRef.current.getSource(routeSourceRef.current)) {
          mapRef.current.removeLayer(routeSourceRef.current + '-layer');
          mapRef.current.removeSource(routeSourceRef.current);
        }
      }

      const sourceId = 'route-' + Date.now();
      routeSourceRef.current = sourceId;

      // Add route source
      mapRef.current.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
          },
        },
      });

      // Add route layer
      mapRef.current.addLayer({
        id: sourceId + '-layer',
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#006B3F',
          'line-width': 5,
          'line-opacity': 0.8,
        },
      });

      // Fit map to show entire route
      const bounds = coordinates.reduce((bounds, coord) => {
        return bounds.extend(coord as [number, number]);
      }, new mapboxgl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]));

      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 16,
      });

      // Set route info
      setRouteInfo({
        distance: summary.lengthInMeters,
        travelTime: summary.travelTimeInSeconds,
        distanceText: formatDistance(summary.lengthInMeters),
        timeText: formatTime(summary.travelTimeInSeconds),
      });
    } catch (err: any) {
      setError(err.message || 'Failed to calculate route');
      console.error('Route calculation error:', err);
    } finally {
      setIsLoadingRoute(false);
    }
  };

  // Handle get directions button click
  const handleGetDirections = async () => {
    try {
      const location = await getUserLocation();
      setUserLocation(location);

      if (!mapRef.current) return;

      // Remove existing user location marker
      markersRef.current.forEach(marker => {
        if (marker.getElement()?.classList.contains('user-location-marker')) {
          marker.remove();
        }
      });

      // Create user location marker
      const userEl = document.createElement('div');
      userEl.className = 'user-location-marker';
      userEl.style.cssText = `
        width: 36px;
        height: 36px;
        background: #4A90E2;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      userEl.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      const userMarker = new mapboxgl.Marker(userEl)
        .setLngLat([location.lng, location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 6px; font-family: 'DM Sans', system-ui, -apple-system, sans-serif;">
                <p style="margin: 0; font-size: 14px; font-weight: 500; color: #333;">Your Location</p>
              </div>
            `)
        )
        .addTo(mapRef.current);

      userMarker.togglePopup();
      markersRef.current.push(userMarker);

      // Calculate route
      await calculateRoute(location.lat, location.lng, lat, lng);
    } catch (err: any) {
      setError(err.message || 'Failed to get your location');
      console.error('Location error:', err);
    }
  };

  // Clear route
  const clearRoute = () => {
    if (!mapRef.current) return;

    if (routeSourceRef.current) {
      if (mapRef.current.getSource(routeSourceRef.current)) {
        mapRef.current.removeLayer(routeSourceRef.current + '-layer');
        mapRef.current.removeSource(routeSourceRef.current);
      }
      routeSourceRef.current = null;
    }

    // Remove user location marker
    markersRef.current.forEach(marker => {
      if (marker.getElement()?.classList.contains('user-location-marker')) {
        marker.remove();
      }
    });

    setRouteInfo(null);
    setUserLocation(null);
    setError(null);
    
    // Reset view
    const allMarkers = markersRef.current.filter(m => !m.getElement()?.classList.contains('user-location-marker'));
    if (allMarkers.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      allMarkers.forEach(marker => {
        const lngLat = marker.getLngLat();
        bounds.extend([lngLat.lng, lngLat.lat]);
      });
      mapRef.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: showAllRestaurants ? 14 : 16,
      });
    } else {
      mapRef.current.flyTo({
        center: [lng, lat],
        zoom: showAllRestaurants ? 13 : 15,
      });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || !MAPBOX_TOKEN) {
      if (!MAPBOX_TOKEN) {
        setError('Mapbox token is not configured. Please add VITE_MAPBOX_TOKEN to your .env file.');
      }
      return;
    }

    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 15,
    });

    mapRef.current = map;

    // Wait for map to load
    map.on('load', () => {
      // Create restaurant marker (main restaurant - green)
      const restaurantEl = document.createElement('div');
      restaurantEl.className = 'restaurant-main-marker';
      restaurantEl.style.cssText = `
        width: 40px;
        height: 40px;
        background: #006B3F;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
      `;
      restaurantEl.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;

      const restaurantMarker = new mapboxgl.Marker(restaurantEl)
        .setLngLat([lng, lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px; min-width: 200px; font-family: 'DM Sans', system-ui, -apple-system, sans-serif;">
                <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #006B3F;">${restaurantName}</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">${address}</p>
              </div>
            `)
        )
        .addTo(map);

      restaurantMarker.togglePopup();
      markersRef.current.push(restaurantMarker);

      // Add all restaurants on map if showAllRestaurants is true
      if (showAllRestaurants && allRestaurants.length > 0) {
        allRestaurants.forEach((rest) => {
          // Skip the current restaurant (already added)
          if (rest.id === restaurantId) return;

          // Render stars for rating
          const fullStars = Math.floor(rest.rating);
          const starsHtml = Array.from({ length: 5 }, (_, i) => 
            `<div style="width: 8px; height: 8px; border-radius: 50%; background: ${i < fullStars ? '#006B3F' : '#e5e5e5'}; display: inline-block; margin-right: 2px;"></div>`
          ).join('');

          // Fork and knife icon with rating
          const restEl = document.createElement('div');
          restEl.className = 'restaurant-map-marker';
          restEl.style.cssText = `
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          `;
          restEl.innerHTML = `
            <div style="
              width: 32px;
              height: 32px;
              background: #006B3F;
              border: 2px solid white;
              border-radius: 6px;
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              transition: transform 0.2s;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.1 13.34l2.83-2.83L3.91 3.5c-1.56 1.56-1.56 4.09 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z"/>
              </svg>
            </div>
            <div style="
              margin-top: 3px;
              background: white;
              padding: 2px 5px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 600;
              color: #333;
              box-shadow: 0 1px 4px rgba(0,0,0,0.2);
              white-space: nowrap;
              font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
              line-height: 1.2;
            ">${rest.rating.toFixed(1)}</div>
          `;

          // Create popup content
          const popupContent = `
            <div style="padding: 8px; min-width: 200px; font-family: 'DM Sans', system-ui, -apple-system, sans-serif; cursor: pointer;" onclick="window.location.href='/directories/restaurants/${rest.id}'">
              <h3 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #006B3F;">${rest.name}</h3>
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                ${starsHtml}
                <span style="font-size: 12px; color: #666;">${rest.rating.toFixed(1)}</span>
                ${rest.reviewCount ? `<span style="font-size: 12px; color: #666;">(${rest.reviewCount})</span>` : ''}
              </div>
              <p style="margin: 0; font-size: 12px; color: #666;">${rest.cuisine}</p>
            </div>
          `;

          const restMarker = new mapboxgl.Marker(restEl)
            .setLngLat([rest.lng, rest.lat])
            .setPopup(
              new mapboxgl.Popup({ 
                offset: 25,
                closeOnClick: false,
                closeButton: false,
              })
                .setHTML(popupContent)
            )
            .addTo(map);

          // Hover functionality
          let hoverTimeout: NodeJS.Timeout | null = null;
          let isHovering = false;

          restEl.addEventListener('mouseenter', () => {
            isHovering = true;
            if (hoverTimeout) clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
              if (isHovering) {
                restMarker.togglePopup();
              }
            }, 200);
          });

          restEl.addEventListener('mouseleave', () => {
            isHovering = false;
            if (hoverTimeout) clearTimeout(hoverTimeout);
            hoverTimeout = setTimeout(() => {
              if (!isHovering && restMarker.getPopup().isOpen()) {
                restMarker.togglePopup();
              }
            }, 300);
          });

          // Keep popup open when hovering over it
          restMarker.getPopup().on('open', () => {
            const popupEl = restMarker.getPopup().getElement();
            if (popupEl) {
              popupEl.addEventListener('mouseenter', () => {
                isHovering = true;
                if (hoverTimeout) clearTimeout(hoverTimeout);
              });
              popupEl.addEventListener('mouseleave', () => {
                isHovering = false;
                if (hoverTimeout) clearTimeout(hoverTimeout);
                hoverTimeout = setTimeout(() => {
                  if (!isHovering) {
                    restMarker.togglePopup();
                  }
                }, 300);
              });
            }
          });

          // Click handler
          restEl.addEventListener('click', () => {
            if (onRestaurantClick) {
              onRestaurantClick(rest.id);
            } else {
              window.location.href = `/directories/restaurants/${rest.id}`;
            }
          });

          markersRef.current.push(restMarker);
          popupsRef.current.push(restMarker.getPopup());
        });
      }

      // Add nearby places markers
      nearbyPlaces.forEach((place) => {
        const placeEl = document.createElement('div');
        placeEl.style.cssText = `
          width: 32px;
          height: 32px;
          background: ${place.type === 'restaurant' ? '#FF6B35' : '#4A90E2'};
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          cursor: pointer;
        `;
        placeEl.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        `;

        const placeMarker = new mapboxgl.Marker(placeEl)
          .setLngLat([place.lng, place.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="padding: 6px; min-width: 150px; font-family: 'DM Sans', system-ui, -apple-system, sans-serif;">
                  <p style="margin: 0; font-size: 14px; font-weight: 500; color: #333;">${place.name}</p>
                  <p style="margin: 4px 0 0 0; font-size: 12px; color: #666; text-transform: capitalize;">${place.type}</p>
                </div>
              `)
          )
          .addTo(map);

        markersRef.current.push(placeMarker);
      });

      // Fit bounds to show all markers
      const allMarkers = markersRef.current;
      if (allMarkers.length > 1) {
        const bounds = new mapboxgl.LngLatBounds();
        allMarkers.forEach(marker => {
          const lngLat = marker.getLngLat();
          bounds.extend([lngLat.lng, lngLat.lat]);
        });
        map.fitBounds(bounds, {
          padding: 50,
          maxZoom: showAllRestaurants ? 14 : 16,
        });
      } else {
        map.flyTo({
          center: [lng, lat],
          zoom: showAllRestaurants ? 13 : 15,
        });
      }
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      popupsRef.current.forEach(popup => popup.remove());
      markersRef.current = [];
      popupsRef.current = [];
      if (routeSourceRef.current && mapRef.current) {
        if (mapRef.current.getSource(routeSourceRef.current)) {
          mapRef.current.removeLayer(routeSourceRef.current + '-layer');
          mapRef.current.removeSource(routeSourceRef.current);
        }
      }
      map.remove();
    };
  }, [lat, lng, restaurantName, address, nearbyPlaces, showControls, showAllRestaurants, allRestaurants, restaurantId, onRestaurantClick]);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <style>{`
        .mapboxgl-popup-content {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          font-family: 'DM Sans', system-ui, -apple-system, sans-serif;
        }

        .mapboxgl-popup-tip {
          border-top-color: white;
        }

        .restaurant-main-marker,
        .restaurant-map-marker,
        .user-location-marker {
          transition: transform 0.2s;
        }

        .restaurant-main-marker:hover,
        .restaurant-map-marker:hover {
          transform: scale(1.1);
        }
      `}</style>
      {showRouting && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}>
          {!routeInfo ? (
            <button
              onClick={handleGetDirections}
              disabled={isLoadingRoute}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                background: '#006B3F',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: isLoadingRoute ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                opacity: isLoadingRoute ? 0.7 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!isLoadingRoute) {
                  e.currentTarget.style.background = '#005a33';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoadingRoute) {
                  e.currentTarget.style.background = '#006B3F';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              <Navigation size={18} />
              {isLoadingRoute ? 'Getting route...' : 'Get Directions'}
            </button>
          ) : (
            <div style={{
              background: 'white',
              borderRadius: '8px',
              padding: '12px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              minWidth: '200px',
              fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}>
                <h4 style={{
                  margin: 0,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#333',
                }}>Route Information</h4>
                <button
                  onClick={clearRoute}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    color: '#666',
                  }}
                  title="Clear route"
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#666',
                }}>
                  <MapPin size={14} color="#006B3F" />
                  <span>{routeInfo.distanceText}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#666',
                }}>
                  <Clock size={14} color="#006B3F" />
                  <span>{routeInfo.timeText}</span>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div style={{
              background: '#fee',
              color: '#c33',
              padding: '10px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: "'DM Sans', system-ui, -apple-system, sans-serif",
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              maxWidth: '250px',
            }}>
              {error}
            </div>
          )}
        </div>
      )}

      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: height,
          borderRadius: '0.5rem',
          overflow: 'hidden',
          border: '1px solid #e5e5e5',
          zIndex: 0,
        }}
        className="restaurant-map-container"
      />
    </div>
  );
};
