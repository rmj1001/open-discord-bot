/**
 * Node Event type
 */
export type NodeEvent = {
    name: string;
    once: boolean,
    execute(): void;
};
