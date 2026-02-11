import { SignInButton,SignUpButton } from "@clerk/clerk-react"

export function Home(){
    return (
        <div className="">
          <div>
           Welcone to Landing Page
           ERRORS FIX: SENDING clerkuserid in initiateprofile hook 
           <SignUpButton></SignUpButton>
           <SignInButton></SignInButton>
          </div>
        </div>
    )
}