import Button from '@/src/components/Button';
import {View, Text, StyleSheet, TextInput, Image, Alert, ActivityIndicator} from 'react-native';
import { useEffect, useState } from 'react';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteProduct, useInsertProduct, useProduct, useUpadateProduct } from '@/src/api/products';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';


const CreateProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const {id:idString} = useLocalSearchParams();
    const id = typeof idString === 'string' ? idString : idString?.[0];

    const isUpdating = !!id;  

    const {mutateAsync: insertProduct} = useInsertProduct();
    const {mutateAsync: updateProduct} = useUpadateProduct();
    const {data: updatingProduct} = useProduct(id);
    const {mutate: deleteProduct} = useDeleteProduct();
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    useEffect(()=>{
        if(updatingProduct){
            setName(updatingProduct.name);
            setPrice(updatingProduct.price.toString());
            setImage(updatingProduct.image);
        }
    }, [updatingProduct]);



    const PickImage = async() => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if(!result.canceled){
            setImage(result.assets[0].uri);
        }
    }

    const resetFields = ()=>{

        if(!validateInputs()){
            return;
        }

        setName('');
        setPrice('');
    }

    const validateInputs = ()=>{
        setError('');
        if(!name){
            setError('Name is required');
            return false;
        }
        if(!price){
            setError('Price is required');
            return false;
        }

        if(isNaN(parseFloat(price))){
            setError('Price must be a number');
            return false;
        }
        return true;

    }

    const onCreate = async ()=>{
        if(!validateInputs()){
            return;
        };

        const imagePath = await uploadImage();

        insertProduct(
                {name, price:parseFloat(price), image:imagePath}, 
                {
                    onSuccess:() =>{
                        resetFields();
                        router.back();
                    },
                }
        );

    }

    const onUpdate = ()=>{
        console.log('updating product', name, price);
        resetFields();  
        if(!validateInputs()){
            return;
        };
        updateProduct({id, name, price:parseFloat(price), image},       
            {
                onSuccess:() =>{
                resetFields();
            },
        }
    );
    router.back();
    } 

    const onSubmit = () =>{
        if(isUpdating){
            onUpdate();
        }else{
            onCreate();
        } 
    }

    const onDelete = ()=>{
        deleteProduct(id,{
            onSuccess:() =>{
                router.replace('/(admin)');
            },
        }) ;
    }

    const confirmDelete = () =>{
        Alert.alert('Confirm!', 'Are you sure you want to delete this product?',[
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: onDelete,
            }

        ]);
    
    }
    const uploadImage = async () => {
        if (!image?.startsWith('file://')) {
          return image;
        }
      
        const base64 = await FileSystem.readAsStringAsync(image, {
          encoding: 'base64',
        });
        const filePath = `${randomUUID()}.png`;
        const contentType = 'image/png';
        const { data, error } = await supabase.storage
          .from('product-images')
          .upload(filePath, decode(base64), { contentType });
        console.log(error);
        if (data) {
          return data.path;
        }
      };
      
    return(
        <View style={styles.container}>
            <Stack.Screen options={{title:isUpdating ? 'Update Product' : 'Create Product'}}/>
            <Image source={{uri:image || defaultPizzaImage}} style={styles.image}/>
            <Text style= {styles.imgLabel} onPress={PickImage}>Select Image</Text>

            {isLoading && (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 20 }} />
            )}

            <Text style= {styles.label}>Name</Text>
            <TextInput 
                value={name} 
                onChangeText={setName}
                placeholder='Name' 
                style={styles.input}
            />

            <Text style= {styles.label}>Price ($)</Text>
            <TextInput 
                value={price} 
                onChangeText={setPrice}
                placeholder='9.99' 
                style={styles.input} 
                keyboardType='numeric'
            />
            
            <Text style={{color:'red'}}>{error}</Text>
            <Button onPress={onSubmit} text={isUpdating ? 'Update product' : 'Create product'} disabled={isLoading}/>
            {isUpdating && <Text style={{color:'red', textAlign:'center', marginBottom: 10}} onPress={confirmDelete}>Delete product</Text>}
        </View>
    );

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        justifyContent: 'center',
    },
    label:{
        color: 'gray',
        fontSize: 16,
    },
    input:{
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        marginTop:5
    },
    image:{
        width: '50%',
        aspectRatio: 1,
        alignSelf: 'center',
        marginBottom: 20,
    },
    imgLabel:{
        alignSelf: 'center',
        marginBottom: 10, 
        fontWeight: 'bold',
        color: Colors.light.tint,
        
    }
});

export default CreateProductScreen;
