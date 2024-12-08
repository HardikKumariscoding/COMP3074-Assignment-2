import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const TechBarterApp = ({ navigation, refreshProducts, cart, setCart }) => {
  const categories = ["New", "Used"];
  const [topPicks, setTopPicks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const productsArray = [];
    querySnapshot.forEach((doc) => {
      productsArray.push({ id: doc.id, ...doc.data() });
    });
    setTopPicks(productsArray);
    setFilteredProducts(productsArray); 
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshProducts]);

  useEffect(() => {
    const filtered = topPicks.filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, topPicks]);

  const addToCart = (product) => {
    setCart([...cart, { ...product, quantity: 1 }]);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <FontAwesome name="bars" size={24} color="black" />
        <Text style={styles.title}>TechBarter</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart', { cart, setCart })}>
          <FontAwesome name="shopping-cart" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBar}>
        <FontAwesome name="search" size={20} color="gray" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for products"
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
        <FontAwesome name="camera" size={20} color="gray" />
      </View>

      <View style={styles.categories}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <TouchableOpacity>
          <Text style={styles.exploreAll}>Explore all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.categoryList}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() =>
              navigation.navigate(category === "New" ? "NewProduct" : "UsedProduct")
            }
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.featuredItems}>
        <Text style={styles.featuredTitle}>Featured Items</Text>
        <Text style={styles.featuredSubtitle}>Discover our latest deals</Text>
        <TouchableOpacity>
          <Text style={styles.checkItOut}>Check it out :</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topPicks}>
        <Text style={styles.sectionTitle}>Top Picks</Text>
        <TouchableOpacity>
          <Text style={styles.exploreAll}>View all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <FlatList
      data={filteredProducts}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={renderHeader}
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
          <View style={styles.productIcons}>
            <FontAwesome name="heart-o" size={20} color="gray" />
            <TouchableOpacity onPress={() => addToCart(item)}>
              <FontAwesome name="shopping-cart" size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      numColumns={2} 
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginRight: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    padding: 5,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
  },
  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  exploreAll: {
    color: "blue",
  },
  categoryList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  categoryItem: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    elevation: 2,
    width: '40%',
  },
  categoryText: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuredItems: {
    padding: 10,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    elevation: 2,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  featuredSubtitle: {
    fontSize: 14,
    color: "gray",
  },
  checkItOut: {
    marginTop: 10,
    color: "blue",
  },
  topPicks: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 10,
    padding: 30, 
    elevation: 2,
    width: '45%', 
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
  productIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  noPhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
});

export default TechBarterApp;
