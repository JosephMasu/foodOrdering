import { Stack } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';
import Colors from '@/src/constants/Colors';

export default function MenuStack(){
    return (
    <Stack>
        <Stack.Screen name="index" options={{title: "Orders"}}></Stack.Screen>
    </Stack>);
}