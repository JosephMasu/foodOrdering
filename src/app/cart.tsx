import {View, Text, Platform} from 'react-native';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useCart } from '../providers/CartProvider';
import { FlatList } from 'react-native';
import CartListItem from '../components/CartListItem';
import Button from '../components/Button';

const CartScreen = () => {
    const { items, total } = useCart();
  return (
    <View style={{padding:10,}}>
        <FlatList 
            data={items}
            renderItem={({item}) => <CartListItem cartItem={item}/>}
            contentContainerStyle={{ gap:10}}
        />
      {/* <Text>Cart items length: {items.length}</Text> */}
      <Text style={{marginTop:20, fontSize:18, fontWeight:'500'}}>Total: {total}</Text>
      <Button text='Checkout'/>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
};

export default CartScreen;