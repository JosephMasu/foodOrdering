import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '@/src/lib/supabase';
import { useRouter } from 'expo-router';

const ProfileScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect on sign-out
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/sign-in');
      }
    });

    // Fetch user email
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        Alert.alert('Error fetching user', error.message);
      } else {
        setEmail(data?.user?.email || null);
      }
      setLoading(false);
    };

    fetchUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      Alert.alert('Error signing out', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
          style={styles.avatar}
        />
        <Text style={styles.name}>Welcome!</Text>
        <Text style={styles.email}>{email}</Text>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eef2f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 10,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  email: {
    fontSize: 15,
    color: '#888',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#ff5c5c',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;
