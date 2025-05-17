import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient} from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store';


const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
      return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
      SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
      SecureStore.deleteItemAsync(key);
    },
  };

const supabaseUrl = 'https://brszuhmdseknadpsdtla.supabase.co';
const supabaseanonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyc3p1aG1kc2VrbmFkcHNkdGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0NzgyMDgsImV4cCI6MjA2MzA1NDIwOH0._h0C5ZfdaBFe1fNS_wwQ4yEMQucAsyGtxaKei5KhOMU';

export const supabase = createClient(supabaseUrl, supabaseanonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})