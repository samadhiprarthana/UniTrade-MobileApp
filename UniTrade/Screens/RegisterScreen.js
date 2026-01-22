import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    console.log('=== Registration Validation ===');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Password length:', password.length);
    console.log('Confirm Password length:', confirmPassword.length);

    // Clear previous error
    setErrorMessage('');

    if (!name.trim()) {
      console.log('❌ Validation failed: Name is empty');
      setErrorMessage('Please enter your name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      console.log('❌ Validation failed: Invalid email');
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      console.log('❌ Validation failed: Invalid phone number');
      setErrorMessage('Please enter a valid phone number (min 10 digits)');
      return false;
    }
    if (!password.trim() || password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      setErrorMessage('Password must be at least 6 characters');
      return false;
    }
    if (!confirmPassword.trim()) {
      console.log('❌ Validation failed: Confirm password is empty');
      setErrorMessage('Please confirm your password');
      return false;
    }
    if (password !== confirmPassword) {
      console.log('❌ Validation failed: Passwords do not match');
      setErrorMessage('Passwords do not match');
      return false;
    }

    console.log('✓ Validation passed');
    return true;
  };

  const handleRegister = async () => {
    console.log('=== Registration Attempt ===');
    
    if (!validateForm()) return;

    try {
      console.log('Fetching existing users from AsyncStorage...');
      const usersData = await AsyncStorage.getItem('@users');
      const users = usersData ? JSON.parse(usersData) : [];
      console.log('Existing users count:', users.length);

      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        console.log('❌ Registration failed: Email already exists');
        setErrorMessage('This email is already registered. Please login or use a different email.');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        phone,
        password,
        createdAt: new Date().toISOString(),
      };

      console.log('✓ Creating new user:', newUser);
      users.push(newUser);
      
      await AsyncStorage.setItem('@users', JSON.stringify(users));
      console.log('✓ User saved to AsyncStorage successfully');
      console.log('✓ Account created for:', email);
      
      // Clear form
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      setErrorMessage('');
      
      // Show success modal
      setShowSuccessModal(true);

      // Auto-navigate after 2 seconds
      setTimeout(() => {
        console.log('→ Navigating to Login screen...');
        setShowSuccessModal(false);
        navigation.navigate('Login');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('Registration failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Orange/Blue curves */}
      <View style={styles.header}>
        <View style={styles.orangeCurve} />
        <View style={styles.blueCurve} />
        <Text style={styles.welcomeText}>Create Account</Text>
      </View>

      {/* Form Card */}
      <ScrollView style={styles.formCard} showsVerticalScrollIndicator={false}>
        <Text style={styles.formTitle}>Join UniTrade community</Text>

        {/* Error Message Display */}
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#dc3545" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setErrorMessage(''); // Clear error when typing
            }}
          />
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrorMessage('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Phone Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#999"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              setErrorMessage('');
            }}
            keyboardType="phone-pad"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password (min 6 characters)"
            placeholderTextColor="#999"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorMessage('');
            }}
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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#FF6B35" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setErrorMessage('');
            }}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons 
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
              size={20} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Sign Up</Text>
          <View style={styles.arrowCircle}>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Login Link */}
        <TouchableOpacity 
          style={styles.loginContainer}
          onPress={() => {
            console.log('Navigating to Login screen...');
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.loginLink}>
            Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Success Modal */}
      <Modal
        transparent={true}
        visible={showSuccessModal}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color="#28a745" />
            </View>
            <Text style={styles.successTitle}>Account Created!</Text>
            <Text style={styles.successMessage}>
              Registration successful.{'\n'}
              Redirecting to login...
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  header: {
    height: '32%',
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
    top: 40,
    left: -80,
    width: 220,
    height: 220,
    backgroundColor: '#4A6FA5',
    borderRadius: 110,
  },
  welcomeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 10,
    marginTop: 40,
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
    marginBottom: 20,
    textAlign: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#dc3545',
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 14,
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
  registerButton: {
    backgroundColor: '#4A6FA5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingHorizontal: 25,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5B7FA8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    marginTop: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  loginLink: {
    fontSize: 15,
    color: '#666',
  },
  loginLinkBold: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    width: '80%',
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});