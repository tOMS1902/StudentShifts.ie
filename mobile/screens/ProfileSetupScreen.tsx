
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, SafeAreaView, Dimensions, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Mock Dropdown for Uni
const UNIVERSITIES = [
    'Trinity College Dublin (TCD)',
    'University College Dublin (UCD)',
    'Dublin City University (DCU)',
    'TU Dublin',
    'University College Cork (UCC)',
    'University of Galway'
];

export default function ProfileSetupScreen() {
    const navigation = useNavigation();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '',
        university: '',
        dob: '',
        experience: '',
        bio: '',
        skills: ['Customer Service', 'Hospitality']
    });
    const [newSkill, setNewSkill] = useState('');

    const progress = step === 1 ? '33%' : step === 2 ? '66%' : '100%';

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
    };

    const renderStep1 = () => (
        <View style={styles.formContainer}>
            <View style={styles.headerSpacer} />
            <Text style={styles.sectionHeader}>Basic Information</Text>
            <Text style={styles.sectionSubHeader}>Let employers know who you are.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g. Seán O'Connor"
                    value={formData.fullName}
                    onChangeText={t => setFormData({ ...formData, fullName: t })}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>University / College</Text>
                <View style={styles.pickerContainer}>
                    {/* Simple mock picker for now, ideal would be a Modal Picker */}
                    <TextInput
                        style={styles.input}
                        placeholder="Select your institution"
                        value={formData.university}
                        onChangeText={t => setFormData({ ...formData, university: t })}
                        placeholderTextColor="#94a3b8"
                    />
                    <Text style={styles.pickerIcon}>▼</Text>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <TextInput
                    style={styles.input}
                    placeholder="YYYY-MM-DD"
                    value={formData.dob}
                    onChangeText={t => setFormData({ ...formData, dob: t })}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Documents</Text>
            <Text style={styles.sectionSubHeader}>Boost your chances by uploading your documents.</Text>

            <TouchableOpacity style={styles.uploadBox}>
                <View style={styles.uploadIconCircle}>
                    <Text style={styles.uploadIcon}>📄</Text>
                </View>
                <Text style={styles.uploadTitle}>Upload CV</Text>
                <Text style={styles.uploadSub}>PDF or Word (Max 5MB)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.uploadBox}>
                <View style={styles.uploadIconCircle}>
                    <Text style={styles.uploadIcon}>📝</Text>
                </View>
                <Text style={styles.uploadTitle}>Cover Letter</Text>
                <Text style={styles.uploadSub}>Optional, but recommended</Text>
            </TouchableOpacity>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.formContainer}>
            <Text style={styles.headline}>Tell us about yourself</Text>
            <Text style={styles.subHeadline}>Add your background to help employers find the right shifts for you.</Text>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Work Experience</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe previous roles, volunteer work, or university societies..."
                    multiline
                    textAlignVertical="top"
                    value={formData.experience}
                    onChangeText={t => setFormData({ ...formData, experience: t })}
                    placeholderTextColor="#94a3b8"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Key Skills</Text>
                <View style={styles.skillsContainer}>
                    {formData.skills.map(skill => (
                        <View key={skill} style={styles.skillTag}>
                            <Text style={styles.skillText}>{skill}</Text>
                            <TouchableOpacity onPress={() => removeSkill(skill)}>
                                <Text style={styles.skillClose}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <View style={styles.skillInputWrapper}>
                        <TextInput
                            style={styles.skillInput}
                            placeholder="Add Skill +"
                            value={newSkill}
                            onChangeText={setNewSkill}
                            onSubmitEditing={handleAddSkill}
                            placeholderTextColor="#a91e5a"
                        />
                    </View>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                    <Text style={styles.label}>Short Bio</Text>
                    <Text style={styles.charCount}>{formData.bio.length}/300</Text>
                </View>
                <TextInput
                    style={[styles.input, styles.textAreaSmall]}
                    placeholder="Briefly describe your personality and work ethic..."
                    multiline
                    textAlignVertical="top"
                    value={formData.bio}
                    onChangeText={t => setFormData({ ...formData, bio: t })}
                    placeholderTextColor="#94a3b8"
                />
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.completionContainer}>
            <View style={styles.confettiContainer}>
                {/* Simple confetti dots */}
                <View style={[styles.confetti, { top: '10%', left: '10%', backgroundColor: '#a91e5a' }]} />
                <View style={[styles.confetti, { top: '20%', right: '20%', backgroundColor: '#d946ef' }]} />
                <View style={[styles.confetti, { top: '40%', left: '50%', backgroundColor: '#a91e5a' }]} />
            </View>

            <View style={styles.successHeader}>
                <View style={styles.successIconCircle}>
                    <Text style={styles.successIcon}>🎉</Text>
                </View>
                <Text style={styles.successTitle}>Profile Ready!</Text>
                <Text style={styles.successSub}>Your profile is now visible to employers. You're all set to start finding shifts.</Text>
            </View>

            <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                    <View style={styles.previewAvatarContainer}>
                        <View style={styles.previewAvatar} />
                    </View>
                </View>
                <View style={styles.previewBody}>
                    <Text style={styles.previewBadge}>PREVIEW MODE</Text>
                    <Text style={styles.previewName}>{formData.fullName || 'Alex Rivera'}</Text>
                    <Text style={styles.previewUni}>{formData.university || 'Trinity College Dublin'}</Text>
                    <Text style={styles.previewYear}>Verified Student · 3rd Year</Text>

                    <View style={styles.previewTags}>
                        {formData.skills.slice(0, 3).map(s => (
                            <View key={s} style={styles.previewTag}>
                                <Text style={styles.previewTagText}>{s}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.previewDivider} />

                    <TouchableOpacity style={styles.previewEditBtn} onPress={() => setStep(1)}>
                        <Text style={styles.previewEditIcon}>✎</Text>
                        <Text style={styles.previewEditText}>Edit Profile Details</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backButtonIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{step === 3 ? 'Step 3 of 3' : 'Profile Setup'}</Text>
                    <View style={styles.stepIndicator}>
                        {step < 3 && <Text style={styles.stepText}>Step {step}</Text>}
                    </View>
                </View>

                {/* Progress Bar (Global) */}
                {step < 3 ? (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressLabelRow}>
                            <Text style={styles.progressLabel}>Progress</Text>
                            <Text style={styles.progressValue}>{progress}</Text>
                        </View>
                        <View style={styles.track}>
                            <View style={[styles.bar, { width: progress }]} />
                        </View>
                    </View>
                ) : (
                    <View style={styles.stepDots}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={[styles.dot, styles.dotActive]} />
                    </View>
                )}

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                </ScrollView>

                {/* Bottom Bar */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={styles.mainButton}
                        onPress={() => {
                            if (step < 3) setStep(step + 1);
                            else navigation.navigate('Home' as never); // Finish
                        }}
                    >
                        <Text style={styles.mainButtonText}>
                            {step === 3 ? 'Complete Setup' : step === 2 ? 'Continue to Final Step' : 'Save & Continue'}
                        </Text>
                        {step < 3 && <Text style={styles.mainButtonIcon}> →</Text>}
                    </TouchableOpacity>
                    {step === 3 && (
                        <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate('Home' as never)}>
                            <Text style={styles.skipButtonText}>Maybe later</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginTop: Platform.OS === 'android' ? 24 : 0,
    },
    backButton: {
        padding: 8,
    },
    backButtonIcon: {
        fontSize: 20,
        color: '#0f172a',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    stepIndicator: {
        width: 60,
        alignItems: 'flex-end',
    },
    stepText: {
        color: '#a91e5a',
        fontWeight: 'bold',
        fontSize: 14,
    },
    progressContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    progressValue: {
        color: '#a91e5a',
        fontWeight: 'bold',
        fontSize: 14,
    },
    track: {
        height: 6,
        backgroundColor: 'rgba(169, 30, 90, 0.2)',
        borderRadius: 99,
        overflow: 'hidden',
    },
    bar: {
        height: '100%',
        backgroundColor: '#a91e5a',
    },
    stepDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        paddingBottom: 16,
    },
    dot: {
        width: 48,
        height: 6,
        borderRadius: 99,
        backgroundColor: '#e2e8f0',
    },
    dotActive: {
        backgroundColor: '#a91e5a',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 100,
    },
    formContainer: {
        paddingHorizontal: 16,
        paddingTop: 8,
    },
    headerSpacer: {
        height: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    sectionSubHeader: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 20,
    },
    inputGroup: {
        marginBottom: 20,
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
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
    uploadBox: {
        borderWidth: 2,
        borderColor: '#e2e8f0',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        backgroundColor: 'rgba(248, 250, 252, 0.5)',
        marginBottom: 16,
    },
    uploadIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 999,
        backgroundColor: 'rgba(169, 30, 90, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    uploadIcon: {
        fontSize: 24,
    },
    uploadTitle: {
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 4,
    },
    uploadSub: {
        fontSize: 12,
        color: '#64748b',
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    subHeadline: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 24,
    },
    textArea: {
        height: 120,
    },
    textAreaSmall: {
        height: 100,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        backgroundColor: '#a91e5a',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    skillText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    skillClose: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    skillInputWrapper: {
        backgroundColor: 'rgba(169, 30, 90, 0.1)',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(169, 30, 90, 0.2)',
    },
    skillInput: {
        color: '#a91e5a',
        fontWeight: '600',
        fontSize: 12,
        minWidth: 80,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    charCount: {
        fontSize: 12,
        color: '#94a3b8',
    },
    // Step 3
    completionContainer: {
        flex: 1,
        alignItems: 'center',
        padding: 24,
    },
    confettiContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    confetti: {
        position: 'absolute',
        width: 8,
        height: 8,
        borderRadius: 2,
        opacity: 0.6,
    },
    successHeader: {
        alignItems: 'center',
        marginBottom: 32,
    },
    successIconCircle: {
        width: 64,
        height: 64,
        backgroundColor: 'rgba(169, 30, 90, 0.1)',
        borderRadius: 999,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    successIcon: {
        fontSize: 32,
    },
    successTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
    },
    successSub: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: 16,
    },
    previewCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
        elevation: 8,
    },
    previewHeader: {
        height: 128,
        backgroundColor: 'rgba(169, 30, 90, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewAvatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 999,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        elevation: 4,
    },
    previewAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 999,
        backgroundColor: '#cbd5e1',
    },
    previewBody: {
        padding: 24,
        alignItems: 'center',
    },
    previewBadge: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#a91e5a',
        marginBottom: 4,
    },
    previewName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    previewUni: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    previewYear: {
        fontSize: 12,
        color: '#94a3b8',
        marginTop: 4,
    },
    previewTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        justifyContent: 'center',
        marginTop: 16,
    },
    previewTag: {
        backgroundColor: 'rgba(169, 30, 90, 0.1)',
        borderRadius: 99,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    previewTagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#a91e5a',
    },
    previewDivider: {
        width: '100%',
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 16,
    },
    previewEditBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    previewEditIcon: {
        color: '#a91e5a',
        fontSize: 14,
    },
    previewEditText: {
        color: '#a91e5a',
        fontSize: 14,
        fontWeight: '600',
    },
    bottomBar: {
        padding: 16,
        backgroundColor: '#fff', // or transparent if overlay needed
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    mainButton: {
        backgroundColor: '#a91e5a',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#a91e5a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    mainButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    mainButtonIcon: {
        color: '#fff',
        fontSize: 18,
    },
    skipButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    skipButtonText: {
        color: '#64748b',
        fontSize: 14,
        fontWeight: '500',
    },
});
