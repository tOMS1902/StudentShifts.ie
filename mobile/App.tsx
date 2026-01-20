import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { API_URL } from './constants';

export default function App() {
  const [status, setStatus] = useState<string>('Connecting...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_URL}/health`);
      if (res.ok) {
        const data = await res.json();
        setStatus(`Connected! Server Time: ${data.time}`);
      } else {
        setStatus('Error: Server returned ' + res.status);
      }
    } catch (error) {
      console.error(error);
      setStatus('Error: Could not connect to API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Shifts Mobile</Text>

      <View style={styles.card}>
        <Text style={styles.subtitle}>Backend Status:</Text>
        {loading ? (
          <ActivityIndicator color="#d946ef" />
        ) : (
          <Text style={styles.status}>{status}</Text>
        )}
      </View>

      <Text style={styles.footer}>Open this on your phone with Expo Go!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  status: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d946ef', // Magenta
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    color: '#999',
    fontSize: 12,
  },
});
