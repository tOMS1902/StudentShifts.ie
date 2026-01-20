
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Platform, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ManageShiftScreen() {
    const navigation = useNavigation();

    // Mock applicant data from Design 7
    const applicants = [
        { id: 1, name: 'Cian Murphy', uni: 'Trinity College Dublin', year: '3rd Year', applied: 'Applied today', rating: 'Highly Rated', avatarColor: '#cbd5e1' },
        { id: 2, name: 'Sarah O\'Brien', uni: 'UCD', year: '2nd Year', applied: '1 day ago', rating: null, avatarColor: '#e2e8f0' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Weekend Barista</Text>
                <TouchableOpacity>
                    <Text style={styles.searchIcon}>🔍</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionHeader}>Applicants (12)</Text>

                {applicants.map(app => (
                    <TouchableOpacity
                        key={app.id}
                        style={styles.applicantCard}
                        onPress={() => navigation.navigate('PublicProfile', { studentId: app.id.toString() } as any)}
                    >
                        <View style={styles.cardHeader}>
                            <View style={[styles.avatar, { backgroundColor: app.avatarColor }]} />
                            <View style={styles.infoCol}>
                                <View style={styles.nameRow}>
                                    <Text style={styles.nameText}>{app.name}</Text>
                                    {app.rating && (
                                        <View style={styles.badge}>
                                            <Text style={styles.badgeText}>🔥 {app.rating}</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.uniText}>{app.uni} • {app.year}</Text>
                                <View style={styles.linkRow}>
                                    <Text style={styles.linkIcon}>📎</Text>
                                    <Text style={styles.linkText}>View CV</Text>
                                </View>
                            </View>
                            <Text style={styles.timeText}>{app.applied}</Text>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.msgButton}>
                                <Text style={styles.msgIcon}>💬</Text>
                                <Text style={styles.msgText}>Message</Text>
                            </TouchableOpacity>
                            <View style={styles.decisionGroup}>
                                <TouchableOpacity style={styles.rejectButton}>
                                    <Text style={styles.rejectIcon}>✕</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.acceptButton}>
                                    <Text style={styles.acceptIcon}>✓</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
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
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        fontSize: 24,
        color: '#0f172a',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    searchIcon: {
        fontSize: 20,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#64748b',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    applicantCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    infoCol: {
        flex: 1,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 2,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    badge: {
        backgroundColor: '#fdf4ff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#f0abfc',
    },
    badgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#d946ef',
    },
    uniText: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 4,
    },
    linkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    linkIcon: {
        fontSize: 12,
        color: '#a91e5a',
    },
    linkText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#a91e5a',
    },
    timeText: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '500',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    msgButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        height: 40,
    },
    msgIcon: {
        fontSize: 14,
    },
    msgText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    decisionGroup: {
        flexDirection: 'row',
        gap: 8,
    },
    rejectButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#fee2e2',
    },
    rejectIcon: {
        color: '#ef4444',
        fontWeight: 'bold',
    },
    acceptButton: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#f0fdf4',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#dcfce7',
    },
    acceptIcon: {
        color: '#166534',
        fontWeight: 'bold',
    },
});
