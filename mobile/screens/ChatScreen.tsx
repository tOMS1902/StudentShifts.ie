import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { apiService } from '../services/api';
import { RootStackParamList, Message } from '../types';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;

export default function ChatScreen() {
    const navigation = useNavigation();
    const route = useRoute<ChatScreenRouteProp>();

    // Safety check - if no params, default to empty or handle error
    const jobId = route.params?.jobId;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (jobId) {
            loadMessages();
            // Optional: Poll every 5 seconds for new messages
            const interval = setInterval(loadMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [jobId]);

    const loadMessages = async () => {
        try {
            const data = await apiService.getMessages(jobId);
            // Map to UI format if needed, but our API returns isMe already
            setMessages(data.map(m => ({
                id: m._id,
                text: m.text,
                time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: m.isMe
            })));
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!message.trim() || !jobId) return;

        const textToSend = message.trim();
        setMessage(''); // Clear input immediately

        try {
            await apiService.sendMessage(jobId, textToSend);
            loadMessages(); // Refresh
        } catch (error) {
            console.error('Send failed', error);
            // Ideally show alert and restore text
            alert('Failed to send');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backIcon}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.profileContainer}>
                        <View style={styles.avatar} />
                        <View>
                            <Text style={styles.headerTitle}>Job Chat</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Online</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.infoButton} onPress={loadMessages}>
                    <Text style={styles.infoIcon}>↻</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView
                    style={styles.chatArea}
                    contentContainerStyle={styles.chatContent}
                    ref={ref => ref?.scrollToEnd({ animated: true })}
                >
                    <View style={styles.dateDivider}>
                        <Text style={styles.dateText}>TODAY</Text>
                    </View>

                    {messages.map((msg, index) => (
                        <View key={msg.id || index} style={[styles.messageRow, msg.isMe ? styles.rowMe : styles.rowThem]}>
                            {!msg.isMe && <View style={styles.avatarSmall} />}

                            <View style={[styles.bubble, msg.isMe ? styles.bubbleMe : styles.bubbleThem]}>
                                <Text style={[styles.msgText, msg.isMe ? styles.textMe : styles.textThem]}>{msg.text}</Text>
                            </View>
                        </View>
                    ))}
                    {messages.length === 0 && !loading && (
                        <Text style={{ textAlign: 'center', color: '#94a3b8', marginTop: 20 }}>No messages yet. Say hi!</Text>
                    )}
                </ScrollView>

                <View style={styles.inputArea}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Text style={styles.attachIcon}>📎</Text>
                    </TouchableOpacity>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={message}
                            onChangeText={setMessage}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendIcon}>➤</Text>
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
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        backgroundColor: 'rgba(255,255,255,0.9)',
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    backButton: {
        padding: 4,
    },
    backIcon: {
        fontSize: 32,
        color: '#a91e5a',
        marginTop: -4,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: '#cbd5e1',
    },
    headerTitle: {
        fontWeight: 'bold',
        color: '#0f172a',
        fontSize: 16,
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22c55e',
    },
    statusText: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: '500',
    },
    infoButton: {
        padding: 8,
    },
    infoIcon: {
        fontSize: 20,
        color: '#64748b',
    },
    chatArea: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    chatContent: {
        padding: 16,
        gap: 16,
        paddingBottom: 20
    },
    dateDivider: {
        alignItems: 'center',
        marginVertical: 8,
    },
    dateText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94a3b8',
        letterSpacing: 1,
    },
    messageRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
        maxWidth: '85%',
    },
    rowMe: {
        alignSelf: 'flex-end',
        justifyContent: 'flex-end',
    },
    rowThem: {
        alignSelf: 'flex-start',
    },
    avatarSmall: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: '#cbd5e1',
    },
    avatarSmallMe: {
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: '#a91e5a',
    },
    bubble: {
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    bubbleThem: {
        backgroundColor: '#fff',
        borderColor: '#f1f5f9',
        borderBottomLeftRadius: 4,
    },
    bubbleMe: {
        backgroundColor: '#a91e5a',
        borderColor: '#a91e5a',
        borderBottomRightRadius: 4,
    },
    msgText: {
        fontSize: 15,
        lineHeight: 22,
    },
    textThem: {
        color: '#0f172a',
    },
    textMe: {
        color: '#fff',
    },
    inputArea: {
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
    },
    attachButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 20,
    },
    attachIcon: {
        fontSize: 20,
    },
    inputWrapper: {
        flex: 1,
        position: 'relative',
    },
    input: {
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0f172a',
    },
    emojiButton: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
    emojiIcon: {
        fontSize: 20,
    },
    sendButton: {
        width: 44,
        height: 44,
        backgroundColor: '#a91e5a',
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendIcon: {
        color: '#fff',
        fontSize: 20,
    },
});
