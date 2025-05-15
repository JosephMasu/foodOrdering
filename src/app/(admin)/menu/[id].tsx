import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import products from "@/assets/data/products";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
import { useState } from "react";
import Button from "@/src/components/Button";
import { useCart } from "@/src/providers/CartProvider";
import { PizzaSize } from "@/src/types";
import { useRouter } from "expo-router";

const ProductDetailsScreen = () =>{
    const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL'];
    const {id} = useLocalSearchParams();

    const {addItem} = useCart();

    const router = useRouter();

    const [selectedSize, setSelectedSize] = useState<PizzaSize>('M');
    const product = products.find(p => p.id.toString() === id);

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
    return(
        <View style={styles.container}>
            <Stack.Screen options={{title:product?.name}} />
            <Image 
                source = {{uri:product.image || defaultPizzaImage}} 
                style = {styles.image}
                resizeMode='contain'>
            </Image>
            {/* <Text>Select size:</Text> */}
            {/* <View style={styles.sizes}>
                {sizes.map(size => (
                    <Pressable 
                        onPress={() => setSelectedSize(size)}
                        style = {[styles.size, { backgroundColor: selectedSize === size ? 'gainsboro':'white'}]} key={size}>
                        <Text style={[styles.sizeText, { color: selectedSize === size ? 'black':'gray'}]}>{size}</Text>                    
                    </Pressable>
                ))}
            </View> */}
            <Text style={ styles.name}>${product.name}</Text>
            <Text style={ styles.price}>${product.price}</Text>
            {/* <Button onPress={addToCart} text="Add to cart"/> */}
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