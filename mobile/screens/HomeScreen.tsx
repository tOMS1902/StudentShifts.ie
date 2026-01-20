
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, SafeAreaView, Platform, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, Job } from '../types';
import { apiService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [filter, setFilter] = useState<'Nearby' | 'Remote'>('Nearby');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userName, setUserName] = useState('Friend');

    const loadData = async () => {
        try {
            // Get user name
            const userStr = await AsyncStorage.getItem('ss:user');
            if (userStr) {
                const user = JSON.parse(userStr);
                setUserName(user.firstName || 'Friend');
            }

            // Fetch jobs
            const fetchedJobs = await apiService.getJobs();
            console.log('MOBILE DEBUG - Fetched Jobs Count:', fetchedJobs.length);
            if (fetchedJobs.length > 0) {
                console.log('MOBILE DEBUG - Sample Job:', JSON.stringify(fetchedJobs[0], null, 2));
            } else {
                console.log('MOBILE DEBUG - No jobs found. Check API/Database.');
            }
            setJobs(fetchedJobs);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const renderJobCard = ({ item }: { item: Job }) => {
        // Generate a deterministic color based on company name
        const colors = ['#cbd5e1', '#e2e8f0', '#f1f5f9', '#94a3b8', '#d1d5db'];
        const colorIndex = (item.company?.length || 0) % colors.length;
        const logoColor = colors[colorIndex];

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('JobDetails', { jobId: item._id } as any)}
            >
                <View style={styles.cardHeader}>
                    <View style={[styles.logo, { backgroundColor: logoColor }]} />
                    <TouchableOpacity>
                        <Text style={styles.bookmarkIcon}>🔖</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.companyName} numberOfLines={1}>{item.company}</Text>

                <View style={styles.tagsContainer}>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.type}</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>{item.location}</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.salary}>€{item.salaryMin || '0'} - €{item.salaryMax || '0'}/hr</Text>
                    <Text style={styles.applyText}>Apply →</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello, {userName} 👋</Text>
                    <Text style={styles.subGreeting}>Your next shift is waiting.</Text>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('ProfileSetup' as never)}>
                    <View style={styles.profileAvatar} />
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search roles (e.g. Barista)..."
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                <TouchableOpacity style={styles.filterButton}>
                    <Text style={styles.filterIcon}>⚡</Text>
                </TouchableOpacity>
            </View>

            {/* Filters (Nearby / Remote) */}
            <View style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'Nearby' && styles.filterChipActive]}
                    onPress={() => setFilter('Nearby')}
                >
                    <Text style={[styles.filterText, filter === 'Nearby' && styles.filterTextActive]}>Nearby</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'Remote' && styles.filterChipActive]}
                    onPress={() => setFilter('Remote')}
                >
                    <Text style={[styles.filterText, filter === 'Remote' && styles.filterTextActive]}>Remote</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#a91e5a" />
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    renderItem={renderJobCard}
                    keyExtractor={item => item._id}
                    numColumns={2}
                    columnWrapperStyle={styles.columnWrapper}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#a91e5a" />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No shifts found matching your criteria.</Text>
                        </View>
                    }
                />
            )}

            {/* Floating Bottom Nav Placeholder - Real app would use Tab Navigator */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Text style={[styles.navIcon, { color: '#a91e5a' }]}>🏠</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Applications' as never)}>
                    <Text style={styles.navIcon}>📄</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileSetup' as never)}>
                    <Text style={styles.navIcon}>👤</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#64748b',
        fontSize: 16,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    subGreeting: {
        fontSize: 14,
        color: '#64748b',
    },
    profileAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#cbd5e1',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 48,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchIcon: {
        marginRight: 8,
        fontSize: 16,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#0f172a',
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#0f172a',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filterIcon: {
        color: '#fff',
        fontSize: 20,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },
    filterChip: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 99,
        backgroundColor: '#f1f5f9',
    },
    filterChipActive: {
        backgroundColor: '#a91e5a',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    bookmarkIcon: {
        fontSize: 18,
        color: '#94a3b8',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 12,
        color: '#64748b',
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
        marginBottom: 12,
    },
    tag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    tagText: {
        fontSize: 10,
        color: '#475569',
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    salary: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    applyText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#a91e5a',
    },
    bottomNav: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    navItem: {
        padding: 8,
    },
    navIcon: {
        fontSize: 24,
        color: '#94a3b8',
    },
});
