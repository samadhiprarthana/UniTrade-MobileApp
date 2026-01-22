import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    console.log('=== Login Attempt ===');
    console.log('Email:', email);
    console.log('Password:', password);

    if (!email.trim() || !password.trim()) {
      console.log('Validation failed: Empty fields');
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      console.log('Fetching users from AsyncStorage...');
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      console.log('Total users in storage:', users.length);

      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        console.log('Login successful for user:', user.name);
        await AsyncStorage.setItem('@currentUser', JSON.stringify(user));
        console.log('User saved to @currentUser');
        Alert.alert('Success', `Welcome back, ${user.name}!`);
        navigation.replace('Home');
      } else {
        console.log('Login failed: Invalid credentials');
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Login failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Orange/Blue curves */}
      <View style={styles.header}>
        <View style={styles.orangeCurve} />
        <View style={styles.blueCurve} />
        <Text style={styles.welcomeText}>Welcome Back</Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Login to your account</Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Register Link */}
        <View style={styles.registerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>
              Don't have an account? <Text style={styles.registerLinkBold}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  header: {
    height: '40%',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeCurve: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: '#FF8C61',
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    transform: [{ scaleX: 2.5 }],
  },
  blueCurve: {
    position: 'absolute',
    top: 60,
    right: -100,
    width: 250,
    height: 250,
    backgroundColor: '#4A6FA5',
    borderRadius: 125,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 10,
    marginTop: 60,
  },
  formCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: -50,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    paddingTop: 40,
  },
  formTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#FF8C61',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  registerLink: {
    fontSize: 15,
    color: '#666',
  },
  registerLinkBold: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
});