declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: string;
        MONGODB_URL: string;
        ORIGIN: string;
        REQ_HOST: string;
        API_KEY: string;
      }
    }
  }
  
  export {};
  