import { useMutation } from "react-query";
import { register } from "../auth";
import { AuthError } from "../types";


export default function useRegister(){
  const mutation = useMutation(register,{
    onSuccess:(data) => {
      console.log(data)
      /**구현예정 */
    },
    onError:(error :AuthError) =>{
      console.log(error)
      /**구예 */
    }
  })
  return mutation
}