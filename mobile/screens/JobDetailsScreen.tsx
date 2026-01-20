
import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Platform, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { apiService } from '../services/api';
import { Job, RootStackParamList } from '../types';

const { width } = Dimensions.get('window');

type JobDetailsRouteProp = RouteProp<RootStackParamList, 'JobDetails'>;

export default function JobDetailsScreen() {
    const navigation = useNavigation();
    const route = useRoute<JobDetailsRouteProp>();
    const jobId = route.params?.jobId;

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);

    useEffect(() => {
        if (jobId) {
            loadJob();
        }
    }, [jobId]);

    const loadJob = async () => {
        try {
            const data = await apiService.getJob(jobId);
            setJob(data);
        } catch (error) {
            console.error('Failed to load job', error);
            Alert.alert('Error', 'Could not load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!jobId) return;
        setApplying(true);
        try {
            await apiService.applyToJob(jobId);
            Alert.alert('Success', 'Application submitted successfully!');
            navigation.goBack();
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#A31D5D" />
            </View>
        );
    }

    if (!job) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Job not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header / Nav */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Text style={styles.iconText}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.headerIconBg}>
                        <Text style={styles.headerIcon}>💼</Text>
                    </View>
                    <Text style={styles.headerTitle}>StudentShifts.ie</Text>
                </View>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.iconText}>🔗</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Top Section */}
                <View style={styles.sectionBorder}>
                    <View style={styles.topRow}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>LOGO</Text>
                        </View>
                        <View style={styles.salaryContainer}>
                            <Text style={styles.salaryText}>
                                {job.salaryMin && job.salaryMax
                                    ? `€${job.salaryMin}-${job.salaryMax}/hr`
                                    : 'Competitive Pay'}
                            </Text>
                            <Text style={styles.salarySubText}>WEEKLY PAY</Text>
                        </View>
                    </View>

                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.companyName}>{job.company}</Text>

                    <View style={styles.locationRow}>
                        <Text style={styles.locationIcon}>📍</Text>
                        <Text style={styles.locationText}>{job.location}</Text>
                    </View>

                    <View style={styles.tagsRow}>
                        <View style={[styles.tag, styles.tagPrimary]}>
                            <Text style={styles.tagTextPrimary}>{job.type || 'PART-TIME'}</Text>
                        </View>
                        {job.tags && job.tags.map((tag, index) => (
                            <View key={index} style={styles.tag}>
                                <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Upcoming Shifts - Placeholder or derived from Job if schema supports it */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Shifts</Text>
                    <View style={styles.shiftCard}>
                        <View>
                            <Text style={styles.shiftDate}>Flexible Schedule</Text>
                            <Text style={styles.shiftTime}>Contact for details</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Job Description</Text>
                    <Text style={styles.descriptionText}>{job.description}</Text>
                </View>

                {/* Location Map Placeholder */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Exact Location</Text>
                    <View style={styles.mapPlaceholder}>
                        {/* Background Image Placeholder */}
                        <View style={styles.mapOverlay}>
                            <View style={styles.pinContainer}>
                                <Text style={styles.pinIcon}>📍</Text>
                            </View>
                        </View>
                        <View style={styles.mapLabel}>
                            <Text style={styles.mapLabelText}>{job.location}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.section, { alignItems: 'center', paddingBottom: 100 }]}>
                    <Text style={styles.footerText}>Posted {new Date(job.postedAt || Date.now()).toLocaleDateString()} • Ref: #{job._id.slice(-6)}</Text>
                </View>
            </ScrollView>

            {/* Bottom Bar */}
            <View style={styles.bottomBar}>
                <View style={styles.bottomBarContent}>
                    <TouchableOpacity style={styles.bookmarkButton}>
                        <Text style={styles.bookmarkIcon}>🔖</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.applyButton, applying && { opacity: 0.7 }]}
                        onPress={handleApply}
                        disabled={applying}
                    >
                        <Text style={styles.applyButtonText}>{applying ? 'APPLYING...' : 'APPLY NOW'}</Text>
                        <Text style={styles.applyButtonArrow}>→</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: Platform.OS === 'android' ? 30 : 0,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    iconButton: {
        padding: 8,
    },
    iconText: {
        fontSize: 24,
        color: '#475569',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerIconBg: {
        backgroundColor: '#A31D5D',
        padding: 4,
        borderRadius: 8,
    },
    headerIcon: {
        fontSize: 14,
        color: '#fff',
    },
    headerTitle: {
        fontWeight: 'bold',
        fontSize: 18,
        color: '#1e293b',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionBorder: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        color: '#A31D5D',
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 4,
    },
    salaryContainer: {
        alignItems: 'flex-end',
    },
    salaryText: {
        color: '#A31D5D',
        fontSize: 20,
        fontWeight: 'bold',
    },
    salarySubText: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 4,
        fontWeight: '600',
    },
    jobTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        lineHeight: 30,
        marginBottom: 4,
    },
    companyName: {
        fontSize: 18,
        fontWeight: '500',
        color: '#475569',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
    },
    locationIcon: {
        fontSize: 14,
        marginRight: 4,
        color: '#64748b',
    },
    locationText: {
        fontSize: 14,
        color: '#64748b',
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 20,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: '#f1f5f9',
    },
    tagPrimary: {
        backgroundColor: 'rgba(163, 29, 93, 0.1)',
    },
    tagText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#475569',
    },
    tagTextPrimary: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#A31D5D',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 12,
    },
    shiftCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        marginBottom: 12,
    },
    shiftDate: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#0f172a',
    },
    shiftTime: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 2,
    },
    shiftHours: {
        fontSize: 14,
        fontWeight: '600',
        color: '#A31D5D',
    },
    descriptionText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    bulletList: {
        marginTop: 8,
    },
    bulletItem: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
        marginLeft: 8,
        marginBottom: 4,
    },
    mapPlaceholder: {
        height: 190,
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#cbd5e1', // Placeholder color
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinContainer: {
        backgroundColor: '#A31D5D',
        padding: 12,
        borderRadius: 999,
        elevation: 4,
    },
    pinIcon: {
        color: '#fff',
        fontSize: 20,
    },
    mapLabel: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    mapLabelText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0f172a',
    },
    footerText: {
        fontSize: 12,
        color: '#94a3b8',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 20,
    },
    bottomBarContent: {
        flexDirection: 'row',
        gap: 16,
        maxWidth: 450,
        alignSelf: 'center',
        width: '100%',
    },
    bookmarkButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookmarkIcon: {
        fontSize: 24,
        color: '#64748b',
    },
    applyButton: {
        flex: 1,
        backgroundColor: '#A31D5D',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 48,
        shadowColor: '#A31D5D',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    applyButtonText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
    },
    applyButtonArrow: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
