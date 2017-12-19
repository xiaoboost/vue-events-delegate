type AllEvent = Event & MouseEvent & KeyboardEvent & WheelEvent;
type InputProps =
    'bubbles' | 'cancelable' | 'button' | 'buttons' | 'clientX' | 'clientY' |
    'screenX' | 'screenY' | 'deltaX' | 'deltaY' | 'deltaZ' | 'deltaMode' | 'altKey' |
    'code' | 'ctrlKey' | 'key' | 'location' | 'metaKey' | 'repeat' | 'shiftKey';

export type Options = Partial<{ [key in InputProps]: AllEvent[key] } & { capture: boolean }>;

export interface Modifiers {
    self: boolean;
    left: boolean;
    right: boolean;
    esc: boolean;
    enter: boolean;
    once: boolean;
    stop: boolean;
    prevent: boolean;
    capture: boolean;
}
