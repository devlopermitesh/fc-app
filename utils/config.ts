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

const readRawEntry = (key: string): string | undefined => {
  const value = process.env[key];
  if (value == undefined) {
    return undefined;
  }
  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : undefined;
};
const parseNodeEnv = (rawValue: string | undefined): NODE_ENV => {
  switch (rawValue) {
    case "development":
    case "production":
    case "test":
      return rawValue ?? undefined;

    default:
        throw new Error(`[env] variable Node_env must be in one of development,production,test received value ${rawValue}`)
      break;
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
    PORT: parsePort(requireEnv("PORT")),
    CORS_ORIGIN: readRawEntry("CORS_ORIGIN") ?? "*",
    JWT_SECRET: readRawEntry("JWT_SECRET"),
    UPSTASH_REDIS_REST_URL: readRawEntry("UPSTASH_REDIS_REST_URL"),
    UPSTASH_REDIS_REST_TOKEN: readRawEntry("UPSTASH_REDIS_REST_TOKEN"),
     SESSION_COOKIE_NAME:requireEnv("SESSION_COOKIE_NAME"),
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
