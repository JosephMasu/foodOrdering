import { Text, FlatList  } from "react-native";
import orders from "@/assets/data/orders";
import OrderItemListItem from "@/src/components/OrderListItem";
export default function OrdersXcreen(){
    return(
        <FlatList 
            data={orders} 
            renderItem={({item}) => <OrderItemListItem order={item}/>}
            contentContainerStyle={{padding:10, gap:10}}
        />
    )
}



