import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient} from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store';
import { Database } from '../database.types';

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

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseanonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON || "";

export const supabase = createClient<Database>(supabaseUrl, supabaseanonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})