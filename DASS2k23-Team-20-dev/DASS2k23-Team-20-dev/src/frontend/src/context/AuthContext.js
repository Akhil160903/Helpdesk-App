import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/core';
import axios from 'axios';
import { BASE_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoadingAuth, setisLoadingAuth] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [spList, setSpList] = useState([]);

  const [loginSuccess, setLoginSuccess] = useState();

  const register = (email, password, fname, lname, number, orgId, userType) => {
    setisLoadingAuth(true);
    axios
      .post(`${BASE_URL}/user/register`, {
        Email: email,
        Password: password,
        FirstName: fname,
        LastName: lname,
        PhoneNumber: number,
        OrgId: orgId,
        UserType: userType,
      })
      .then(response => {
        console.log(response);
        alert('Registration successful');
      })
      .catch(error => {
        console.log(error);
        alert(error.response.data.message);
      });
    setisLoadingAuth(false);
  };

  const login = (email, password, orgId) => {
    setisLoadingAuth(true);
    console.log(email);
    console.log(password);
    console.log(orgId);
    axios
      .post(`${BASE_URL}/user/login`,
        {
          Email: email,
          Password: password,
          OrgId: orgId,
        }
      )
      .then(response => {
        console.log(response.data);
        setUserToken(response.data['access_token']);
        setUserType(response.data['UserType']);

        AsyncStorage.setItem('userToken', response.data['access_token']);
        AsyncStorage.setItem('userInfo', JSON.stringify(response.data));
        AsyncStorage.setItem('userType', response.data['UserType']);

        setLoginSuccess(true);
      })
      .catch(error => {
        console.log();
        alert(error.response.data.message)
        setLoginSuccess(false);
      });
    setisLoadingAuth(false);
  };

  const logout = () => {
    setisLoadingAuth(true);
    setUserToken(null);
    setUserType(null);
    AsyncStorage.removeItem('userToken');
    AsyncStorage.removeItem('userType');
    AsyncStorage.removeItem('userInfo');
    setisLoadingAuth(false);
  };

  const isLoggedIn = async () => {
    setisLoadingAuth(true);
    try {
      let userToken = await AsyncStorage.getItem('userToken');
      console.log(userToken);
      setUserToken(userToken);
      if (!userToken) {
        throw new Error('No user token');
      }

      let userType = await AsyncStorage.getItem('userType');
      console.log(userType);
      setUserType(userType);
      if (!userType) {
        throw new Error('No user type');
      }
    } catch (error) {
      console.log(error);
      setisLoadingAuth(false);
    }
    setisLoadingAuth(false);
  };

  const get_user_info = async (user_id) => {
    setisLoadingAuth(true);
    axios
      .get(`${BASE_URL}/user`, {
        id: user_id,
      })
      .then(response => {
        console.log(response.data);
        setisLoadingAuth(false);
      })
      .catch(error => {
        console.log(error.response.data.message);
        setisLoadingAuth(false);
      });
  };

  const getAllServiceProviders = async () => {
    try {
      let userInfo = await AsyncStorage.getItem('userInfo');
      userInfo = JSON.parse(userInfo);

      let userToken = await AsyncStorage.getItem('userToken');

      axios
        .put(`${BASE_URL}/sp/getall`, {
          OrgId: userInfo['OrgId'],
        },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        )
        .then(response => {
          setSpList(response.data);
        }
        )
        .catch(error => {
          console.log(error.message);
        }
        );
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        register,
        isLoadingAuth,
        loginSuccess,
        userToken,
        userType,
        get_user_info,
        getAllServiceProviders,
        spList,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
