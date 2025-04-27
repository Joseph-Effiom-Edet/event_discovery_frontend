import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getCategories } from '../services/api';

/**
 * Category Filter Component
 * Horizontal scrollable list of category filters
 */
const CategoryFilter = ({ onCategoryChange, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleSelect = (categoryId) => {
    if (selectedCategory === categoryId) {
      // Deselect if already selected
      onCategoryChange(null);
    } else {
      onCategoryChange(categoryId);
    }
  };

  // If loading, show spinner
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#5C6BC0" />
      </View>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Categories</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* All categories option */}
        <TouchableOpacity
          style={[
            styles.categoryButton, 
            selectedCategory === null && styles.selectedCategory
          ]}
          onPress={() => handleSelect(null)}
        >
          <Feather 
            name="grid" 
            size={16} 
            color={selectedCategory === null ? 'white' : '#5C6BC0'} 
          />
          <Text 
            style={[
              styles.categoryText, 
              selectedCategory === null && styles.selectedCategoryText
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        {/* Category items */}
        {Array.isArray(categories) && categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton, 
              selectedCategory === category.id && styles.selectedCategory
            ]}
            onPress={() => handleSelect(category.id)}
          >
            {category.icon ? (
              <Text style={[
                styles.iconText, 
                { color: selectedCategory === category.id ? 'white' : '#5C6BC0' }
              ]}>
                {category.icon}
              </Text>
            ) : (
              <Feather 
                name="tag" 
                size={16} 
                color={selectedCategory === category.id ? 'white' : '#5C6BC0'} 
              />
            )}
            <Text 
              style={[
                styles.categoryText, 
                selectedCategory === category.id && styles.selectedCategoryText
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#424242',
  },
  scrollContent: {
    paddingRight: 15,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8eaf6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#5C6BC0',
  },
  categoryText: {
    color: '#5C6BC0',
    fontWeight: '500',
    marginLeft: 6,
  },
  selectedCategoryText: {
    color: 'white',
  },
  loadingContainer: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    padding: 8,
  },
  errorText: {
    color: '#e53935',
    fontSize: 14,
  },
  iconText: {
    fontSize: 16,
    marginRight: 6,
  },
});

export default CategoryFilter;
