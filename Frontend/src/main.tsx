import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/react-router'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './components/modal-provider.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
 <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl={"/"} signUpForceRedirectUrl={"/channels/@me"} signInForceRedirectUrl={"/channels/@me"}>
        <ModalProvider/>
        <App />
      </ClerkProvider> 
    </BrowserRouter>
 </StrictMode>
)
