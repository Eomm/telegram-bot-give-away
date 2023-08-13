/**
 * Event
 * A Event
 */
declare interface Event {
    id?: number;
    code?: string | null;
    createdAt?: string | null;
    createdBy?: number | null;
    description: string;
    endedAt?: string | null;
    name: string;
    prize: string;
    requiredWinners: number;
    updatedAt?: string | null;
}
export { Event };
