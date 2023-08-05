/**
 * User
 * A User
 */
declare interface User {
    id?: number;
    chatId: number;
    createdAt?: string | null;
    currentAction?: string | null;
    currentActionData?: string | null;
    lang: string;
    role: "creator" | "user";
    updatedAt?: string | null;
    username: string;
}
export { User };
