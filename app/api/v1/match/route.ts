import { redis } from "@/lib/redis";
import { CATEGORIES, CATEGORY_MASKS, CategoryName } from "@/seed/constant/category.constant";
import { AuthenticatedUser } from "@/types/types";
import { ApiResponse } from "@/utils/apiResponse";
import { asyncHandler } from "@/utils/asynchandler";
import { requireAuthenticatedUser } from "@/utils/UserAuth";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

type RoomRecord = {
  roomId: string;
  users: string[];
  queue: string;
  commonTags: CategoryName[];
  createdAt: string;
  status: "active";
};

const DEFAULT_QUEUE="casual"
const normalizeFantasy=(fantasy:string)=>fantasy.toLowerCase()
/**
 * Extract Taggs from Fantasy description
 * @params string fantasy
 * @return array CategoryName[]
 */
const extractTags=(fant:string):CategoryName[]=>{
  const normalizedFantasy=normalizeFantasy(fant)

const matches= CATEGORIES.filter((category)=>{
  const pattern=category.replace("-","[\\s-]?");
  return new RegExp(`\\b${pattern}\\b`,'i').test(normalizedFantasy)
})
return matches.length>0?matches:[DEFAULT_QUEUE]
}

/**
 * return mask calcuation of categorial Name
 * @params CategoryName[]
 * @return String
 */

const buildMaskFromTags = (tags: CategoryName[]) =>
  tags.reduce((mask, tag) => mask | BigInt(CATEGORY_MASKS[tag]), BigInt(0)).toString();

/**
 * merge object users in single user object  
 * @return 
 */
const mergeUserState=(user:AuthenticatedUser,updates:Partial<AuthenticatedUser>):AuthenticatedUser=>{
  return ({
    ...user,
    ...updates
  })
}
/**
 * tell about how many categories in params mask using POpcounting
 * @param mask 
 * @return count
 */
const countSetBits=(mask:bigint)=>{
let remainingMask=mask
let count=0
while(remainingMask>0){
  count+=Number(remainingMask & BigInt(1))
  remainingMask>>=BigInt(1)
}
return count
}



/**
 * Convert mask into included tags by mask and category bitwise
 * @params mask
 * @return tags
 */
const getCommonTags=(mask:bigint)=>{
return CATEGORIES.filter((category)=>(mask & BigInt(CATEGORY_MASKS[category]))!==BigInt(0))
}




const POST=asyncHandler(async(req:Request)=>{
  const authenticatedUser=await requireAuthenticatedUser(req)
  const tags=extractTags(authenticatedUser.fantasy)
  const mask=buildMaskFromTags(tags)
  const primaryQueue=tags[0] ?? DEFAULT_QUEUE;
  const now=new Date().toISOString()
  const queueKey=`queue:${primaryQueue}`

  const currentUserState=mergeUserState(authenticatedUser,{
tags,
mask,
queue:primaryQueue,
status:"waiting",
categoryRoom:null,
attempScore:authenticatedUser.attempScore+1
  })
  await redis.set(`user:${authenticatedUser.userId}`,currentUserState)
  await redis.sadd(queueKey,authenticatedUser.userId)
  const queuedUserIds=await redis.smembers<string[]>(queueKey)
let bestCandidate:|{
  user:AuthenticatedUser;
  commonMask:bigint;
  commonTags:CategoryName[];
  score:number
}|null=null;
  for (let candidateUserId of queuedUserIds){
 //skip user self
 if(candidateUserId===authenticatedUser.userId){
  continue
 }
 const candidate=await redis.get<AuthenticatedUser>(`user:${candidateUserId}`)
 //skip user in waiting or not in same queue
 if(!candidate || candidate.status!=="waiting" || candidate.queue!==primaryQueue){
continue
 }

 // if not match fantasy words
 const commonMask=BigInt(mask) & BigInt(candidate.mask)
 if(commonMask==BigInt(0)){
  continue
 }
 const commonTags=getCommonTags(commonMask)
 const score=countSetBits(commonMask)

 if(!bestCandidate || score>bestCandidate.score){
bestCandidate={
  user:candidate,
  commonMask,
  commonTags,
  score
}
 }
  }

  if (!bestCandidate) {
    const response = new ApiResponse(
      202,
      {
        status: "waiting",
        queue: primaryQueue,
        tags,
        mask,
      },
      "No compatible user available yet",
    );
return NextResponse.json(response, { status: response.statusCode });

  }
  const roomId=randomUUID()
  const roomRecord:RoomRecord={
    roomId,
    users:[authenticatedUser.userId,bestCandidate.user.userId],
    queue:primaryQueue,
    commonTags:bestCandidate.commonTags,
    createdAt:now,
    status:"active"
  }
  const matchedUserState=mergeUserState(currentUserState,{status:"matched",categoryRoom:roomId})
  const matchedCandidateUser=mergeUserState(bestCandidate.user,{
    status:"matched",
    categoryRoom:roomId
  })
  await redis.set(`room:${roomId}`,roomRecord)
  await redis.set(`user:${matchedUserState.userId}`,matchedUserState)
  await redis.set(`user:${matchedCandidateUser.userId}`,matchedCandidateUser)
  await redis.srem(queueKey,authenticatedUser.userId,bestCandidate.user.userId)

  const response = new ApiResponse(
    200,
    {
      status: "matched",
      roomId,
      queue: primaryQueue,
      commonTags: bestCandidate.commonTags,
      matchedUser: {
        userId: bestCandidate.user.userId,
        username: bestCandidate.user.username,
        avatar: bestCandidate.user.avatar,
        fantasy: bestCandidate.user.fantasy,
      },
    },
    "Match found successfully",
  );
  return NextResponse.json(response, { status: response.statusCode });
  
})
export default POST;





















