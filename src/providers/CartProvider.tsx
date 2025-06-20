import { createContext, PropsWithChildren, useContext } from "react";
import { CartItem, Tables } from '../types';
import { useState } from "react";
import {randomUUID} from 'expo-crypto'
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";
import { initialisePaymentSheet, openPaymentSheet } from "../lib/stripe";
type Product = Tables<'products'>

type CartType ={
    items: CartItem[];
    addItem: (product: Product, size:CartItem['size']) => void;
    updateQuantity: (itemId: string, amount: -1 | 1) => void;
    total: number;
    checkout: () => void;
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},  
    updateQuantity: () => {},  
    total: 0,
    checkout: () => {},
});

const CartProvider = ({children}:PropsWithChildren) =>{
    const [items, setItems] = useState<CartItem[]>([]);

    const {mutate: insertOrder} = useInsertOrder();
    const {mutate: insertOrderItems} = useInsertOrderItems();
    const router = useRouter();

    const addItem = (product: Product, size:CartItem['size']) =>{
        const existingItem = items.find(item => item.product_id === product.id && item.size === size);
        if(existingItem){
            updateQuantity(existingItem.id, 1); 
            return;
        }
        const newcartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        }; 
        setItems([newcartItem, ...items]);
    };
    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        setItems(
            items.map(item => 
                item.id !== itemId 
                ? item : {...item, quantity: item.quantity + amount}
            ).filter(item => item.quantity > 0)
        );
    }
    const clearCart = () => {
        setItems([]);
    }
    const checkout = async() => {
        await initialisePaymentSheet(Math.floor(total * 100));
        const paid = await openPaymentSheet();
        if(!paid) return;

        insertOrder(
            {total}, 
            {
                onSuccess: saveOrderItems
            
            }
        );        
    };
    const saveOrderItems = (order: Tables<'orders'>) => {
        const orderItems = items.map((cartItem) => ({
          order_id: order.id,
          product_id: cartItem.product_id,
          quantity: cartItem.quantity,
          size: cartItem.size,
        }));
    
        insertOrderItems(orderItems, {
          onSuccess() {
            clearCart();
            router.push(`/(user)/orders/${order.id}`);
          },
        });
      };

    const total =items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    return(
        <CartContext.Provider value={{items, addItem, updateQuantity, checkout, total}}>
            {children}
        </CartContext.Provider>

    );
}

export default CartProvider;

export const useCart = () => useContext(CartContext);

