import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import products from "@/assets/data/products";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import { useState } from "react";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";
import { useRouter } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { useProduct } from "@/src/api/products";


const ProductDetailsScreen = () =>{
    const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
    const {id:idString} = useLocalSearchParams();
    const id = typeof idString === 'string' ? idString : idString[0];
    const {data:product, error,isLoading} = useProduct(id);


    const {addItem} = useCart();

    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');

    const addToCart  = ()=>{
        if(!product) return;
        addItem(product, selectedSize);  
        router.push('/cart');
    };

    if(!product){
        return(
            <View>
                <Text>Product not found</Text>
            </View>
        );
    }
    if (isLoading) {
        return <ActivityIndicator />;
        }
        if (error) {
        return <Text>Error: {error.message}</Text>;
    }
    return(
        <View style={styles.container}>
        <Stack.Screen 
        options={{
            title: "Menu",
            headerRight: () => (
                <Link href={`/(admin)/menu/create?id=${id}`} asChild>
                <Pressable>
                    {({ pressed }) => (
                    <FontAwesome
                        name="pencil"
                        size={25}
                        color={Colors.light.tint}
                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                    />
                    )}
                </Pressable>
                </Link>
            ),
        }}/>
            <Stack.Screen options={{title:product.name}} />
            <Image 
                source = {{uri:product.image || defaultPizzaImage}} 
                style = {styles.image}
                resizeMode='contain'>
            </Image>

            <Text style={ styles.name}>${product.name}</Text>
            <Text style={ styles.price}>${product.price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flex: 1,
    },
    image: {
        width: '100%',
        aspectRatio: 1,
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    name:{
        fontSize: 15,
        fontWeight: '500',
    }
});

export default ProductDetailsScreen;