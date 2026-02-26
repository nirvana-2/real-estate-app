import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // FIX: Added the OpenStreetMap Proxy
      '/osm': {
        target: 'https://nominatim.openstreetmap.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/osm/, ''),
      },
      // Your existing backend proxies
      '/socket.io': { target: 'http://localhost:3000', ws: true },
      '/chats': { target: 'http://localhost:3000', changeOrigin: true },
      '/auth': { target: 'http://localhost:3000', changeOrigin: true },
      '/properties': { target: 'http://localhost:3000', changeOrigin: true },
      '/applications': { target: 'http://localhost:3000', changeOrigin: true },
      '/favorites': { target: 'http://localhost:3000', changeOrigin: true },
      '/bookings': { target: 'http://localhost:3000', changeOrigin: true },
      '/users': { target: 'http://localhost:3000', changeOrigin: true },
      '/landlords': { target: 'http://localhost:3000', changeOrigin: true },
      '/tenants': { target: 'http://localhost:3000', changeOrigin: true },
      '/payments': { target: 'http://localhost:3000', changeOrigin: true },
      '/admin': { target: 'http://localhost:3000', changeOrigin: true },
      '/uploads': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
})