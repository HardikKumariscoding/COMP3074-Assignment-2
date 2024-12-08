import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const CartScreen = ({ cart, setCart }) => {
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const changeQuantity = (productId, quantity) => {
    setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            {item.imageBase64 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${item.imageBase64}` }} style={styles.productImage} />
            ) : (
              <Text style={styles.noPhoto}>No Photo</Text>
            )}
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.productName}</Text>
              <Text style={styles.productPrice}>${item.price}</Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => changeQuantity(item.id, item.quantity - 1)}>
                  <FontAwesome name="minus" size={20} color="gray" />
                </TouchableOpacity>
                <Text style={styles.productQuantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => changeQuantity(item.id, item.quantity + 1)}>
                  <FontAwesome name="plus" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <FontAwesome name="trash" size={20} color="red" />
            </TouchableOpacity>
          </View>
        )}
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
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  productQuantity: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 8,
  },
  noPhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
});

export default CartScreen;
