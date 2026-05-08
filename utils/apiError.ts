export class ApiError extends Error {
  statusCode:number
  details?:unknown
  constructor(statusCode:number=500,message="Internal Server Error",details?:unknown){
    super(message)
    this.statusCode=statusCode
    this.message=message
    this.details=details
    this.name="ApiError"
  }
}


