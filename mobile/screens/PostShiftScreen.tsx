import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { apiService } from '../services/api';

export default function PostShiftScreen() {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Form State
    const [jobTitle, setJobTitle] = useState('');
    const [date, setDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [hourlyRate, setHourlyRate] = useState('');
    const [description, setDescription] = useState('');

    const renderSteps = () => (
        <View style={styles.stepContainer}>
            <View style={[styles.stepBar, step >= 1 && styles.stepBarActive]} />
            <View style={[styles.stepBar, step >= 2 && styles.stepBarActive]} />
            <View style={[styles.stepBar, step >= 3 && styles.stepBarActive]} />
        </View>
    );

    const handlePost = async () => {
        if (!jobTitle || !hourlyRate) {
            Alert.alert('Missing Info', 'Please provide at least a Title and Hourly Rate.');
            return;
        }

        setLoading(true);
        try {
            await apiService.createJob({
                title: jobTitle,
                company: 'My Company', // Hardcoded for now until we have employer profile persistence
                location: 'Dublin',
                salaryMin: Number(hourlyRate),
                salaryMax: Number(hourlyRate),
                description: description || 'No description provided.',
                type: 'Shift',
                tags: ['Part-Time']
            });
            Alert.alert('Success', 'Shift posted successfully!');
            navigation.navigate('EmployerDashboard' as never);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.message || 'Failed to post shift');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Post New Shift</Text>
                <View style={{ width: 50 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>
                    {renderSteps()}
                    <Text style={styles.stepLabel}>Step {step} of 3: {step === 1 ? 'Shift Basics' : step === 2 ? 'Requirements' : 'Review'}</Text>

                    {step === 1 && (
                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Role Title</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="e.g. Barista"
                                    value={jobTitle}
                                    onChangeText={setJobTitle}
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>

                            {/* Date & Time Row */}
                            <View style={styles.row}>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Date</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Oct 14"
                                        value={date}
                                        onChangeText={setDate}
                                        placeholderTextColor="#94a3b8"
                                    />
                                </View>
                                <View style={[styles.inputGroup, { flex: 1 }]}>
                                    <Text style={styles.label}>Start Time</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="08:00"
                                        value={startTime}
                                        onChangeText={setStartTime}
                                        placeholderTextColor="#94a3b8"
                                    />
                                </View>
                            </View>

                            <View style={[styles.inputGroup, { marginTop: 16 }]}>
                                <Text style={styles.label}>Hourly Rate (€)</Text>
                                <TextInput
                                    style={[styles.input, { fontSize: 18, fontWeight: 'bold' }]}
                                    placeholder="13.50"
                                    value={hourlyRate}
                                    onChangeText={setHourlyRate}
                                    keyboardType="numeric"
                                    placeholderTextColor="#94a3b8"
                                />
                                <Text style={styles.currencyPrefix}>€</Text>
                            </View>
                        </View>
                    )}

                    {step === 2 && (
                        <View style={styles.form}>
                            <Text style={styles.sectionHeader}>Who are you looking for?</Text>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Description</Text>
                                <TextInput
                                    style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                                    placeholder="Describe the role and duties..."
                                    value={description}
                                    onChangeText={setDescription}
                                    multiline
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                        </View>
                    )}

                    {step === 3 && (
                        <View style={styles.form}>
                            <Text style={styles.sectionHeader}>Review & Post</Text>
                            <View style={styles.reviewCard}>
                                <Text style={styles.reviewTitle}>{jobTitle || 'Barista'}</Text>
                                <Text style={styles.reviewRate}>€{hourlyRate || '0'}/hr</Text>
                                <View style={styles.divider} />
                                <Text style={styles.reviewDetail}>📅 {date || 'Date'} • {startTime || 'Time'}</Text>
                                <Text style={styles.reviewDetail}>📍 Dublin</Text>
                            </View>
                            <Text style={styles.feeText}>Platform Fee: €2.00</Text>
                        </View>
                    )}

                </ScrollView>

                <View style={styles.footer}>
                    {step > 1 && (
                        <TouchableOpacity style={styles.backBtn} onPress={() => setStep(step - 1)} disabled={loading}>
                            <Text style={styles.backBtnText}>Back</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.nextBtn, step === 1 && { flex: 1 }, loading && { opacity: 0.7 }]}
                        onPress={() => {
                            if (step < 3) setStep(step + 1);
                            else handlePost();
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.nextBtnText}>{step === 3 ? 'Post Shift' : 'Next'}</Text>
                        )}
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    backButton: {
        padding: 8,
    },
    backText: {
        fontSize: 16,
        color: '#64748b',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    content: {
        padding: 24,
    },
    stepContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 16,
    },
    stepBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
    },
    stepBarActive: {
        backgroundColor: '#0f172a',
    },
    stepLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 32,
        textTransform: 'uppercase',
    },
    form: {
        gap: 24,
    },
    row: {
        flexDirection: 'row',
        gap: 16,
    },
    inputGroup: {
        position: 'relative',
    },
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
        fontSize: 16,
        color: '#0f172a',
    },
    currencyPrefix: {
        position: 'absolute',
        left: 16,
        top: 42,
        fontSize: 18,
        color: '#94a3b8',
        opacity: 0, // Placeholder
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 16,
    },
    reviewCard: {
        padding: 24,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    reviewTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    reviewRate: {
        fontSize: 18,
        color: '#a91e5a',
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 16,
    },
    reviewDetail: {
        fontSize: 14,
        color: '#475569',
        marginBottom: 8,
    },
    feeText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 16,
    },
    footer: {
        flexDirection: 'row',
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        gap: 16,
    },
    backBtn: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
    },
    backBtnText: {
        fontWeight: '600',
        color: '#475569',
    },
    nextBtn: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#0f172a',
        alignItems: 'center',
    },
    nextBtnText: {
        fontWeight: 'bold',
        color: '#fff',
        fontSize: 16,
    },
});
