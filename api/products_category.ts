import client from "./client";
import { AuthResult, User } from "./types";

interface SignUpParams{
  idx:string;
  mt_profile_img:string,
  mt_na:number;
  mt_hp:string;
  mt_name:string;
  mt_email:string;
  sell_count:number;
  trade_com_count:number;
}
interface PhoneCallCheckParams{
  mt_na:number;
  mt_hp:string;
}
interface RegisterParams{
  username:string;
  email:string;
  password:string;
}
interface LoginParams{
  identifier:string;
  password:string;
}
interface CategoryListUp{
  ct_idx:string;
  ct_name:string;
  ct_en_name:string;
  ct_in_name:string;
  ct_file1:string;
}

export async function CategoryListUp(params:any){
  const response = await client.get<any>(
    '/product/category-list?ct_idx&ct_name&ct_en_name&ct_in_name&ct_file1',params
    
    )
    return response.data
}
export async function register(params: RegisterParams){
  const response = await client.post<AuthResult>(
    '/auth/local/register',params
    )
    return response.data
}

export async function Login(params: LoginParams){
  const response = await client.post<AuthResult>(
    '/auth/local',params
    )
    return response.data
}

export async function getLoginStatus(){
  const response = await client.get<User>(
    '/users/me'
  )
  return response.data
}