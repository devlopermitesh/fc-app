import { unknown, ZodError } from "zod";
import { NextResponse } from "next/server";
import { ApiError } from "./apiError";
/**
 * Return Userfriendly Error on base of Https Request
 * 
 * @param {number} statusCode - Standard HTTP response status code (e.g., 404, 500)
 * @returns {string} Default error message that can show to user
 */
const getDefaultMessage = (statusCode: number) => {
  if(statusCode>=500){
    return "Internal Server Error"
  }
  if(statusCode==404){
    return "Resource not Found"
  }
  if(statusCode==401){
    return "Unauthorized"
  }
  if(statusCode==403){
    return "Forbidden"
  }
  if(statusCode==400){
    return "Bad request"
  }
};




const normalizedError=(error:unknown)=>{
if(error instanceof ZodError){
  return NextResponse.json({
    statusCode:400,
    message:"Validation Failed",
    success:false,
    data:null,
    errors:error.flatten()
  },{status:400})
}
if(error instanceof ApiError){
  return NextResponse.json({
    statusCode:error.statusCode,
    message:error.message || getDefaultMessage(error.statusCode),
    success:false,
    data:null,
    errors:error.details
  },{status:error.statusCode})
}
return NextResponse.json({
  statusCode:500,
  message:"Internal Server Error",
  success:false,
  data:null,
  errors:null
},{status:500})
}


type RouteHandler<TContext=unknown>=(
request:Request,
context:TContext
)=>Promise<Response>

/**
 * Handle api  async request and context under once only trycatch block
 * @param handler 
 * @return void
 */
export const asyncHandler=<TContext=unknown>(handler:RouteHandler<TContext>)=>{
  return async(request:Request,context:TContext)=>{
    try {
      return await handler(request,context)
    } catch (error) {
      return normalizedError(error)
    }
  }
}

