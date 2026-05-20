import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { ApiError } from "@/utils/apiError";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asynchandler";
import { registerSchema } from "@/utils/validSchema";
import { env } from "@/utils/config";
import type { AuthenticatedUser } from "@/types/types";
/**
 * return default Avatar by username
 * @param username
 * @return char
 */
const buildDefaultAvatar = (username: string) => {
  const firstLetter = username.trim().charAt(0).toUpperCase() || "A";
  return `https://placehold.co/128x128/1f2937/ffffff?text=${encodeURIComponent(firstLetter)}`;
};

/**
 * Generate random Id and Store user in redis store
 * @requires {username,fantasy}
 * @return {userId}
 */
export const POST=asyncHandler(async(request:Request)=>{
const body=await request.json().catch(()=>{
    throw new ApiError(400,"Invalid Json body")
})

const {username,fantasy}=registerSchema.parse(body)

//todo: convert fantasy word 
const userId=randomUUID()
const sessionToken= randomUUID()
const now=new Date().toISOString()
const userRecord:AuthenticatedUser={
  userId:userId,
  username:username,
  avatar:buildDefaultAvatar(username),
  createdAt:now,
  fantasy,
  attempScore:0,
  mask:"0",
  tags:[],
  queue:null,
  status:"idle",
  categoryRoom:null,
}

await redis.set(`user:${userId}`,userRecord,{ex:env.SESSION_TTL_SECONDS ?? 1600})
await redis.set(`session:${sessionToken}`,{userId,createdAt:now},{ex:env.SESSION_TTL_SECONDS ?? 1600})
const response=new ApiResponse(201,{user:userRecord,sessionToken,sessionExpireIn:env.SESSION_TTL_SECONDS},"Session created Successfully")
return NextResponse.json(response,{status:response.statusCode})
})
