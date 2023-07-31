/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import SplashScreen from 'react-native-splash-screen'
import type {PropsWithChildren} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Image
} from 'react-native';
import 'react-native-gesture-handler';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import {
  NavigationContainer,
  DefaultTheme as DefaultThemeNav,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import CreateAdScreen from './src/screens/CreateAdScreen';
import ListItemScreen from './src/screens/ListItemScreen';
import AccountScreen from './src/screens/AccountScreen';
import Feather from 'react-native-vector-icons/Feather';
import Maticons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';
import { FirebaseNotificationInit } from './src/component/FirebaseNotification';
import {Platform, PermissionsAndroid} from 'react-native';
import Takepicture from './src/screens/takepicture';
import Ads from './src/screens/Ads';
function App() {
  useEffect(() => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    try {
      // Get the device token
      messaging()
      .getToken()
      .then(token => {
        // Save data to API/DB
        //firebaseService.saveUserFireBaseTokenToDatabase(token);
        console.log("ss",token)
      });
      messaging().onMessage(remoteMessage => {
        Alert.alert(JSON.stringify(remoteMessage.notification?.title),remoteMessage.notification?.body);
      });
      SplashScreen.hide();
    }
      catch (error) {
        console.log('Firebase loading error: ', error);
      }
        
    // FirebaseNotificationInit();
  }, []);
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: '#fc5c65',
    },
  };
  const MyTheme = {
    ...DefaultThemeNav,
    colors: {
      ...DefaultThemeNav.colors,
      background: 'white',
    },
  };

  // const [iconName,setIconName]= useState('home');
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const AuthNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup"
          component={SignupScreen}
          options={{headerShown: false}}
        />
       
      </Stack.Navigator>
    );
  };
  const AddNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
         name="create"
         component={CreateAdScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TakePicture"
          component={Takepicture}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Ads"
          component={Ads}
          options={{headerShown: false}}
        />
       
      </Stack.Navigator>
    );
  };
  const AccountNavigator = () => {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="account"
          component={AccountScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Ads"
          component={Ads}
          options={{headerShown: false}}
        />
       
      </Stack.Navigator>
    );
  };
  
  const MyHeader = () => {
    return (
      <View
        style={{
          // padding: 8,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f4f4',
          height:80,


        }}>
        <Image
          source={require('./src/assets/header.png')}
          // resizeMode="contain"
          style={{width: 250, height: 80,}}
        />
        
      </View>
    );
  };
  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          header: (props: any) => {
            return <MyHeader  />;
          },
          tabBarActiveTintColor: '#fc5c65',
          tabBarInactiveTintColor: 'gray',
        }}>
        
        <Tab.Screen name="Home" component={ListItemScreen}  
        options={{
          tabBarIcon: tabinfo => {
            return (
              <View style={{borderWidth:5,borderColor:"white",borderRadius:30}}>

              <Feather
                name="home"
                size={24}
                color={tabinfo.focused ? '#4ecdc4' : '#8e8e93'}
                />
                </View>
            );
          },
          tabBarActiveTintColor: '#fc5c65',
          tabBarInactiveTintColor: 'gray',
          title:''
        }} />
        <Tab.Screen
          name="add"
          component={AddNavigator}
          options={{
            tabBarIcon: tabinfo => {
              return (
                <View style={{borderWidth:5,borderColor:"white",borderRadius:30}}>

                <Feather
                  name="plus-circle"
                  size={24}
                  color={tabinfo.focused ? '#4ecdc4' : '#8e8e93'}
                  />
                  </View>
              );
            },
            tabBarActiveTintColor: '#fc5c65',
          tabBarInactiveTintColor: 'gray',
            title:''}}
        />
        <Tab.Screen
          name="AccountNavigator"
          component={AccountNavigator}
          options={{
            tabBarIcon: tabinfo => {
              return (
                <View style={{borderWidth:5,borderColor:"white",borderRadius:30}}>

                <Feather
                  name="user"
                  size={24}
                  color={tabinfo.focused ? '#4ecdc4' : '#8e8e93'}
                  />
                  </View>
              );
            },
            tabBarActiveTintColor: '#fc5c65',
          tabBarInactiveTintColor: 'gray',
            title:''}}
        />
      </Tab.Navigator>
    );
  };

  const Navigation = () => {
    const [user, setUser] = useState('');
    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged((userExist: any) => {
        if (userExist) {
          setUser(userExist);

          //  userExist.getIdToken().then(jwt=>{

          //  })
        } else {
          setUser('');
        }
      });
      return unsubscribe;
    }, []);
    return (
      <NavigationContainer theme={MyTheme}>
        {user ? <TabNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    );
  };

  return (
    <>
      <PaperProvider theme={theme}>
        <StatusBar barStyle="dark-content" backgroundColor="#fc5c65" />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  },
});

export default App;
