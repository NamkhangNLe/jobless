export interface Subscription {
    id: string;
    userId: string;
    friendId: string; // ID of the friend the user is subscribed to
}

export async function getFriendsSubscribedToUser(userId: string): Promise<string[]> {
    try {
        const response = await fetch(`https://your-backend-api.com/subscriptions?userId=${userId}`);
        const data = await response.json();
        return data.map((subscription: Subscription) => subscription.friendId);
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return [];
    }
}
