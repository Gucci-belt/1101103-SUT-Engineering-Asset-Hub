import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export default function AssetCard({ asset, onBorrow }) {
  const isAvailable = asset.status === 'Available';

  return (
    <View className="flex-row bg-white rounded-xl border border-slate-200 p-3 mb-4 shadow-sm">
      {/* Image Placeholder */}
      <View className="w-20 h-20 bg-slate-100 rounded-lg mr-4 overflow-hidden">
        {asset.imageUrl ? (
          <Image source={{ uri: asset.imageUrl }} className="w-full h-full" resizeMode="cover" />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-slate-400 text-xs">No Image</Text>
          </View>
        )}
      </View>

      {/* Info Section */}
      <View className="flex-1 justify-between py-1">
        <View>
          <Text className="text-slate-800 font-semibold text-base mb-1" numberOfLines={1}>
            {asset.name}
          </Text>
          <Text className="text-slate-500 text-xs mb-2">
            {asset.category}
          </Text>
        </View>

        {/* Status Badge & Actions */}
        <View className="flex-row justify-between items-center">
          <View
            className={`px-2 py-1 rounded-md ${
              isAvailable ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                isAvailable ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {asset.status}
            </Text>
          </View>

          {isAvailable && (
            <TouchableOpacity onPress={onBorrow}>
              <Text className="text-orange-500 font-bold text-sm">Borrow</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
