import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ToastAndroid } from "react-native";
export const useProductList =()=>{
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
          const { data, error } = await supabase.from('products').select('*');
          if (error) {
            throw new Error(error.message);
          }
          return data;
        }
    })
}

export const useProduct = (id:string) =>{
    return useQuery({
        queryKey: ['products', id],

        queryFn: async () => {
          const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
          if (error) {
            throw new Error(error.message);
          }
          return data;
        }
    })
}

export const useInsertProduct =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        async mutationFn(data:any) {
            const {data:newProduct, error} = await supabase.from('products').insert({
                name:data.name,
                image:data.image,
                price:data.price,
            }).single();
            if (error) {
                throw new Error(error.message);
              }
              return newProduct;

        },
        async onSuccess() {
            await queryClient.invalidateQueries({queryKey:['products']});
            
        }
    });
}  