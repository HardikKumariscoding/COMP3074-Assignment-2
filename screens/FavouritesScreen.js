import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const FavouritesScreen = ({ route, navigation }) => {
  const { favourites, setFavourites } = route.params;

  const removeFavourite = (product) => {
    setFavourites(favourites.filter(fav => fav.id !== product.id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Favourites</Text>
      <FlatList
        data={favourites}
        keyExtractor={(item, index) => index.toString()}
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
            <TouchableOpacity onPress={() => removeFavourite(item)}>
              <FontAwesome name="trash" size={24} color="red" />
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
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    padding: 30,
    elevation: 2,
    alignItems: "center",
  },
  productImage: {
    width: 140,
    height: 140,
    borderRadius: 5,
  },
  productName: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  company: {
    marginTop: 5,
    color: "gray",
  },
  techSpecs: {
    marginTop: 5,
    color: "gray",
  },
  condition: {
    marginTop: 5,
    color: "gray",
  },
  productPrice: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 20,
  },
  noPhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
});

export default FavouritesScreen;
