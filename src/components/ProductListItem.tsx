import Colors from '@/src/constants/Colors';
import { StyleSheet, Text, Pressable, Image } from 'react-native';
import { Tables } from '../types';
import { Link } from 'expo-router';
import RemoteImage from './RemoteImage';

type ProductListItemProps ={
    product: Tables<'products'>;
}
export const defaultPizzaImage = 
'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/food/default.png';

const ProductListItem = ({product}:ProductListItemProps)=>{
  return(
    <Link href={`/menu/${product.id}`} asChild>
        <Pressable style={styles.container}>
        <RemoteImage path={product.image} fallback={defaultPizzaImage} style={styles.image} resizeMode='contain'/>

        <Text style= {styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>

        </Pressable>
    </Link>
  );
};

export default ProductListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth:'50%'
  },
  title: {
    fontSize:18, 
    fontWeight: '400',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
  image:{
    width: '100%',
    aspectRatio:1,
  },
  
});
