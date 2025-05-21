import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import { useState } from "react";
import Button from "@/src/components/Button";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";
import { useRouter } from "expo-router";
import { useProduct } from "@/src/api/products";
import RemoteImage from "@/src/components/RemoteImage";

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
        return <Text>Loading...</Text>;
        }
        if (error) {
        return <Text>Error: {error.message}</Text>;
    }
    
    return(
        <View style={styles.container}>
            <Stack.Screen options={{title:product?.name}} />
            <RemoteImage 
                path={product.image}
                fallback={defaultPizzaImage}
                style = {styles.image}
                resizeMode='contain'>
            </RemoteImage>
            <Text>Select size:</Text>
            <View style={styles.sizes}>
                {sizes.map(size => (
                    <Pressable 
                        onPress={() => setSelectedSize(size)}
                        style = {[styles.size, { backgroundColor: selectedSize === size ? 'gainsboro':'white'}]} key={size}>
                        <Text style={[styles.sizeText, { color: selectedSize === size ? 'black':'gray'}]}>{size}</Text>                    
                    </Pressable>
                ))}
            </View>
            <Text style={ styles.price}>${product.price}</Text>
            <Button onPress={addToCart} text="Add to cart"/>
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
        marginTop: 'auto',
    },
    size: {
        backgroundColor:'gainsboro',
        width: 50,
        aspectRatio:1,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 2,
    },
    sizeText: {
        fontSize: 20,
        fontWeight: '500',
        marginVertical:10,
    },
});


export default ProductDetailsScreen;