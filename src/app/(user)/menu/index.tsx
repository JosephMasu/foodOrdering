import { FlatList } from 'react-native';
import Products from '@/assets/data/products';
import ProductListItem from '@/src/components/ProductListItem';
import { Text } from 'react-native';
import { useProductList } from '@/src/api/products';


export default function TabOneScreen() {

const {error, data: Products, isLoading}=useProductList();
if (isLoading) {
  return <Text>Loading...</Text>;
}
if (error) {
  return <Text>Error: {error.message}</Text>;
}

  return (
    <FlatList
      data={Products}
      renderItem={({ item }) => <ProductListItem product={item} />}
      numColumns={2}
      contentContainerStyle={{gap:10, padding:10}}
      columnWrapperStyle={{gap: 10}}
    />
  );
}
