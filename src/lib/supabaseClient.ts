import { createClient } from '@supabase/supabase-js';

const link = import.meta.env.VITE_SUPABASE_LINK;
const key = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(link, key);
