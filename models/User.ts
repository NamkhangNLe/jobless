export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    friends: string[]; // Array of user IDs
}