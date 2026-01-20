
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function EmployerOnboardingScreen() {
    const navigation = useNavigation();
    const [formData, setFormData] = useState({
        companyName: '',
        industry: '',
        website: ''
    });

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.content}>
                    <Text style={styles.title}>Company Details</Text>
                    <Text style={styles.subtitle}>We need a few details to verify your business.</Text>

                    {/* Info Banner */}
                    <View style={styles.infoBanner}>
                        <Text style={styles.infoIcon}>🛡️</Text>
                        <Text style={styles.infoText}>
                            To ensure student safety, all employer accounts are manually reviewed. You can post shifts immediately, but they will be visible after approval (usually 2hrs).
                        </Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g. Proper Order Coffee Co."
                                value={formData.companyName}
                                onChangeText={t => setFormData({ ...formData, companyName: t })}
                                placeholderTextColor="#94a3b8"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Industry</Text>
                            <View style={styles.pickerContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Select Industry"
                                    value={formData.industry}
                                    onChangeText={t => setFormData({ ...formData, industry: t })}
                                    placeholderTextColor="#94a3b8"
                                />
                                <Text style={styles.pickerIcon}>▼</Text>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Website / Instagram</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="https://"
                                value={formData.website}
                                onChangeText={t => setFormData({ ...formData, website: t })}
                                placeholderTextColor="#94a3b8"
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>
                    </View>

                    <View style={{ flex: 1 }} />

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => navigation.navigate('EmployerDashboard' as never)}
                        >
                            <Text style={styles.primaryButtonText}>Continue</Text>
                            <Text style={styles.primaryButtonArrow}>→</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
        paddingTop: Platform.OS === 'android' ? 48 : 24,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 32,
    },
    infoBanner: {
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#fff7ed', // orange-50
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#fed7aa', // orange-200
        marginBottom: 32,
    },
    infoIcon: {
        fontSize: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 12,
        color: '#c2410c', // orange-700
        lineHeight: 18,
    },
    form: {
        gap: 20,
    },
    inputGroup: {},
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    input: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        fontSize: 14,
        color: '#0f172a',
    },
    pickerContainer: {
        position: 'relative',
    },
    pickerIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
        color: '#94a3b8',
    },
    footer: {
        marginBottom: 16,
    },
    primaryButton: {
        backgroundColor: '#0f172a',
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    primaryButtonArrow: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
