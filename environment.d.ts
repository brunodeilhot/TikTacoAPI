declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        MONGODB_URL: string;
        ORIGIN: string;
        API_KEY: string;
      }
    }
  }
  
  export {};
  