import Button from '@/src/components/Button';
import {View, Text, StyleSheet, TextInput, Image, Alert} from 'react-native';
import { useState } from 'react';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useInsertProduct } from '@/src/api/products';



const CreateProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const {id} = useLocalSearchParams();
    const isUpdating = !!id;

    const {mutateAsync: insertProduct} = useInsertProduct();
    const router = useRouter();



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

    const onCreate = ()=>{
        console.log('creating product', name, price);
        insertProduct({name, price:parseFloat(price), image}, {onSuccess:() =>{
            resetFields();
            router.back();
        }});
        if(!validateInputs()){
            return;
        };
    }

    const onUpdate = ()=>{
        console.log('updating product', name, price);
        resetFields();  
        if(!validateInputs()){
            return;
        };
    } 

    const onSubmit = () =>{
        if(isUpdating){
            onUpdate();
        }else{
            onCreate();
        }
    }

    const onDelete = ()=>{
        console.log('deleting product');
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
    return(
        <View style={styles.container}>
            <Stack.Screen options={{title:isUpdating ? 'Update Product' : 'Create Product'}}/>
            <Image source={{uri:image || defaultPizzaImage}} style={styles.image}/>
            <Text style= {styles.imgLabel} onPress={PickImage}>Select Image</Text>


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
            <Button onPress={onSubmit} text={isUpdating ? 'Update product' : 'Create product'}/>
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
