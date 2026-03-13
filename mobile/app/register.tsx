import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';

export default function RegisterScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = () => {
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Account created for ${name}! Please login.`);
      router.back(); // Go back to Login (index)
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, paddingTop: 40 }}>
          
          <View className="mb-8">
            <Text className="text-3xl font-extrabold text-slate-800 mb-2">Create Account</Text>
            <Text className="text-slate-500">Register to borrow IT assets.</Text>
          </View>

          <View className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mb-6">
            
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Student ID *</Text>
              <TextInput
                value={studentId}
                onChangeText={setStudentId}
                placeholder="e.g. B6700000"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Full Name *</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="e.g. Somchai Jaidee"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
              />
            </View>

            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Password *</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
              />
            </View>

            <View className="mb-8">
              <Text className="text-slate-700 font-semibold mb-2 ml-1">Confirm Password *</Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800"
              />
            </View>

            <CustomButton 
              title="Register" 
              onPress={handleRegister} 
              isLoading={isLoading} 
              className="mb-4"
            />

            <CustomButton 
              title="Already have an account? Sign In" 
              variant="outline" 
              onPress={() => router.back()} 
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
