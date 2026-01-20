
import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function PublicProfileScreen() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Text style={styles.iconText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Student Profile</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Text style={styles.iconText}>🔗</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Profile Header */}
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar} />
                            {/* Image would go here */}
                            <View style={styles.verifiedBadge}>
                                <Text style={styles.verifiedText}>VERIFIED</Text>
                            </View>
                        </View>

                        <View style={styles.nameSection}>
                            <Text style={styles.nameText}>Cian Murphy</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>🎓</Text>
                                <Text style={styles.infoText}>Trinity College Dublin (TCD)</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoIcon}>📍</Text>
                                <Text style={styles.infoText}>Dublin, Ireland</Text>
                            </View>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>4.9</Text>
                            <Text style={styles.statLabel}>RATING</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>SHIFTS</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>100%</Text>
                            <Text style={styles.statLabel}>RELIABILITY</Text>
                        </View>
                    </View>

                    {/* About */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <Text style={styles.bodyText}>
                            Final year Computer Science student at TCD looking for flexible weekend hospitality or retail shifts.
                            I have 2+ years of experience in high-volume customer service roles. Hardworking, reliable, and available immediately.
                        </Text>
                    </View>

                    {/* Experience */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        <View style={styles.timelineContainer}>
                            <View style={styles.timelineLine} />

                            {/* Item 1 */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineDotActive}>
                                    <View style={styles.dotInner} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <View style={styles.timelineHeader}>
                                        <Text style={styles.roleTitle}>Waitstaff</Text>
                                        <View style={styles.presentTag}>
                                            <Text style={styles.presentText}>Present</Text>
                                        </View>
                                    </View>
                                    <Text style={styles.companyText}>The Ivy, Dawson Street</Text>
                                    <Text style={styles.dateText}>Sep 2022 - Current</Text>
                                    <Text style={styles.descriptionText}>
                                        Managing high-end table service for lunch and dinner shifts. Expert in POS systems and wine pairing.
                                    </Text>
                                </View>
                            </View>

                            {/* Item 2 */}
                            <View style={styles.timelineItem}>
                                <View style={styles.timelineDot}>
                                    <View style={styles.dotInner} />
                                </View>
                                <View style={styles.timelineContent}>
                                    <View style={styles.timelineHeader}>
                                        <Text style={styles.roleTitle}>Retail Assistant</Text>
                                    </View>
                                    <Text style={styles.companyText}>Zara, Grafton Street</Text>
                                    <Text style={styles.dateText}>May 2021 - Aug 2022</Text>
                                    <Text style={styles.descriptionText}>
                                        Assisted customers in a fast-paced environment. Responsible for inventory management and cash handling.
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Skills */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <View style={styles.skillsContainer}>
                            {['Customer Service', 'Barista', 'Team Leadership', 'Cash Handling', 'English (Native)', 'Problem Solving'].map(skill => (
                                <View key={skill} style={styles.skillTag}>
                                    <Text style={styles.skillText}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>

                {/* Floating Action Buttons */}
                <View style={styles.fabContainer}>
                    <TouchableOpacity
                        style={styles.messageButton}
                        onPress={() => navigation.navigate('Chat', { conversationId: 'new' } as any)}
                    >
                        <Text style={styles.messageIcon}>💬</Text>
                        <Text style={styles.messageText}>Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.hireButton}>
                        <Text style={styles.hireIcon}>⚡</Text>
                        <Text style={styles.hireText}>Hire Now</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    safeArea: {
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
    iconButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 20,
    },
    iconText: {
        fontSize: 20,
        color: '#0f172a',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    profileHeader: {
        alignItems: 'center',
        padding: 24,
        gap: 16,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#cbd5e1',
        borderWidth: 4,
        borderColor: '#fff',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#a91e5a',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 99,
        borderWidth: 2,
        borderColor: '#fff',
    },
    verifiedText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    nameSection: {
        alignItems: 'center',
    },
    nameText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    infoIcon: {
        fontSize: 14,
    },
    infoText: {
        fontSize: 14,
        color: '#a91e5a', // Primary color for Uni
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginHorizontal: 16,
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#a91e5a',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#64748b',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#e2e8f0',
    },
    section: {
        padding: 24,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    bodyText: {
        fontSize: 15,
        color: '#334155',
        lineHeight: 24,
    },
    timelineContainer: {
        position: 'relative',
        marginTop: 16,
    },
    timelineLine: {
        position: 'absolute',
        left: 24,
        top: 0,
        bottom: 0,
        width: 2,
        backgroundColor: '#e2e8f0',
    },
    timelineItem: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    timelineDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#cbd5e1',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        borderWidth: 4,
        borderColor: '#fff',
        zIndex: 1,
    },
    timelineDotActive: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#a91e5a',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 15,
        borderWidth: 4,
        borderColor: '#fff',
        zIndex: 1,
    },
    dotInner: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#fff',
    },
    timelineContent: {
        flex: 1,
    },
    timelineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    roleTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    presentTag: {
        backgroundColor: 'rgba(169, 30, 90, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    presentText: {
        color: '#a91e5a',
        fontSize: 10,
        fontWeight: 'bold',
    },
    companyText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
    },
    dateText: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    descriptionText: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    skillText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#334155',
    },
    fabContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        flexDirection: 'row',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    messageButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#a91e5a',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    messageIcon: {
        fontSize: 20,
    },
    messageText: {
        color: '#a91e5a',
        fontWeight: 'bold',
        fontSize: 16,
    },
    hireButton: {
        flex: 1.5,
        height: 56,
        backgroundColor: '#a91e5a',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#a91e5a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    hireIcon: {
        fontSize: 20,
        color: '#fff',
    },
    hireText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
