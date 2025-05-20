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

const supabaseUrl = 'https://cneddpjmqhybfbspcfhj.supabase.co';
const supabaseanonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNuZWRkcGptcWh5YmZic3BjZmhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODg4NTUsImV4cCI6MjA2MzA2NDg1NX0.0eOBdDFiNM8EptljW7GuJzXDa3VKsvyFe-TghIC8Jaw'

export const supabase = createClient<Database>(supabaseUrl, supabaseanonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})