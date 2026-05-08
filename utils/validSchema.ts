import {z} from "zod"
export const registerSchema=z.object({
  username:z.string().trim().min(2,"Username must be at least 2 characters long").max(30,"Username must be not longer then 30 characters"),
  fantasy:z.string().trim().min(10,"Fantasy must be at least 10 characters long").max(500,"Fantasy must be at most 500 characters long")
})
export type RegisterInput=z.infer<typeof registerSchema>
