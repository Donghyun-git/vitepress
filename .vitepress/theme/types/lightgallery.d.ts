export {};

declare global {
  interface Window {
    lgData?: {
      [key: string]: any;
    };
  }
}
