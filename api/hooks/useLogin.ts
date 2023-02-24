import { useMutation } from "react-query";
import { Login } from "../auth";
import {AuthError} from "../types"

export default function useLogin(){
  const mutation = useMutation(Login,{
    onSuccess:(data) => {
      console.log(data)
      /**구현예정 */
    },
    onError:(error: AuthError) =>{
      console.log(error)
      /**구예 */
    }
  })
  return mutation
}