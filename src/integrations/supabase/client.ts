// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bbgvamnmaabjtzyotczn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiZ3ZhbW5tYWFianR6eW90Y3puIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NDAxMDEsImV4cCI6MjA1MDUxNjEwMX0.Jc1d8JGDYIrv8NkEDO50tPX9XIKQh9mmVz4l6QMF7qs";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);