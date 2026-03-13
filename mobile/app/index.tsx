import React, { useState } from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import CustomButton from '../components/CustomButton';

export default function LoginScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setIsLoading(false);
      router.push('/home'); // Navigate to Home Screen
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-orange-500" edges={['top']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          
          <View className="items-center mt-12 mb-8">
            <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-4 border border-white/30">
              <Text className="text-white text-4xl font-bold">IT</Text>
            </View>
            <View className="flex-row">
              <Text className="text-3xl font-bold text-white tracking-widest">SUT</Text>
              <Text className="text-3xl font-bold text-slate-900 tracking-widest">Assets</Text>
            </View>
            <Text className="text-white/80 text-sm mt-2 font-medium tracking-wider">ระบบจองและติดตามสถานะอุปกรณ์</Text>
          </View>

          <View className="bg-white flex-1 rounded-t-[40px] px-8 pt-10 pb-12 shadow-2xl mt-4">
            <Text className="text-2xl font-bold text-slate-800 mb-8 text-center">Welcome Back</Text>

            <View className="mb-5">
              <Text className="text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Student ID / Username</Text>
              <TextInput
                value={studentId}
                onChangeText={setStudentId}
                placeholder="B6xxxxxx"
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-800"
                autoCapitalize="none"
              />
            </View>

            <View className="mb-8">
              <Text className="text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 text-slate-800"
              />
            </View>

            <CustomButton 
              title="Login" 
              onPress={handleLogin} 
              isLoading={isLoading} 
              className="mb-8 shadow-lg shadow-orange-500/30"
            />

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-slate-500 text-sm">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="text-orange-600 font-bold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
