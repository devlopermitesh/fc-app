type NODE_ENV = "production" | "development" | "test";
type App_Env = Readonly<{
  NODE_Env: NODE_ENV;
  PORT: number;
  CORS_ORIGIN: string;
  JWT_SECRET?: string;
  UPSTASH_REDIS_REST_URL?: string;
  UPSTASH_REDIS_REST_TOKEN?: string;
  SESSION_COOKIE_NAME?: string;
  SESSION_TTL_SECONDS?: number;
  NEXT_PUBLIC_SOCKET_URL?:string
}>;

const REQUIRED_KEYS = ["PORT","SESSION_COOKIE_NAME","NEXT_PUBLIC_SOCKET_URL"]  as const;
const DEFAULT_PORT = 3000;
const DEFAULT_SESSION_COOKIE_NAME = "fantasychat_session";
const isServerRuntime = typeof window === "undefined";

const readRawEntry = (key: string): string | undefined => {
  const value = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    JWT_SECRET: process.env.JWT_SECRET,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    SESSION_TTL_SECONDS: process.env.SESSION_TTL_SECONDS,
    NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  }[key];

  if (value == undefined) {
    return undefined;
  }
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
};
const parseNodeEnv = (rawValue: string | undefined): NODE_ENV => {
  switch (rawValue) {
    case undefined:
    case "development":
    case "production":
    case "test":
      return rawValue ?? "development";

    default:
        throw new Error(`[env] variable Node_ENV must be in one of development,production,test received value ${rawValue}`)
  }
};
const requireEnv=<k extends (typeof REQUIRED_KEYS)[number]>(key:k):string=>{
const value=readRawEntry(key)
if(!value){
    throw new Error(`[env] ${key} is required variable. Define it in env before  staring the server`)
}
return value
}

const parsePort=(rawport:string):number=>{
const value=Number(rawport)
if(!Number.isInteger(value) || value<=0){
    throw new Error(`[env] Port sould be Positive Number Received ${value} `)
}
return value
}
function BuildEnv(): App_Env {
  return Object.freeze({
    NODE_Env: parseNodeEnv(readRawEntry("NODE_ENV")),
    PORT: isServerRuntime
      ? parsePort(requireEnv("PORT"))
      : parsePort(readRawEntry("PORT") ?? String(DEFAULT_PORT)),
    CORS_ORIGIN: readRawEntry("CORS_ORIGIN") ?? "*",
    JWT_SECRET: readRawEntry("JWT_SECRET"),
    UPSTASH_REDIS_REST_URL: readRawEntry("UPSTASH_REDIS_REST_URL"),
    UPSTASH_REDIS_REST_TOKEN: readRawEntry("UPSTASH_REDIS_REST_TOKEN"),
     SESSION_COOKIE_NAME:isServerRuntime
      ? requireEnv("SESSION_COOKIE_NAME")
      : readRawEntry("SESSION_COOKIE_NAME") ?? DEFAULT_SESSION_COOKIE_NAME,
     SESSION_TTL_SECONDS:parsePort(readRawEntry("SESSION_TTL_SECONDS") ?? "86400"),
     NEXT_PUBLIC_SOCKET_URL:requireEnv('NEXT_PUBLIC_SOCKET_URL')
  });
}
declare global{
  var __appEnv:App_Env|undefined
}


export const env:App_Env=globalThis.__appEnv??BuildEnv()


globalThis.__appEnv = env;

export function assertEnvPresent(key: keyof App_Env, value: string | undefined): string {
  if (!value) {
    throw new Error(`[env] ${key} is required for this code path.`);
  }

  return value;
}
