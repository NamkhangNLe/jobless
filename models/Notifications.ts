export interface Notification {
    id: string;
    userId: string;
    eventId: string;
    message: string;
    read: boolean;
}

export async function sendNotification(userId: string, message: string): Promise<void> {
    try {
        const response = await fetch('https://your-backend-api.com/notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, message }),
        });

        if (!response.ok) {
            throw new Error('Failed to send notification');
        }
    } catch (error) {
        console.error('Error sending notification:', error);
    }
}

export async function fetchNotifications(userId: string): Promise<Notification[]> {
    try {
        const response = await fetch(`https://your-backend-api.com/notifications?userId=${userId}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching notifications:', error);
        return [];
    }
}
