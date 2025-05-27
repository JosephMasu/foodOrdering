import { ActivityIndicator, Pressable, Text, View} from "react-native"
import { Stack, useLocalSearchParams } from "expo-router"
import orders from "@/assets/data/orders"
import OrderListItem from "@/src/components/OrderListItem"
import { FlatList } from "react-native"
import OrderItemListItem from "@/src/components/OrderItemListItem"
import { OrderStatusList } from "@/src/types"
import Colors from "@/src/constants/Colors"
import { useOrderDetails, useUpadateOrder } from "@/src/api/orders"
import { notifyUserAboutOrders } from "@/src/lib/notification"


export default function OrderDetailsScreen(){
  const {id:idString} = useLocalSearchParams();
  const id = parseFloat (typeof idString === 'string' ? idString : idString[0]);    

  const {data:order, error, isLoading} = useOrderDetails(id);
  const {mutate:updateOrder} = useUpadateOrder();
  
  if(isLoading) return <ActivityIndicator />
  if(error) return <Text>Error: {error.message}</Text>    
    if(!order){
        return<Text>Order not found</Text>
    }
  const updateStatus = async(status:string) => {
    await updateOrder({id:id, updatedFields:{status}});
    if(order){
      await notifyUserAboutOrders({...order, status});
    }
  }

    return( 
        <View style={{  padding:10, gap:10 }}>
            <Stack.Screen options={{title: `Order #${id}`}}/>
            <FlatList
                data={order.order_items}
                renderItem={({item}) =><OrderItemListItem item={item} />}
                contentContainerStyle={{ gap:10 }}
                ListHeaderComponent={()=> <OrderListItem order={order} />}
                ListFooterComponent={()=> 
            <>
              <Text style={{ fontWeight: 'bold' }}>Status</Text>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {OrderStatusList.map((status) => (
                  <Pressable
                    key={status}
                    onPress={() => updateStatus(status)}
                    style={{
                      borderColor: Colors.light.tint,
                      borderWidth: 1,
                      padding: 10,
                      borderRadius: 5,
                      marginVertical: 10,
                      backgroundColor:
                        order.status === status
                          ? Colors.light.tint
                          : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color:
                          order.status === status ? 'white' : Colors.light.tint,
                      }}
                    >
                      {status}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </>

            }
            />
        </View>
    );
}