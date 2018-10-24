export class DeferredClickEvent {
  success: () => void;
  error: (...args: any[]) => void;
}
