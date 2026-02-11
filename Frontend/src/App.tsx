import { Routes,Route } from "react-router-dom"
import {Home} from "./pages/home"
import {Signup} from "./pages/signup"
import {Signin} from "./pages/singin"
import {Channels} from "./pages/channels"
import { ServerPage } from "./pages/serverPage"
import { InviteCodePage } from "./pages/invite-code-page"
import { SSOcallback } from "./pages/sso-callback"

function App() {
  return (
   <div className="min-h-screen">
     <Routes>
      <Route path={"/"} element={<Home/>}/>
      <Route path={"/signup"} element={<Signup/>}/>
      <Route path={"/signin"} element={<Signin/>}/>
      <Route path={"/channels/@me"} element={<Channels/>}></Route>
      <Route path={`/channels/:serverId`} element={<ServerPage/>}/>
      <Route path={`/invite/:inviteCode`} element={<InviteCodePage/>}/>
      <Route path={"/sso-callback"} element={<SSOcallback/>}></Route>
     </Routes>
   </div>
  )
}

export default App
