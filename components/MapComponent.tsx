'use client'

import { useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function MapComponent() {
  useEffect(() => {
    // Inicializace mapy až po načtení komponenty
    const map = L.map('map-container').setView([49.3241683, 13.7026364], 17)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    // Fix pro ikony markerů
    const DefaultIcon = L.icon({
      iconUrl: '/images/marker-icon.png',
      iconRetinaUrl: '/images/marker-icon.png',
      shadowUrl: '/images/marker-icon.png',
      iconSize: [41, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [0, 0]
    })

    L.marker([49.3241683, 13.7026364], { icon: DefaultIcon })
      .addTo(map)
      .bindPopup('RECYCLESOUND<br />Mayerova 1067, Horažďovice')

    return () => {
      map.remove()
    }
  }, [])

  return <div id="map-container" className="h-64 w-full rounded-lg z-0" />
}