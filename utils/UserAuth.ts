import {redis} from "@/lib/redis"
import { env } from "./config";
import { ApiError } from "./apiError";
import type { AuthenticatedUser } from "@/types/types";


type SessionRecord = {
  userId: string;
  createdAt: string;
};
const DEFAULT_SESSION_COOKIE_NAME = "fantasy_chat";

const parseCookieValue=(cookieHeader:string,cookieName:string)=>{
const cookies=cookieHeader.split(";")
for (const cookieEntry of cookies) {
    const [name, ...valueParts] = cookieEntry.trim().split("=");

    if (name === cookieName) {
      return decodeURIComponent(valueParts.join("="));
    }
  }

  return null;
}



const parseBearerToken=(req:Request)=>{
  const authorizationHeader=req.headers.get("authorization")
  if(!authorizationHeader){
    return null
  }
  const [scheme,token]=authorizationHeader.split(" ")
  if(scheme?.toLowerCase()!=='bearer'|| !token){
    return null
  }
return token
}
function readSessionToken(req:Request){
const bearerToken=parseBearerToken(req)
if(bearerToken){
  return bearerToken
}
const cookiesHeader=req.headers.get("cookie")
if(!cookiesHeader){
  return null
}
return parseCookieValue(cookiesHeader,env.SESSION_COOKIE_NAME?? DEFAULT_SESSION_COOKIE_NAME)
}

export async function getAuthenticatedUser(req:Request):Promise<AuthenticatedUser |null>{
const sessionToken=readSessionToken(req)
if(!sessionToken){
  return null;
}
const session=await redis.get<SessionRecord>(`session:${sessionToken}`)

  if (!session?.userId) {
    return null;
  }

  const user = await redis.get<AuthenticatedUser>(`user:${session.userId}`);

  return user ?? null;
}


export async function requireAuthenticatedUser(request: Request) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    throw new ApiError(401, "Unauthorized");
  }

  return user;
}







