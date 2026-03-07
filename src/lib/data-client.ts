import { createClient } from '@neondatabase/neon-js';

export const dataClient = createClient({
  auth: {
    url: process.env.NEXT_PUBLIC_NEON_AUTH_URL!,
  },
  dataApi: {
    url: process.env.NEXT_PUBLIC_NEON_DATA_API_URL!,
  },
});
