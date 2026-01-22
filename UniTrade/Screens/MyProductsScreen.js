import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function MyProductsScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Books');
  const [condition, setCondition] = useState('Good');
  const [imageUrl, setImageUrl] = useState('');

  const handleAddProduct = async () => {
    // Validation
    if (!title.trim() || !price.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    try {
      setLoading(true);

      // Get current user
      const userData = await AsyncStorage.getItem('@currentUser');
      if (!userData) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      const currentUser = JSON.parse(userData);

      // Generate new product ID
      const newProductId = Date.now().toString();

      // helper: fallback placeholder by category
      const placeholderForCategory = (cat) => {
        switch (cat) {
          case 'Books':
            return 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80';
          case 'Electronics':
            return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80';
          case 'Furniture':
            return 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=600&q=80';
          case 'Clothing':
            return 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80';
          case 'Accessories':
            return 'https://images.unsplash.com/photo-1520975911518-9a5f9a02f6d6?auto=format&fit=crop&w=600&q=80';
          default:
            return 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80';
        }
      };

      // Create new product object
      const newProduct = {
        id: newProductId,
        title: title.trim(),
        price: parseFloat(price),
        category,
        condition,
        description: description.trim(),
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerPhone: currentUser.phone,
        imageUrl: imageUrl && imageUrl.trim().length > 5 ? imageUrl.trim() : placeholderForCategory(category),
        status: 'available',
        postedDate: new Date().toISOString(),
      };

      // Get existing products
      const productsData = await AsyncStorage.getItem('@products');
      const allProducts = productsData ? JSON.parse(productsData) : [];

      // Add new product
      allProducts.push(newProduct);
      await AsyncStorage.setItem('@products', JSON.stringify(allProducts));

      // Clear form
      setTitle('');
      setPrice('');
      setDescription('');
      setImageUrl('');
      setCategory('Books');
      setCondition('Good');

      Alert.alert('Success', 'Product added successfully!', [
        { text: 'OK', onPress: () => navigation.getParent().navigate('Home') },
      ]);
      console.log('Product created:', newProduct.title);
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.formContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.formTitle}>Sell Your Product</Text>
        </View>

        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Title *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="tag" size={18} color="#FF6B35" />
            <TextInput
              style={styles.input}
              placeholder="e.g., HP Laptop i5 8GB RAM"
              placeholderTextColor="#999"
              value={title}
              onChangeText={setTitle}
            />
          </View>
        </View>

        {/* Price Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (Rs.) *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash" size={18} color="#FF6B35" />
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              placeholderTextColor="#999"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Image URL Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL (optional)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="image" size={18} color="#FF6B35" />
            <TextInput
              style={styles.input}
              placeholder="https://example.com/image.jpg"
              placeholderTextColor="#999"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
          </View>
        </View>

        {/* Category Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.pickerWrapper}>
            <Ionicons name="layers" size={18} color="#FF6B35" style={styles.pickerIcon} />
            <Picker
              selectedValue={category}
              onValueChange={setCategory}
              style={styles.picker}
            >
              <Picker.Item label="Books" value="Books" />
              <Picker.Item label="Electronics" value="Electronics" />
              <Picker.Item label="Furniture" value="Furniture" />
              <Picker.Item label="Clothing" value="Clothing" />
              <Picker.Item label="Accessories" value="Accessories" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </View>

        {/* Condition Picker */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Condition *</Text>
          <View style={styles.pickerWrapper}>
            <Ionicons name="checkmark-circle" size={18} color="#FF6B35" style={styles.pickerIcon} />
            <Picker
              selectedValue={condition}
              onValueChange={setCondition}
              style={styles.picker}
            >
              <Picker.Item label="Like New" value="Like New" />
              <Picker.Item label="Good" value="Good" />
              <Picker.Item label="Fair" value="Fair" />
              <Picker.Item label="Poor" value="Poor" />
            </Picker>
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Describe your product in detail..."
            placeholderTextColor="#999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleAddProduct}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={styles.submitButtonText}>Publish Product</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 12,
  },
  formTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FFE5D9',
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    marginLeft: 10,
  },
  descriptionInput: {
    height: 120,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#FFF5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5D9',
    paddingLeft: 12,
    overflow: 'hidden',
  },
  pickerIcon: {
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 48,
  },
  submitButton: {
    backgroundColor: '#FF8C61',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    gap: 8,
    elevation: 3,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
