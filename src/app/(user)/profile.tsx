import React, { useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          router.replace('/sign-in');
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error:any) {
      Alert.alert('Error signing out', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 18, textAlign: 'center' }}>
        Welcome to your profile!
      </Text>
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
};

export default ProfileScreen;
