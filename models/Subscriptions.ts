export interface Subscription {
    id: string;
    userId: string;
    friendId: string; // ID of the friend the user is subscribed to
}