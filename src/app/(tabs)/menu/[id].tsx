import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";
import products from "@/assets/data/products";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
const ProductDetailsScreen = () =>{
    const {id} = useLocalSearchParams();
    const product = products.find(p => p.id.toString() === id);
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
                style = {styles.image}>
            </Image>
            <Text style={ styles.title}>${product.price}</Text>
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
        marginVertical: 10,
    },
    title: {},
});


export default ProductDetailsScreen;