import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text, Image, StyleSheet } from "react-native";
import products from "@/assets/data/products";
import { defaultPizzaImage } from "@/src/components/ProductListItem";
const ProductDetailsScreen = () =>{
    const sizes = ['S', 'M', 'L', 'XL'];
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
            <Text>Select size:</Text>
            <View style={styles.sizes}>
                {sizes.map(size => (
                    <View style = {styles.size} key={size}>
                        <Text style={styles.sizeText}>{size}</Text>                    
                    </View>
                ))}
            </View>
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