{
  "name": "cheaper-nexus",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port=3000 --host=0.0.0.0",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "tsc --noEmit",
    "deploy:firebase": "npm run build && firebase deploy",
    "deploy:gh-pages": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "@google/genai": "^1.29.0",
    "lucide-react": "^0.546.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "motion": "^12.23.24"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.14",
    "@types/node": "^22.14.0",
    "@types/express": "^4.17.21",
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "tailwindcss": "^4.1.14",
    "gh-pages": "^6.3.0",
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
