import { Text, FlatList  } from "react-native";
import OrderItemListItem from "@/src/components/OrderListItem";
import { useAdminOrderList } from "@/src/api/orders";
import { ActivityIndicator } from "react-native";
import { supabase } from "@/src/lib/supabase";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useInsertOrderSubscription } from "@/src/api/orders/subscrption";
export default function OrdersXcreen(){
    const {data: orders, isLoading, error} = useAdminOrderList({archived: false});
    const queryClient = useQueryClient();
    useInsertOrderSubscription();

    if(isLoading) return <ActivityIndicator/>
    if(error) return <Text>Error: {error.message}</Text>      
    return(
        <FlatList 
            data={orders} 
            renderItem={({item}) => <OrderItemListItem order={item}/>}
            contentContainerStyle={{padding:10, gap:10}}
        />
    )
}



