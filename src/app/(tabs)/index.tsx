import {View } from 'react-native';
import products from '../../../assets/data/products';
import ProductListItem from '@/src/components/ProductListItem';


export default function TabOneScreen() {
  return (
    <view>
      <ProductListItem product = {products[1]}/>
      <ProductListItem product = {products[2]}/>
    </view>
  );
}


