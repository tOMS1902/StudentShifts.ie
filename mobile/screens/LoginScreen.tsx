import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image, SafeAreaView, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { API_URL } from '../constants';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'student' | 'employer'>('student');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Save user data
            await AsyncStorage.setItem('ss:user', JSON.stringify(data));

            // Navigate to Home
            navigation.replace('Home');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Header Section */}
                        <View style={styles.header}>
                            <View style={styles.logoContainer}>
                                <MaterialIcons name="history" size={32} color="white" />
                            </View>
                            <Text style={styles.appTitle}>StudentShifts.ie</Text>
                            <Text style={styles.appSubtitle}>
                                Please login or create an account to view full job details and apply.
                            </Text>
                        </View>

                        {/* Content Card */}
                        <View style={styles.card}>

                            {/* Tab Switcher */}
                            <View style={styles.tabContainer}>
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'student' && styles.activeTab]}
                                    onPress={() => setActiveTab('student')}
                                >
                                    <Text style={[styles.tabText, activeTab === 'student' && styles.activeTabText]}>Student</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.tab, activeTab === 'employer' && styles.activeTab]}
                                    onPress={() => setActiveTab('employer')}
                                >
                                    <Text style={[styles.tabText, activeTab === 'employer' && styles.activeTabText]}>Employer</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Form */}
                            <View style={styles.form}>
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Email Address</Text>
                                    <View style={styles.inputWrapper}>
                                        <MaterialIcons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="student@university.ie"
                                            placeholderTextColor="#94a3b8"
                                            value={email}
                                            onChangeText={setEmail}
                                            autoCapitalize="none"
                                            keyboardType="email-address"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputGroup}>
                                    <View style={styles.passwordHeader}>
                                        <Text style={styles.label}>Password</Text>
                                        <TouchableOpacity>
                                            <Text style={styles.forgotText}>Forgot?</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.inputWrapper}>
                                        <MaterialIcons name="lock-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="••••••••"
                                            placeholderTextColor="#94a3b8"
                                            value={password}
                                            onChangeText={setPassword}
                                            secureTextEntry
                                        />
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.loginButton}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>Login</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Divider */}
                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>Or continue with</Text>
                            </View>

                            {/* Social Buttons */}
                            <View style={styles.socialContainer}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <FontAwesome name="google" size={20} color="#475569" />
                                    <Text style={styles.socialButtonText}>Google</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <FontAwesome name="apple" size={20} color="#475569" />
                                    <Text style={styles.socialButtonText}>Apple</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Sign Up Link */}
                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Don't have an account? </Text>
                                <TouchableOpacity>
                                    <Text style={styles.signUpText}>Sign up for free</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff', // Or #0F172A for dark mode if implemented later
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center', // Try to center content if possible
        paddingBottom: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 20,
        paddingHorizontal: 20,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#AD1E5B', // Primary Color
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        shadowColor: '#AD1E5B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
    },
    appSubtitle: {
        fontSize: 14,
        color: '#64748b',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    card: {
        width: '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32, // Mimicking the rounded card look
        paddingHorizontal: 24,
        paddingTop: 8,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        padding: 4,
        borderRadius: 12,
        marginBottom: 32,
    },
    tab: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    activeTabText: {
        color: '#0F172A',
    },
    form: {
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
        marginBottom: 6,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    inputIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#0F172A',
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    forgotText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#AD1E5B',
    },
    loginButton: {
        backgroundColor: '#AD1E5B',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#AD1E5B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 8,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#94a3b8',
        fontSize: 14,
    },
    socialContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingVertical: 12,
        borderRadius: 12,
    },
    socialButtonText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    footerText: {
        color: '#64748b',
        fontSize: 14,
    },
    signUpText: {
        color: '#AD1E5B',
        fontWeight: '700',
        fontSize: 14,
    },
});
