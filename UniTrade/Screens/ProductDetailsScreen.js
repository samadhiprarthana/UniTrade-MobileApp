import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ProductDetailsScreen({ route, navigation }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { productId } = route.params;

  useEffect(() => {
    loadProductDetails();
  }, [productId]);

  const loadProductDetails = async () => {
    try {
      setLoading(true);
      const productsData = await AsyncStorage.getItem('@products');
      if (productsData) {
        const allProducts = JSON.parse(productsData);
        const foundProduct = allProducts.find(p => p.id === productId);
        if (foundProduct) {
          setProduct(foundProduct);
          console.log('Product loaded:', foundProduct.title);
        }
      }
    } catch (error) {
      console.error('Error loading product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCallSeller = async () => {
    if (product?.sellerPhone) {
      try {
        const phoneUrl = `tel:${product.sellerPhone}`;
        await Linking.openURL(phoneUrl);
      } catch (error) {
        console.error('Error opening phone dial:', error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Product Image */}
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

      {/* Product Info Container */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.title}>{product.title}</Text>

        {/* Price */}
        <Text style={styles.price}>Rs. {product.price}</Text>

        {/* Condition and Category */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            <Text style={styles.badgeText}>{product.condition}</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="pricetag" size={16} color="#FF6B35" />
            <Text style={styles.badgeText}>{product.category}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {/* Seller Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seller Information</Text>
          <View style={styles.sellerInfo}>
            <Ionicons name="person-circle" size={40} color="#FF6B35" />
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{product.sellerName}</Text>
              <Text style={styles.sellerPhone}>{product.sellerPhone}</Text>
            </View>
          </View>
        </View>

        {/* Call Button */}
        <TouchableOpacity 
          style={styles.callButton}
          onPress={handleCallSeller}
        >
          <Ionicons name="call" size={20} color="#fff" />
          <Text style={styles.callButtonText}>Call Seller</Text>
        </TouchableOpacity>

        {/* Additional Info */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status:</Text>
            <Text style={styles.infoValue}>{product.status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Posted:</Text>
            <Text style={styles.infoValue}>{new Date(product.postedDate).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F0',
  },
  productImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  infoContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 12,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  badgeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  section: {
    marginTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5D9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFF5F0',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5D9',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sellerPhone: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  callButton: {
    backgroundColor: '#FF8C61',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
    borderRadius: 15,
    marginTop: 16,
    gap: 8,
    elevation: 3,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
  },
});
