export {};

declare global {
  interface Window {
    ruthenium?: {
      platform: string;
      ping: () => Promise<unknown>;
      scanProjectGraph: (rootPath: string) => Promise<unknown>;
      selectProjectDirectory: () => Promise<string | null>;
    };
  }
}
