import Button from '@/src/components/Button';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import { useState } from 'react';


const CreateProductScreen = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');

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
        console.log('create product', name, price);
        resetFields();
        if(!validateInputs()){
            return;
        }
    ;
    }
    return(
        <View style={styles.container}>
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
            <Button onPress={onCreate} text='create product'/>
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
    }
});

export default CreateProductScreen;
