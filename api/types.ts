import { AxiosError } from "axios";

type AuthErrorData = {
  messages:{
    id:string;
    message:string;
  }[]
}[]

export type AuthError = AxiosError<{
  statusCode: number;
  error: string;
  message:AuthErrorData;
  data:AuthErrorData;
  }>

export interface User {
  id:number;
  username: string;
}

export interface Article{
  id:number;
  title: string;
}

export interface AuthResult{
  jwt: string;
  user: User;
}