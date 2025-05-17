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

const supabaseUrl = 'https://cyodoatrlmtkbdkjoakw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5b2RvYXRybG10a2Jka2pvYWt3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODEyOTUsImV4cCI6MjA2MzA1NzI5NX0.sKyxwi1RjUGJTyit8Fs5cExmdY87ZlTVg0-YerBF0fw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})