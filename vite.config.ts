vite_config_ts = """
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/infosaudeteste/',
  plugins: [react()],
});
"""
