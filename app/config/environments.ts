export const environments = {
  development: {
    baseUrl: "http://localhost:3000",
  },
  production: {
    baseUrl: "https://dazlng.inoval.io",
  },
} as const;

export type Environment = keyof typeof environments;

export const getEnvironment = (): Environment => {
  if (process.env.NODE_ENV === "production") {
    return "production";
  }
  return "development";
};
