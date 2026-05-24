import { Card } from "./ui/card"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import Loader from "./ui/loader"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useSignUp, useUser } from "@clerk/react-router"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function SignUpInput() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useUser()
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  if (isSignedIn) { navigate("/channels/@me"); return }
  if (!isLoaded) return <Loader />

  async function submit() {
    if (!isLoaded) return null
    setLoading(true)
    setError("")
    try {
      await signUp.create({ username, emailAddress: email, password })
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      setPendingVerification(true)
    } catch (err: any) {
      setError(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  async function onPressVerify() {
    if (!isLoaded) return null
    setLoading(true)
    setError("")
    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({ code })
      if (completeSignup.status === "complete") {
        await setActive({ session: completeSignup.createdSessionId })
        navigate("/channels/@me")
      }
    } catch (err: any) {
      setError(err.errors[0].message)
    } finally {
      setLoading(false)
    }
  }

  async function googleSignIn() {
    if (!isLoaded) return null
    setLoading(true)
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/channels/@me",
      })
    } catch (err: any) {
      setLoading(false)
    }
  }

  const GoogleIcon = () => (
    <svg width="16px" height="16px" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid">
      <path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/>
      <path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/>
      <path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/>
      <path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-[#313338] flex items-center justify-center w-screen px-4">
      <Card className="w-full max-w-sm bg-[#1E1F22] border-zinc-800/50 shadow-2xl p-6 space-y-5">
        {!pendingVerification ? (
          <>
            <div className="text-center space-y-1">
              <h1 className="text-xl font-bold text-white tracking-tight">Create your account</h1>
              <p className="text-sm text-zinc-400">Welcome! Please fill in the details to get started.</p>
            </div>

            <Button
              onClick={googleSignIn}
              disabled={loading}
              variant="outline"
              className="w-full bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700
                hover:text-white hover:border-zinc-600 gap-3 h-10 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-zinc-700/50" />
              <span className="text-xs text-zinc-600">or</span>
              <div className="flex-1 h-px bg-zinc-700/50" />
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Username
                </Label>
                <Input
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  disabled={loading}
                  placeholder="cooluser123"
                  className="bg-zinc-800/80 border-zinc-700/50 text-zinc-200 placeholder:text-zinc-600
                    focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/60 h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Email Address
                </Label>
                <Input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="you@example.com"
                  className="bg-zinc-800/80 border-zinc-700/50 text-zinc-200 placeholder:text-zinc-600
                    focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/60 h-10"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                    placeholder="••••••••"
                    className="bg-zinc-800/80 border-zinc-700/50 text-zinc-200 placeholder:text-zinc-600
                      focus-visible:ring-indigo-500/40 focus-visible:border-indigo-500/60 h-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500
                      hover:text-zinc-300 transition"
                  >
                    {showPassword
                      ? <EyeOff className="w-4 h-4" />
                      : <Eye className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                <p className="text-xs text-rose-400">{error}</p>
              </div>
            )}

            <Button
              onClick={submit}
              disabled={loading || !email || !password || !username}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white
                disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</>
                : "Continue"
              }
            </Button>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link to="/signin" className="text-indigo-400 hover:text-indigo-300 transition">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <h2 className="text-xl font-semibold text-white">OTP Verification</h2>
              <p className="text-xs text-zinc-400">
                Enter the 6-digit code sent to <span className="text-zinc-300">{email}</span>
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP maxLength={6} value={code} onChange={value => setCode(value)}>
                <InputOTPGroup>
                  {[0,1,2,3,4,5].map(i => (
                    <InputOTPSlot key={i} index={i}
                      className="bg-zinc-800 border-zinc-700 text-zinc-200" />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                <p className="text-xs text-rose-400">{error}</p>
              </div>
            )}

            <Button
              onClick={onPressVerify}
              disabled={loading || code.length < 6}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-500 text-white
                disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</>
                : "Submit"
              }
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}