import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import {InputOTP,InputOTPGroup,InputOTPSlot} from "./ui/input-otp"
import {Label} from "./ui/label"
import Loader from "./ui/loader"
import { Link,useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSignIn,useUser } from "@clerk/react-router"

export default function SignInInput(){
  const {isLoaded,setActive,signIn}=useSignIn()
  const {isSignedIn}=useUser()
  const [email,setEmail]=useState("")
  const [error,setError]=useState("")
  const [code,setCode]=useState("")
  const [pendingVerification,setPendingVerification]=useState(false)
  const navigate=useNavigate()
    
  if(isSignedIn){
    navigate("/channels/@me")
    return 
  } 
  if(!isLoaded) return <Loader/>

  async function submit(){
    if(!isLoaded) return null
    try{
     await signIn.create({
      strategy:"email_code", 
      identifier:email,
     })
     setPendingVerification(true)
     }catch(err:any){
     console.log(err)
     setError(err.errors[0].message)
    }
  } 
 
  async function onPressVerify(){
    if(!isLoaded) return null
    try{
      const completesignIn=await signIn.attemptFirstFactor({
      strategy:"email_code",
      code
    })
    if(completesignIn.status !== "complete"){
      console.log(completesignIn)
    }
    if(completesignIn.status === "complete"){
      console.log(completesignIn)
      await setActive({
        session:completesignIn.createdSessionId
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
     await signIn.authenticateWithRedirect({
      strategy:"oauth_google",
      redirectUrl:"/sso-callback",
      redirectUrlComplete:"/channels/@me"
    })
    }catch(err){
     console.log(err)
    }
  }
  return (
     <Card className="w-full max-w-sm">
      {!pendingVerification ? 
      <>
       <div className="text-gray-800 text-xl text-center font-bold tracking-tight">
          Welcome back!
       </div>
       <div className="text-center text-sm text-slate-500 font-normal tracking-tight -mt-4">
          We're excited to see you again!
       </div>
       <div className="flex justify-center mt-2 "> 
          <Button onClick={googleSignIn} variant="outline" className="bg-white text-gray-600 text-sm font-semibold gap-4 px-20 h-8 ">
            <span>
              <svg width="64px" height="64px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000">
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
              <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"></path>
              <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"></path>
              <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"></path>
              <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"></path></g></svg>
            </span> Continue with Google
          </Button>
       </div>
       <div className="inline-flex items-center justify-center w-full">
         <hr className="w-81 h-px my-2 bg-gray-200 border-0 dark:bg-gray-700"/>
         <span className="absolute px-3 text-sm font-medium -mt-1 text-gray-500 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">or</span>
       </div>
       <div className="px-7 -mt-6">
        <Label className="my-2">Email Address</Label>
        <Input  value={email} onChange={(e)=>setEmail(e.target.value)} className="text-sm text-gray-800 font-normal"></Input>
       </div>
       <div className="flex justify-center mt-3">
        <Button onClick={submit} className="px-33 h-8">
          Continue
        </Button>
       </div>
       <div className="flex justify-center -mt-3">
        <div className="text-sm text-gray-500">Don't have an account? <Link to={"/signup"} className="underline">Sign up</Link></div>
       </div>
      </>
        : 
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