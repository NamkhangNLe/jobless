import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { fetchNotifications } from '@/models/Notifications';

interface Notification {
  id: string;
  userId: string;
  eventId: string;
  message: string;
  read: boolean;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications from the backend
    async function fetchNotificationsData() {
      try {
        const data = await fetchNotifications('currentUserId'); // Replace with actual user ID
        setNotifications(data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }

    fetchNotificationsData();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Notifications</ThemedText>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ThemedView style={styles.notification}>
            <ThemedText>{item.message}</ThemedText>
          </ThemedView>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  notification: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
