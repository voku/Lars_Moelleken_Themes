import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const base = mode === 'production' ? env.VITE_BASE_PATH || '/Lars_Moelleken_Themes/' : '/';

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // Allow file watching to be disabled in constrained editing environments.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
