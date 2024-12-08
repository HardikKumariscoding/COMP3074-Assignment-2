import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        console.log("User signed in: ", authUser.email);
        const userDocRef = doc(db, 'users', authUser.email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Fetched data: ", data);
          setUser(authUser);
          setUserType(data.userType || '');
        } else {
          console.log("No such document!");
          setUser(authUser);
          setUserType('');
        }
      } else {
        setUser(null);
        setUserType('');
      }
    });

    return unsubscribe;
  }, []);

  return { user, userType };
};
