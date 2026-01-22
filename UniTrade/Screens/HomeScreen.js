import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      console.log('=== Loading Home Screen Data ===');
      
      // Load current user
      const userData = await AsyncStorage.getItem('@currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        console.log('Current user:', user.name);
      }

      // Load products
      const productsData = await AsyncStorage.getItem('@products');
      if (productsData) {
        const allProducts = JSON.parse(productsData);
        setProducts(allProducts);
        console.log('Total products loaded:', allProducts.length);
      } else {
        // Initialize with sample products
        const sampleProducts = [
          {
            id: '1',
            title: 'Data Structures Textbook',
            price: 1500,
            category: 'Books',
            condition: 'Good',
            description: 'Computer Science textbook for 2nd year. Barely used, in excellent condition.',
            sellerId: 'sample1',
            sellerName: 'John Doe',
            sellerPhone: '0771234567',
            imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcTTlaLUSQ5RKHpdUGVWhMPihlQFw69Xm7Kg&s',
            status: 'available',
            postedDate: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'HP Laptop i5 8GB RAM',
            price: 45000,
            category: 'Electronics',
            condition: 'Like New',
            description: 'HP laptop with Intel i5 processor, 8GB RAM, 256GB SSD. Only 6 months old.',
            sellerId: 'sample2',
            sellerName: 'Jane Smith',
            sellerPhone: '0772345678',
            imageUrl: 'https://singhagiri.lk/product/hp-intel-core-i5-13th-gen-laptop-8gb-ram-512gb-ssd-156-fhd-win11-home-intel-uhd-ms-office2y-warranty-hppcl15fd0268tu-2?srsltid=AfmBOor2mXmoExA14yvxYkkXxpvTBeZIStydwpBquHQmBI2bYmgFASya',
            status: 'available',
            postedDate: new Date().toISOString(),
          },
          {
            id: '3',
            title: 'Study Table with Chair',
            price: 8000,
            category: 'Furniture',
            condition: 'Good',
            description: 'Wooden study table with comfortable chair. Perfect for students.',
            sellerId: 'sample1',
            sellerName: 'John Doe',
            sellerPhone: '0771234567',
            imageUrl: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=600&q=80',
            status: 'available',
            postedDate: new Date().toISOString(),
          },
        ];
        await AsyncStorage.setItem('@products', JSON.stringify(sampleProducts));
        setProducts(sampleProducts);
        console.log('Sample products initialized');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory && product.status === 'available';
  });

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        console.log('Viewing product:', item.title);
        navigation.getParent().navigate('ProductDetails', { productId: item.id });
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productPrice}>Rs. {item.price}</Text>
        <View style={styles.productFooter}>
          <Text style={styles.productCondition}>{item.condition}</Text>
          <Text style={styles.productCategory}>{item.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Category Filter */}
      <View style={styles.filterContainer}>
        <Ionicons name="filter" size={18} color="#FF6B35" style={styles.filterIcon} />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={setSelectedCategory}
            style={styles.picker}
          >
            <Picker.Item label="All Categories" value="All" />
            <Picker.Item label="Books" value="Books" />
            <Picker.Item label="Electronics" value="Electronics" />
            <Picker.Item label="Furniture" value="Furniture" />
            <Picker.Item label="Clothing" value="Clothing" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        renderItem={renderProduct}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
      />

      {/* Floating Action Button removed — using center tab button instead */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    borderRadius: 12,
    height: 50,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  filterIcon: {
    marginRight: 10,
  },
  pickerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  listContainer: {
    padding: 8,
    paddingBottom: 80,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    margin: 7,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
    height: 40,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 8,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCondition: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },
  productCategory: {
    fontSize: 12,
    color: '#4A6FA5',
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 15,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});