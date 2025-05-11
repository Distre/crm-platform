import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Viderekoble alle /customer og /invoice-kall til NestJS på port 3000
      '/customer': 'http://localhost:3000',
      '/invoice': 'http://localhost:3000',
    },
  },
});