import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons'; 
import TechBarter from './screens/TechBarterApp';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import UserScreen from './screens/UserScreen';
import SellerScreen from './screens/SellerScreen';
import NewProductScreen from './screens/NewProductScreen'; 
import UsedProductScreen from './screens/UsedProductScreen'; 
import UploadedGoodsScreen from './screens/UploadedGoodsScreen'; 
import CartScreen from './screens/CartScreen'; 
import FavouritesScreen from './screens/FavouritesScreen'; 
import { auth } from './firebase';
import { useAuth } from './hooks/useAuth';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function TechBarterStack({ refreshProducts, cart, setCart }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TechBarter">
        {(props) => <TechBarter {...props} refreshProducts={refreshProducts} cart={cart} setCart={setCart} />}
      </Stack.Screen>
      <Stack.Screen name="NewProduct">
        {(props) => <NewProductScreen {...props} cart={cart} setCart={setCart} />}
      </Stack.Screen>
      <Stack.Screen name="UsedProduct">
        {(props) => <UsedProductScreen {...props} cart={cart} setCart={setCart} />}
      </Stack.Screen>
      <Stack.Screen name="Cart">
        {(props) => <CartScreen {...props} cart={cart} setCart={setCart} />}
      </Stack.Screen>
      <Stack.Screen name="Favourites" component={FavouritesScreen} />
    </Stack.Navigator>
  );
}

function AppTabs() {
  const { userType } = useAuth();
  const [refresh, setRefresh] = useState(false);
  const [cart, setCart] = useState([]);

  const refreshProducts = () => setRefresh(!refresh);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="TechBarter"
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="shopping-cart" color={color} size={size} />
          ),
        }}
      >
        {(props) => <TechBarterStack {...props} refreshProducts={refreshProducts} cart={cart} setCart={setCart} />}
      </Tab.Screen>
      <Tab.Screen
        name="User"
        component={UserScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" color={color} size={size} />
          ),
        }}
      />
      {userType === 'seller' && (
        <>
          <Tab.Screen
            name="Seller"
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="handshake-o" color={color} size={size} />
              ),
            }}
          >
            {(props) => <SellerScreen {...props} refreshProducts={refreshProducts} cart={cart} setCart={setCart} />}
          </Tab.Screen>
          <Tab.Screen
            name="UploadedGoods"
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="upload" color={color} size={size} />
              ),
            }}
          >
            {(props) => <UploadedGoodsScreen {...props} refreshProducts={refreshProducts} cart={cart} setCart={setCart} />}
          </Tab.Screen>
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
