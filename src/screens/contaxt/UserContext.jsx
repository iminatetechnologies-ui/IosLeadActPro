import React, {createContext, useState, useContext, useEffect, useRef} from 'react';
import {_get} from '../../api/apiClient';
import EncryptedStorage from 'react-native-encrypted-storage';

const UserContext = createContext();

export const UserProvider = ({children}) => {
  const [user, setUser] = useState({
    name: '',
    avatar: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    isMounted.current = true;
    abortControllerRef.current = new AbortController();
    
    const fetchUserFromAPI = async () => {
      try {
        // Token check karo
        const token = await EncryptedStorage.getItem('userToken');
        
        if (!token || !isMounted.current) {
          if (isMounted.current) {
            setIsLoggedIn(false);
            setUser({name: '', avatar: ''});
          }
          return;
        }

        setIsLoggedIn(true);
        
        const response = await _get('/user-profile', {
          headers: {Authorization: `Bearer ${token}`},
          signal: abortControllerRef.current?.signal,
        });

        const data = response?.data?.data;

        // Component unmount ho gaya to state update mat karo
        if (!isMounted.current) return;

        if (data?.name) {
          setUser({
            name: data.name,
            avatar: data.avatar || '',
          });
        } else {
          setUser({
            name: 'User',
            avatar: '',
          });
        }
      } catch (error) {
        // Abort error ko ignore karo
        if (error.name === 'AbortError') {
          console.log('API call aborted');
          return;
        }
        
        console.log('Error fetching user from API:', error);
        
        // Component still mounted hai to error state set karo
        if (isMounted.current) {
          setUser({
            name: 'Guest',
            avatar: '',
          });
          setIsLoggedIn(false);
        }
      }
    };

    fetchUserFromAPI();

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Safe setter function
  const updateUser = (userData) => {
    if (!isMounted.current) return;
    
    if (userData === null || userData === undefined) {
      setUser({name: '', avatar: ''});
      setIsLoggedIn(false);
    } else {
      setUser(userData);
    }
  };

  // Logout function
  const logout = () => {
    if (!isMounted.current) return;
    
    // Abort any pending API calls
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setUser({name: '', avatar: ''});
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{
      user, 
      setUser: updateUser, 
      logout,
      isLoggedIn
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};