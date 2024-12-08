import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const UsedProductScreen = ({ cart, setCart }) => {
  const [usedProducts, setUsedProducts] = useState([]);

  useEffect(() => {
    const fetchUsedProducts = async () => {
      const q = query(collection(db, 'products'), where('condition', '==', 'used'));
      const querySnapshot = await getDocs(q);
      const productsArray = [];
      querySnapshot.forEach((doc) => {
        productsArray.push({ id: doc.id, ...doc.data() });
      });
      setUsedProducts(productsArray);
    };

    fetchUsedProducts();
  }, []);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Used Products</Text>
      <FlatList
        data={usedProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            {item.imageBase64 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }} style={styles.productImage} />
            ) : (
              <Text style={styles.noPhoto}>No Photo</Text>
            )}
            <Text style={styles.productName}>{item.productName}</Text>
            <Text style={styles.productPrice}>${item.price}</Text>
            <View style={styles.productIcons}>
              <TouchableOpacity onPress={() => addToCart(item)}>
                <FontAwesome name="shopping-cart" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        numColumns={2}
      />
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
  productPrice: {
    marginTop: 4,
    fontSize: 14,
    color: '#888',
  },
  noPhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  productIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
});

export default UsedProductScreen;
