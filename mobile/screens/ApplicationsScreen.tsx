
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function ApplicationsScreen() {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState<'Applied' | 'Review' | 'Interviews'>('Applied');

    // Specific data for Design 5 components
    const stats = [
        { label: 'Applied', count: 12, active: true },
        { label: 'Review', count: 5, active: false },
        { label: 'Interviews', count: 3, active: false },
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Applications</Text>
                <TouchableOpacity>
                    <Text style={styles.headerIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Stats Tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContainer}>
                    {stats.map((stat, index) => (
                        <TouchableOpacity
                            key={stat.label}
                            style={[styles.tab, selectedTab === stat.label && styles.tabActive]}
                            onPress={() => setSelectedTab(stat.label as any)}
                        >
                            <Text style={[styles.tabCount, selectedTab === stat.label && styles.tabCountActive]}>{stat.count}</Text>
                            <Text style={[styles.tabLabel, selectedTab === stat.label && styles.tabLabelActive]}>{stat.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Content based on tab - Mocking "Applied" content from design */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Updates</Text>

                    {/* Card 1 - Interview */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.companyLogo}>
                                {/* Img placeholder */}
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.roleText}>Weekend Barista</Text>
                                <Text style={styles.companyText}>Proper Order Coffee Co.</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: '#dcfce7' }]}>
                                <Text style={[styles.statusText, { color: '#166534' }]}>Interview</Text>
                            </View>
                        </View>
                        <View style={styles.cardDivider} />
                        <View style={styles.cardFooter}>
                            <Text style={styles.footerInfo}>📅 Tomorrow, 2:00 PM</Text>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionButtonText}>View Details</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Card 2 - Review */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.companyLogo, { backgroundColor: '#e2e8f0' }]}>
                                {/* Img placeholder */}
                            </View>
                            <View style={styles.cardHeaderText}>
                                <Text style={styles.roleText}>Retail Assistant</Text>
                                <Text style={styles.companyText}>Zara</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: '#e0f2fe' }]}>
                                <Text style={[styles.statusText, { color: '#0369a1' }]}>In Review</Text>
                            </View>
                        </View>
                        <View style={styles.cardDivider} />
                        <View style={styles.cardFooter}>
                            <Text style={styles.footerInfo}>👀 Viewed 2h ago</Text>
                        </View>
                    </View>
                </View>

                {/* Boost Section */}
                <View style={styles.boostCard}>
                    <View style={styles.boostContent}>
                        <Text style={styles.boostTitle}>Boost your chances 🚀</Text>
                        <Text style={styles.boostText}>Complete your profile to appear at the top of employer searches.</Text>
                        <TouchableOpacity
                            style={styles.boostButton}
                            onPress={() => navigation.navigate('ProfileSetup' as never)}
                        >
                            <Text style={styles.boostButtonText}>Complete Profile</Text>
                        </TouchableOpacity>
                    </View>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    headerIcon: {
        fontSize: 24,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    tabsContainer: {
        padding: 20,
        gap: 12,
    },
    tab: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        minWidth: 100,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        alignItems: 'center',
    },
    tabActive: {
        backgroundColor: '#a91e5a',
        borderColor: '#a91e5a',
    },
    tabCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    tabCountActive: {
        color: '#fff',
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    tabLabelActive: {
        color: 'rgba(255,255,255,0.8)',
    },
    section: {
        padding: 20,
        gap: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: '#cbd5e1',
    },
    cardHeaderText: {
        flex: 1,
        justifyContent: 'center',
    },
    roleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    companyText: {
        fontSize: 14,
        color: '#64748b',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 99,
        height: 24,
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginBottom: 12,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerInfo: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#0f172a',
    },
    boostCard: {
        margin: 20,
        marginTop: 0,
        backgroundColor: '#1e293b',
        borderRadius: 20,
        padding: 24,
    },
    boostContent: {
        alignItems: 'flex-start',
    },
    boostTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    boostText: {
        fontSize: 14,
        color: '#cbd5e1',
        lineHeight: 22,
        marginBottom: 20,
    },
    boostButton: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    boostButtonText: {
        color: '#0f172a',
        fontWeight: 'bold',
        fontSize: 14,
    },
});
