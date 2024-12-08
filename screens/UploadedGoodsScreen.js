import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, TextInput } from 'react-native';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const UploadedGoodsScreen = ({ refreshProducts }) => {
  const [uploadedGoods, setUploadedGoods] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productName, setProductName] = useState('');
  const [company, setCompany] = useState('');
  const [techSpecs, setTechSpecs] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');

  const fetchUploadedGoods = async () => {
    const user = auth.currentUser;
    const q = query(collection(db, 'products'), where('seller', '==', user.email));
    const querySnapshot = await getDocs(q);
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push({ id: doc.id, ...doc.data() });
    });
    setUploadedGoods(productsArray);
  };

  useEffect(() => {
    fetchUploadedGoods();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      Alert.alert("Product deleted!");
      fetchUploadedGoods(); 
      refreshProducts(); 
    } catch (error) {
      Alert.alert("Error deleting product:", error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), {
        productName,
        company,
        techSpecs,
        condition,
        price,
      });
      Alert.alert("Product updated!");
      setEditingProduct(null);
      fetchUploadedGoods(); 
      refreshProducts(); 
    } catch (error) {
      Alert.alert("Error updating product:", error.message);
    }
  };

  const startEditing = (item) => {
    setEditingProduct(item);
    setProductName(item.productName);
    setCompany(item.company);
    setTechSpecs(item.techSpecs);
    setCondition(item.condition);
    setPrice(item.price);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploaded Goods</Text>
      {editingProduct ? (
        <View style={styles.editContainer}>
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
          <TextInput
            placeholder="Condition"
            value={condition}
            onChangeText={setCondition}
            style={styles.input}
          />
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            style={styles.input}
            keyboardType="numeric"
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update Product</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setEditingProduct(null)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={uploadedGoods}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {item.imageBase64 ? (
                <Image source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }} style={styles.productImage} />
              ) : (
                <Text style={styles.noPhoto}>No Photo</Text>
              )}
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.company}>{item.company}</Text>
              <Text style={styles.techSpecs}>{item.techSpecs}</Text>
              <Text style={styles.condition}>{item.condition}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => startEditing(item)}>
                  <Text style={styles.buttonText}>Update</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productCard: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  company: {
    marginTop: 4,
    color: '#888',
  },
  techSpecs: {
    marginTop: 4,
    color: '#888',
  },
  condition: {
    marginTop: 4,
    color: '#888',
  },
  productPrice: {
    marginTop: 8,
    fontSize: 14,
    color: '#888',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  button: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  noPhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
});

export default UploadedGoodsScreen;
