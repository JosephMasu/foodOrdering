import { Text, FlatList  } from "react-native";
import orders from "@/assets/data/orders";
import OrderItemListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";
export default function OrdersXcreen(){
    const {data: orders, isLoading, error} = useAdminOrderList({archived: false});
    if(isLoading) return <Text>Loading...</Text>
    if(error) return <Text>Error: {error.message}</Text>
    return(
        <FlatList 
            data={orders} 
            renderItem={({item}) => <OrderItemListItem order={item}/>}
            contentContainerStyle={{padding:10, gap:10}}
        />
    )
}



