import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function SellerScreen({ refreshProducts }) {
  const [productName, setProductName] = useState('');
  const [company, setCompany] = useState('');
  const [techSpecs, setTechSpecs] = useState('');
  const [condition, setCondition] = useState('new');
  const [price, setPrice] = useState('');
  const [imageBase64, setImageBase64] = useState('');

  const handleChoosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        setImageBase64(base64);
        Alert.alert("Photo Selected!");
      }
    } catch (error) {
      Alert.alert("Error selecting photo:", error.message);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;
      const productData = {
        productName,
        company,
        techSpecs,
        condition,
        price,
        imageBase64,
        seller: user.email,
      };

      await setDoc(doc(db, 'products', `${user.email}_${productName}`), productData, { merge: true });
      Alert.alert("Product uploaded!");
      refreshProducts(); // Refresh the TechBarterApp screen
    } catch (error) {
      Alert.alert("Error uploading product:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageBase64 ? (
        <Image source={{ uri: `data:image/jpeg;base64,${imageBase64}` }} style={styles.productImage} />
      ) : (
        <Text style={styles.noPhoto}>No Photo</Text>
      )}
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput
        placeholder="Company"
        value={company}
        onChangeText={setCompany}
        style={styles.input}
      />
      <TextInput
        placeholder="Tech Specs"
        value={techSpecs}
        onChangeText={setTechSpecs}
        style={styles.input}
      />
      <View style={styles.radioButtonContainer}>
        <Text style={styles.radioButtonLabel}>Condition:</Text>
        <View style={styles.radioButton}>
          <TouchableOpacity onPress={() => setCondition('new')} style={condition === 'new' ? styles.radioSelected : styles.radio}>
            <Text style={styles.radioText}>New</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCondition('used')} style={condition === 'used' ? styles.radioSelected : styles.radio}>
            <Text style={styles.radioText}>Used</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Upload Product</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 2,
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  noPhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  radioButtonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  radioButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  radio: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
  radioSelected: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  radioText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
