
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen() {
    const navigation = useNavigation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: 'Hi! Are you available for the Saturday morning barista shift? We need someone from 7:30 AM to 1:00 PM.', time: '09:12 AM', isMe: false },
        { id: 2, text: "Yes, I'm available! I've worked that shift before. Should I wear the standard black apron?", time: '09:15 AM', isMe: true },
        { id: 3, text: 'Perfect! Yes, black apron and comfortable shoes. See you at 7:30 AM for the setup. ☕️', time: '09:18 AM', isMe: false },
    ]);

    const handleSend = () => {
        if (!message.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            text: message.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        }]);
        setMessage('');
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
                            <Text style={styles.headerTitle}>Proper Order Coffee Co.</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Online</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <TouchableOpacity style={styles.infoButton}>
                    <Text style={styles.infoIcon}>ℹ</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
                    <View style={styles.dateDivider}>
                        <Text style={styles.dateText}>TODAY</Text>
                    </View>

                    {messages.map(msg => (
                        <View key={msg.id} style={[styles.messageRow, msg.isMe ? styles.rowMe : styles.rowThem]}>
                            {!msg.isMe && <View style={styles.avatarSmall} />}

                            <View style={[styles.bubble, msg.isMe ? styles.bubbleMe : styles.bubbleThem]}>
                                <Text style={[styles.msgText, msg.isMe ? styles.textMe : styles.textThem]}>{msg.text}</Text>
                            </View>

                            {msg.isMe && <View style={styles.avatarSmallMe} />}
                            {/* Normally avatar only on left for them, right for me optionally */}
                        </View>
                    ))}
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
                        <TouchableOpacity style={styles.emojiButton}>
                            <Text style={styles.emojiIcon}>😊</Text>
                        </TouchableOpacity>
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
