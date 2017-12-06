export interface Modifiers {
    [key: string]: boolean;

    self: boolean;
    left: boolean;
    right: boolean;
    esc: boolean;
    enter: boolean;
    once: boolean;
    stop: boolean;
    prevent: boolean;
}
