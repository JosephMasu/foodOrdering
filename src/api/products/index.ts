import { supabase } from "@/src/lib/supabase";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
export const useUpadateProduct =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        async mutationFn(data:any) {
            const {data:UpdatedProduct, error} = await supabase.from('products').update({
                name:data.name,
                image:data.image,
                price:data.price,
            })
            .eq('id', data.id)
            .select()
            .single();
            if (error) {
                throw new Error(error.message);
              }
              return UpdatedProduct;

        },
        async onSuccess(_,{data}) {
            await queryClient.invalidateQueries({queryKey:['products']});
            await queryClient.invalidateQueries({queryKey:['products', data.id]});
            
        }
    });
}

export const useDeleteProduct =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        async mutationFn(id:string){            
            const {error}=await supabase.from('products').delete().eq('id', id);
            if (error) {
                throw new Error(error.message);
              }
        },
            async onSuccess(){
            await queryClient.invalidateQueries({queryKey:['products']});
            }
        }    
    );
    
};
