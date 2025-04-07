'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

const MapComponent = dynamic(
  () => import('./MapComponent').then((mod) => mod.default),
  { 
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">Načítání mapy...</div>
  }
)

export default function Map() {
  return <MapComponent />
}