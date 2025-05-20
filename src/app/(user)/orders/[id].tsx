import { Text, View} from "react-native"
import { Stack, useLocalSearchParams } from "expo-router"
import OrderListItem from "@/src/components/OrderListItem"
import { FlatList } from "react-native"
import OrderItemListItem from "@/src/components/OrderItemListItem"
import { useOrderDetails } from "@/src/api/orders"


export default function OrderDetailsScreen(){
    const {id:idString} = useLocalSearchParams();
    const id = parseFloat (typeof idString === 'string' ? idString : idString[0]);    

    const {data:order, error, isLoading} = useOrderDetails(id);
    
    if(isLoading) return <Text>Loading...</Text>
    if(error) return <Text>Error: {error.message}</Text>

    return( 
        <View style={{  padding:10, gap:10 }}>
            <Stack.Screen options={{title: `Order #${id}`}}/>
            <FlatList
                data={order.order_items}
                renderItem={({item}) =><OrderItemListItem item={item} />}
                contentContainerStyle={{ gap:10 }}
                ListHeaderComponent={()=> <OrderListItem order={order} />}
            />
        </View>
    );
}