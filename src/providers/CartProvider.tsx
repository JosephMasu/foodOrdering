import { createContext, PropsWithChildren, useContext } from "react";
import { Product } from '../types';
import { CartItem } from '../types';
import { useState } from "react";

type CartType ={
    items: CartItem[];
    addItem: (product: Product, size:CartItem['size']) => void;
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => {},  
});

const CartProvider = ({children}:PropsWithChildren) =>{
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (product: Product, size:CartItem['size']) =>{
        //if already in cart, icrement quantity
        const newcartItem: CartItem = {
            id: '1',
            // Math.random().toString(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        }; 
        setItems([newcartItem, ...items]);
        // updatequantity
    };
    console.log(items);
    return(
        <CartContext.Provider value={{items, addItem}}>
            {children}
        </CartContext.Provider>

    );
}

export default CartProvider;

export const useCart = () => useContext(CartContext);

