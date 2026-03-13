import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CategoryBadge from '../components/CategoryBadge';
import AssetCard from '../components/AssetCard';

// Dummy Data for Preview
const CATEGORIES = ['All', 'IoT', 'Laptop', 'Network', 'Accessories'];

const MOCK_ASSETS = [
  { id: '1', name: 'MacBook Air M2', category: 'Laptop', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200&auto=format&fit=crop' },
  { id: '2', name: 'Arduino Uno R3', category: 'IoT', status: 'Borrowed', imageUrl: 'https://images.unsplash.com/photo-1608564697071-ddf911d81370?q=80&w=200&auto=format&fit=crop' },
  { id: '3', name: 'Keychron K2', category: 'Accessories', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop' },
  { id: '4', name: 'Raspberry Pi 4', category: 'IoT', status: 'Available', imageUrl: 'https://images.unsplash.com/photo-1631551694503-6cb28522e86b?q=80&w=200&auto=format&fit=crop' },
  { id: '5', name: 'iPad Pro 11"', category: 'Laptop', status: 'Borrowed', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=200&auto=format&fit=crop' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState('browse'); // browse vs history

  // Filter assets based on category
  const filteredAssets = activeCategory === 'All' 
    ? MOCK_ASSETS 
    : MOCK_ASSETS.filter(asset => asset.category === activeCategory);

  const handleBorrow = (assetName) => {
    // Navigate to the scanner screen when user clicks borrow
    router.push('/scanner');
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Hero Section */}
      <View className="bg-orange-50 pb-6 pt-16 px-6 border-b border-orange-100">
        <View className="flex-row justify-between items-start mb-6">
          <View>
             <Text className="text-2xl font-bold text-slate-900 tracking-tight leading-8">
               ระบบจองและติดตาม{'\n'}
               <Text className="text-orange-600">สถานะอุปกรณ์ห้องปฏิบัติการ</Text>
             </Text>
             <Text className="text-slate-600 font-medium text-xs mt-2">Computer Engineering Lab Asset Management</Text>
          </View>
          <TouchableOpacity 
            className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100"
            onPress={() => router.push('/profile')}
          >
            <Text className="text-orange-500 font-bold text-xl">S</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar matching the web style */}
        <View className="flex-row bg-white rounded-xl shadow-sm border border-slate-200 px-4 py-3 items-center mt-2">
            <Text className="text-slate-400 mr-2">🔍</Text>
            <TextInput 
              placeholder="Search..."
              className="flex-1 text-slate-800"
              placeholderTextColor="#94a3b8"
            />
        </View>
      </View>

      {/* Body: Categories (Horizontal Scroll) */}
      <View className="pt-6 pb-2 pl-6 bg-slate-50">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
             <TouchableOpacity
               key={cat}
               onPress={() => setActiveCategory(cat)}
               className={`px-5 py-2.5 rounded-xl mr-2 ${
                 activeCategory === cat ? 'bg-slate-900 shadow-md' : 'bg-white border border-slate-200'
               }`}
             >
               <Text
                 className={`font-semibold ${
                   activeCategory === cat ? 'text-white' : 'text-slate-600'
                 }`}
               >
                 {cat}
               </Text>
             </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Body: Asset List */}
      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <AssetCard 
            asset={item} 
            onBorrow={() => handleBorrow(item.name)} 
          />
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center py-10">
            <Text className="text-slate-500">No assets found in this category.</Text>
          </View>
        )}
      />
    </View>
  );
}
