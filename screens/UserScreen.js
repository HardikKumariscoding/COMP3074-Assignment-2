import React, { useState, useEffect } from 'react';
import { View, Text, Image, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function UserScreen() {
  const [userDetails, setUserDetails] = useState({
    email: '',
    fullName: '',
    userType: '',
    photoURL: null,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        console.log('Fetching details for:', user.email);
        
        const userDoc = await getDoc(doc(db, 'users', user.email));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Fetched User Data: ", data);
          setUserDetails({
            email: user.email,
            fullName: user.displayName || 'No name available',
            userType: data.userType || 'No user type available',
            photoURL: data.photoURL || null,
          });
        } else {
          console.log('No user data found!');
        }
      } else {
        console.log('No user is currently signed in.');
      }
    };

    fetchUserDetails();
  }, []);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      } else {
        console.log('Media Library Permission Granted');
      }
    };
    requestPermissions();
  }, []);

  const handleSignOut = () => {
    auth.signOut();
  };

  const handleChoosePhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.5,
      });

      console.log('Image Picker Result:', result);

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        console.log('Image picked:', uri);
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const user = auth.currentUser;

        await setDoc(doc(db, 'users', user.email), { 
          photoURL: base64,
        }, { merge: true });

        setUserDetails((prevState) => ({
          ...prevState,
          photoURL: base64,
        }));
        Alert.alert("Photo Uploaded!");
      } else {
        console.log('Image Picker Cancelled');
      }
    } catch (error) {
      console.log('Error launching Image Picker:', error);
      Alert.alert("Error launching Image Picker: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {userDetails.photoURL ? (
          <Image source={{ uri: `data:image/jpeg;base64,${userDetails.photoURL}` }} style={styles.profileImage} />
        ) : (
          <Text style={styles.noProfilePhoto}>No Profile Photo</Text>
        )}
        <Text style={styles.fullName}>{userDetails.fullName}</Text>
        <Text style={styles.email}>{userDetails.email}</Text>
        <Text style={styles.userType}>{userDetails.userType}</Text>
        <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
          <Text style={styles.buttonText}>Upload Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    width: '90%',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  noProfilePhoto: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  fullName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 10,
  },
  userType: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

