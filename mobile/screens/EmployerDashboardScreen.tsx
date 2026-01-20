
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function EmployerDashboardScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
                <View style={styles.toggleContainer}>
                    <TouchableOpacity style={styles.toggleButton}>
                        <Text style={styles.toggleText}>Find</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.toggleButton, styles.toggleActive]}>
                        <Text style={[styles.toggleText, styles.toggleTextActive]}>Hire</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity>
                    <View style={styles.profileIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.statsGrid}>
                    {/* Stat Card 1 */}
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Total Views</Text>
                        <Text style={styles.statValue}>1,248</Text>
                        <View style={styles.trendRow}>
                            <Text style={styles.trendIcon}>↗</Text>
                            <Text style={styles.trendText}>+12% this week</Text>
                        </View>
                    </View>

                    {/* Stat Card 2 */}
                    <View style={styles.statCard}>
                        <Text style={styles.statLabel}>Applicants</Text>
                        <Text style={styles.statValue}>45</Text>
                        <View style={styles.trendRow}>
                            <Text style={styles.trendIcon}>↗</Text>
                            <Text style={styles.trendText}>5 new today</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.sectionHeaderLine}>
                    <Text style={styles.sectionTitle}>Active Postings</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('PostShift' as never)}>
                        <Text style={styles.actionLink}>+ Post New</Text>
                    </TouchableOpacity>
                </View>

                {/* Job Card 1 */}
                <View style={styles.jobCard}>
                    <View style={styles.jobHeader}>
                        <View>
                            <Text style={styles.jobTitle}>Weekend Barista</Text>
                            <Text style={styles.jobMeta}>Posted 2d ago · 12 Applicants</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.moreIcon}>•••</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.applicantPreviewRow}>
                        <View style={styles.avatarStack}>
                            <View style={[styles.avatar, { zIndex: 3, backgroundColor: '#cbd5e1' }]} />
                            <View style={[styles.avatar, { zIndex: 2, left: 16, backgroundColor: '#94a3b8' }]} />
                            <View style={[styles.avatar, { zIndex: 1, left: 32, backgroundColor: '#64748b' }]} />
                        </View>
                        <Text style={styles.newApplicantsText}>+3 new</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() => navigation.navigate('ManageShift', { shiftId: '1' } as never)}
                    >
                        <Text style={styles.reviewButtonText}>Review Applicants</Text>
                    </TouchableOpacity>
                </View>

                {/* Job Card 2 */}
                <View style={styles.jobCard}>
                    <View style={styles.jobHeader}>
                        <View>
                            <Text style={styles.jobTitle}>Retail Assistant</Text>
                            <Text style={styles.jobMeta}>Posted 5d ago · 8 Applicants</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.moreIcon}>•••</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.reviewButtonOutline}>
                        <Text style={styles.reviewButtonTextOutline}>Manage Shift</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#f1f5f9',
        borderRadius: 99,
        padding: 4,
    },
    toggleButton: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 99,
    },
    toggleActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    toggleTextActive: {
        color: '#0f172a',
    },
    profileIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#cbd5e1',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendIcon: {
        color: '#22c55e',
        fontSize: 12,
    },
    trendText: {
        fontSize: 12,
        color: '#22c55e',
        fontWeight: '500',
    },
    sectionHeaderLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    actionLink: {
        color: '#a91e5a',
        fontWeight: 'bold',
        fontSize: 14,
    },
    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    jobMeta: {
        fontSize: 12,
        color: '#64748b',
    },
    moreIcon: {
        color: '#94a3b8',
        fontSize: 20,
        fontWeight: 'bold',
    },
    applicantPreviewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        height: 32,
    },
    avatarStack: {
        width: 60,
        height: 32,
        position: 'relative',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#fff',
        position: 'absolute',
        top: 0,
    },
    newApplicantsText: {
        marginLeft: 36, // 32 + extra
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    reviewButton: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    reviewButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    reviewButtonOutline: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    reviewButtonTextOutline: {
        color: '#0f172a',
        fontWeight: '600',
        fontSize: 14,
    },
});
