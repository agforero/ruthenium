export {};

declare global {
  interface Window {
    ruthenium?: {
      platform: string;
      selectProjectDirectory: () => Promise<string | null>;
    };
  }
}
