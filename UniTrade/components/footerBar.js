import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import Screens
import HomeScreen from '../Screens/HomeScreen';
import MyProductsScreen from '../Screens/MyProductsScreen';
import ProfileScreen from '../Screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomAddButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={styles.customButtonContainer}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.customButton}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function FooterBar() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#FFE5D9',
          paddingVertical: 8,
          paddingBottom: Platform.OS === 'android' ? 8 : 12,
          height: 60,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="AddProduct"
        component={MyProductsScreen}
        options={({ navigation }) => ({
          tabBarLabel: '',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add" size={28} color="#fff" />
          ),
          tabBarButton: (props) => (
            <CustomAddButton
              onPress={() => {
                // open the Add Product tab
                props.onPress();
              }}
            >
              <Ionicons name="add" size={28} color="#fff" />
            </CustomAddButton>
          ),
        })}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -28,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  customButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF8C61',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
});