'use client';

import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapProps {
    latitude: number;
    longitude: number;
}

export default function Map({ latitude, longitude }: MapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (latitude && longitude) {
            const map = new maplibregl.Map({
                container: mapContainer.current!,
                style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
                center: [longitude, latitude],
                zoom: 12,
            });

            const markerElement = document.createElement('div');
            markerElement.style.width = '46px';
            markerElement.style.height = '57px';
            markerElement.style.backgroundImage = 'url(icon/icon-location.svg)';

            new maplibregl.Marker({ element: markerElement })
                .setLngLat([longitude, latitude])
                .addTo(map);

            return () => map.remove();
        }
    }, [latitude, longitude]);

    return <div ref={mapContainer} style={{ width: '100%', height: '580px' }} />;
}
