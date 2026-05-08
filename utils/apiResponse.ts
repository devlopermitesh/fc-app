export class ApiResponse<TData=unknown>{
  success:boolean;
  statusCode:number;
  message:string;
  data:TData|null
  constructor(statusCode=200,data:TData|null=null,message="Request Success"){
    this.success=statusCode<400
    this.statusCode=statusCode
    this.message=message
    this.data=data
  }
}
