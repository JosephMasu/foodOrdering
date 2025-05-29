import Button from '@/src/components/Button';
import { View, Text, StyleSheet, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useDeleteProduct, useInsertProduct, useProduct, useUpadateProduct } from '@/src/api/products';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import Colors from '@/src/constants/Colors';

const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { id: idString } = useLocalSearchParams();
  const id = typeof idString === 'string' ? idString : idString?.[0];
  const isUpdating = !!id;

  const { mutateAsync: insertProduct } = useInsertProduct();
  const { mutateAsync: updateProduct } = useUpadateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();
  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const PickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateInputs = () => {
    setError('');
    if (!name) {
      setError('Name is required');
      return false;
    }
    if (!price) {
      setError('Price is required');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setError('Price must be a number');
      return false;
    }
    return true;
  };

  const resetFields = () => {
    setName('');
    setPrice('');
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) return image;
    const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });
    return data?.path;
  };

  const onCreate = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    const imagePath = await uploadImage();
    await insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
    setIsLoading(false);
  };

  const onUpdate = async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    const imagePath = await uploadImage();
    await updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
    setIsLoading(false);
  };

  const onSubmit = () => {
    isUpdating ? onUpdate() : onCreate();
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => router.replace('/(admin)'),
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm!', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: isUpdating ? 'Update Product' : 'Create Product' }} />
      <Text style={styles.heading}>{isUpdating ? 'Update Product' : 'Create Product'}</Text>

      <View style={styles.card}>
        <Image source={{ uri: image || defaultPizzaImage }} style={styles.image} />
        <Text style={styles.imageLink} onPress={PickImage}>
          Select Image
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Product name"
          style={styles.input}
        />

        <Text style={styles.label}>Price ($)</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          placeholder="9.99"
          style={styles.input}
          keyboardType="numeric"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button
          onPress={onSubmit}
          text={isUpdating ? 'Update Product' : 'Create Product'}
          disabled={isLoading}
        />
        {isLoading && <ActivityIndicator color={Colors.light.tint} style={styles.spinner} />}
        {isUpdating && (
          <Text style={styles.deleteText} onPress={confirmDelete}>
            Delete Product
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageLink: {
    textAlign: 'center',
    color: Colors.light.tint,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    marginBottom: 6,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 12,
  },
  spinner: {
    marginVertical: 10,
  },
  deleteText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CreateProductScreen;
