import { useAuth } from "@/src/hooks/useAuth";
import { supabase } from "@/src/lib/supabase";
import { UpdateTables, InsertTables } from "@/src/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminOrderList =({ archived = false }) =>{
    const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering'];

    return useQuery({
        queryKey: ['orders',{archived}],
        queryFn: async () => {
          const { data, error } = await supabase
          .from('orders')
          .select('*')
          .in('status', statuses).order('created_at',{ascending:false});
          if (error) { 
            throw new Error(error.message);
          }
          return data;
        }
    })
};
export const useMyOrderList =()=>{
    const {session}=useAuth();
    const id = session?.user.id;
    return useQuery({
        queryKey: ['orders', {userId:id}],
        queryFn: async () => {
            if(!id) return null;
          const { data, error } = await supabase.from('orders').select('*').eq('user_id',id).order('created_at',{ascending:false});
          if (error) {
            throw new Error(error.message);
          }
          return data;
        }
    })
};
export const useOrderDetails = (id:number) =>{
    return useQuery({
        queryKey: ['orders', id],

        queryFn: async () => {
          const { data, error } = await supabase.from('orders').select('*, order_items(*, products(*))').eq('id', id).single();
          if (error) {
            throw new Error(error.message);
          }
          return data;
        }
    })
};

export const useInsertOrder =()=>{
    const queryClient = useQueryClient();
    const {session}=useAuth();
    const userId = session?.user.id;
    return useMutation({
        async mutationFn(data:InsertTables<'orders'>) {
            const {data:newProduct, error} = await supabase.from('orders')
            .insert({user_id:userId, ...data})
            .select()
            .single();
             if (error) {
                throw new Error(error.message);
              }
              return newProduct;

        },
        async onSuccess() {
            await queryClient.invalidateQueries({queryKey:['orders']});
            
        }
    });
};

export const useUpadateOrder =()=>{
  const queryClient = useQueryClient();
  return useMutation({
      async mutationFn({
        id,
        updatedFields,
      }:{
        id:number;
        updatedFields:UpdateTables<'orders'>;

        }) {
          const {data:UpdatedOrder, error} = await supabase
          .from('orders')
          .update(updatedFields)
          .eq('id', id)
          .select()
          .single();
          if (error) {
              throw new Error(error.message);
            }
            return UpdatedOrder;

      },
      async onSuccess(_,{id}) {
          await queryClient.invalidateQueries({queryKey:['orders']});
          await queryClient.invalidateQueries({queryKey:['orders', id]});          
      }
  });
}