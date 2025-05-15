import { FlatList } from 'react-native';
import Products from '@/assets/data/products';
import ProductListItem from '@/src/components/ProductListItem';

export default function TabOneScreen() {
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
