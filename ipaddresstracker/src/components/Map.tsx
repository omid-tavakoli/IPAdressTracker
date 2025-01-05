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

            new maplibregl.Marker().setLngLat([longitude, latitude]).addTo(map);

            return () => map.remove();
        }
    }, [latitude, longitude]);


    return <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />;
}
