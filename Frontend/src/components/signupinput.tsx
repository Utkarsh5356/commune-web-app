import { Card } from "./ui/card"
import {InputOTP,InputOTPGroup,InputOTPSlot} from "./ui/input-otp"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {Label} from "./ui/label"
import Loader from "./ui/loader"
import { Link,useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSignUp,useUser } from "@clerk/react-router"

export default function SignUpInput(){
  const {isLoaded,signUp,setActive}=useSignUp()
  const {isSignedIn}=useUser()
  const [pendingVerification,setPendingVerification]=useState(false)
  const [code,setCode]=useState("")
  const [error,setError]=useState("")
  const [username,setUsername] = useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [showPassword,setShowPassword] = useState(false) 
  const navigate=useNavigate() 
  
  if(isSignedIn){
    navigate("/channels/@me")
    return 
  } 
  if(!isLoaded) return <Loader/>
   
  async function submit(){
    if(!isLoaded) return null
    try{
      await signUp.create({
        username,
        emailAddress:email,
        password
      })
      await signUp.prepareEmailAddressVerification({
        strategy : "email_code"
      })
      setPendingVerification(true)
    }catch(err:any){
      console.log(JSON.stringify(err))
      setError(err.errors[0].message)
    }
  }

  async function onPressVerify(){
    if(!isLoaded) return null
    try{
     const completeSignup=await signUp.attemptEmailAddressVerification({code})
     if(completeSignup.status !== "complete"){
      console.log(completeSignup)
     }
     if(completeSignup.status === "complete"){
      console.log(completeSignup) 
      await setActive({
        session:completeSignup.createdSessionId
      })
      navigate("/channels/@me")
     }
    }catch(err:any){
     console.log(err)
     setError(err.errors[0].message)
    }
  }

  async function googleSignIn(){
    if(!isLoaded) return null
    try{
      await signUp.authenticateWithRedirect({
      strategy:'oauth_google',
      redirectUrl:'/sso-callback',
      redirectUrlComplete:'/channels/@me',
     })
    }catch(err:any){
      console.log(err)
    }
  }
    return (
     <Card className="w-full max-w-sm">
     {!pendingVerification ? <>
        <div className="text-gray-800 text-xl text-center font-bold tracking-tight">
          Create your account
       </div>
       <div className="text-center text-sm text-slate-500 font-normal tracking-tight -mt-4">
          Welcome! Please fill in the details to get started
       </div>
       <div className="flex justify-center mt-2 "> 
          <Button onClick={googleSignIn} variant="outline" className="bg-white text-gray-600 text-sm font-semibold gap-4 px-20 h-8 ">
            <span>
              <svg width="64px" height="64px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
            </span> Continue with Google
          </Button>
       </div>
       <div className="inline-flex items-center justify-center w-full">
         <hr className="w-81 h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
         <span className="absolute px-3 text-sm font-medium -mt-1 text-gray-500 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
       </div>
       <div className="px-7 -mt-6">
        <Label className="my-2">User Name</Label>
        <Input value={username} onChange={(e)=>setUsername(e.target.value)} className="text-sm text-gray-800"></Input>
        <Label className="my-2">Email Address</Label>
        <Input value={email} onChange={(e)=>setEmail(e.target.value)} className="text-sm text-gray-800 "></Input>
        <Label className="my-2">Password</Label>
        <div className="relative">
         <Input value={password} onChange={(e)=>setPassword(e.target.value)} type={showPassword ? "text" : "password"} className="text-sm text-gray-800 pr-13"></Input>
          <div onClick={()=>setShowPassword(!showPassword)} className="cursor-pointer">
            {showPassword ? <svg className="absolute top-2 left-66 h-5" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> 
             <path d="M12 16.01C14.2091 16.01 16 14.2191 16 12.01C16 9.80087 14.2091 8.01001 12 8.01001C9.79086 8.01001 8 9.80087 8 12.01C8 14.2191 9.79086 16.01 12 16.01Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M2 11.98C8.09 1.31996 15.91 1.32996 22 11.98" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M22 12.01C15.91 22.67 8.09 22.66 2 12.01" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> 
           </g></svg> : 
           <svg className="absolute top-3 left-66 h-5" width="64px" height="64px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
             <path fill-rule="evenodd" clip-rule="evenodd" d="M22.2954 6.31083C22.6761 6.474 22.8524 6.91491 22.6893 7.29563L21.9999 7.00019C22.6893 7.29563 22.6894 7.29546 22.6893 7.29563L22.6886 7.29731L22.6875 7.2998L22.6843 7.30716L22.6736 7.33123C22.6646 7.35137 22.6518 7.37958 22.6352 7.41527C22.6019 7.48662 22.5533 7.58794 22.4888 7.71435C22.3599 7.967 22.1675 8.32087 21.9084 8.73666C21.4828 9.4197 20.8724 10.2778 20.0619 11.1304L21.0303 12.0987C21.3231 12.3916 21.3231 12.8665 21.0303 13.1594C20.7374 13.4523 20.2625 13.4523 19.9696 13.1594L18.969 12.1588C18.3093 12.7115 17.5528 13.2302 16.695 13.6564L17.6286 15.0912C17.8545 15.4383 17.7562 15.9029 17.409 16.1288C17.0618 16.3547 16.5972 16.2564 16.3713 15.9092L15.2821 14.2353C14.5028 14.4898 13.659 14.6628 12.7499 14.7248V16.5002C12.7499 16.9144 12.4141 17.2502 11.9999 17.2502C11.5857 17.2502 11.2499 16.9144 11.2499 16.5002V14.7248C10.3689 14.6647 9.54909 14.5004 8.78982 14.2586L7.71575 15.9093C7.48984 16.2565 7.02526 16.3548 6.67807 16.1289C6.33089 15.903 6.23257 15.4384 6.45847 15.0912L7.37089 13.689C6.5065 13.2668 5.74381 12.7504 5.07842 12.1984L4.11744 13.1594C3.82455 13.4523 3.34968 13.4523 3.05678 13.1594C2.76389 12.8665 2.76389 12.3917 3.05678 12.0988L3.98055 11.175C3.15599 10.3153 2.53525 9.44675 2.10277 8.75486C1.83984 8.33423 1.6446 7.97584 1.51388 7.71988C1.44848 7.59182 1.3991 7.48914 1.36537 7.41683C1.3485 7.38067 1.33553 7.35207 1.32641 7.33167L1.31562 7.30729L1.31238 7.29984L1.31129 7.29733L1.31088 7.29638C1.31081 7.2962 1.31056 7.29563 1.99992 7.00019L1.31088 7.29638C1.14772 6.91565 1.32376 6.474 1.70448 6.31083C2.08489 6.1478 2.52539 6.32374 2.68888 6.70381C2.68882 6.70368 2.68894 6.70394 2.68888 6.70381L2.68983 6.706L2.69591 6.71972C2.7018 6.73291 2.7114 6.7541 2.72472 6.78267C2.75139 6.83983 2.79296 6.92644 2.84976 7.03767C2.96345 7.26029 3.13762 7.58046 3.37472 7.95979C3.85033 8.72067 4.57157 9.70728 5.55561 10.6218C6.42151 11.4265 7.48259 12.1678 8.75165 12.656C9.70614 13.0232 10.7854 13.2502 11.9999 13.2502C13.2416 13.2502 14.342 13.013 15.3124 12.631C16.5738 12.1345 17.6277 11.3884 18.4866 10.5822C19.4562 9.67216 20.1668 8.69535 20.6354 7.9434C20.869 7.5685 21.0405 7.25246 21.1525 7.03286C21.2085 6.92315 21.2494 6.83776 21.2757 6.78144C21.2888 6.75328 21.2983 6.73242 21.3041 6.71943L21.31 6.70595L21.3106 6.70475C21.3105 6.70485 21.3106 6.70466 21.3106 6.70475M22.2954 6.31083C21.9147 6.14771 21.4738 6.32423 21.3106 6.70475L22.2954 6.31083ZM2.68888 6.70381C2.68882 6.70368 2.68894 6.70394 2.68888 6.70381V6.70381Z" fill="#000000"></path>
           </g></svg>}
          </div>
       </div>
       </div>
       <div className="flex justify-center mt-3">
        <Button onClick={submit} className="px-33 h-8">
          Continue
        </Button>
       </div>
       <div className="flex justify-center -mt-3">
        <div className="text-sm text-gray-500">Already have an account? <Link to={"/signin"} className="underline">Sign in</Link></div>
       </div>
      </> :
      <>
       <div className="px-5">
        <div className="text-2xl font-semibold">
          OTP verification
        </div> 
        <div className="text-xs text-gray-500 mt-1">
          Please enter the OTP (One-Time-Password) sent to your
          registered email to complete your verification.
        </div>
       </div>
       <div>

       </div>     
       <div className="flex justify-center -mt-4">
         <InputOTP maxLength={6} value={code} onChange={(value)=>setCode(value)}>
          <InputOTPGroup>
           <InputOTPSlot index={0}></InputOTPSlot>
           <InputOTPSlot index={1}></InputOTPSlot>
           <InputOTPSlot index={2}></InputOTPSlot>
           <InputOTPSlot index={3}></InputOTPSlot>
           <InputOTPSlot index={4}></InputOTPSlot>
           <InputOTPSlot index={5}></InputOTPSlot>
          </InputOTPGroup>
         </InputOTP>
       </div>
       <div className="flex justify-center">
        <Button onClick={onPressVerify}>Submit</Button>
       </div>
      </>
      }
     </Card>
   )
}