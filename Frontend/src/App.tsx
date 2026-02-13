import { Routes,Route,Navigate } from "react-router-dom"
import {Home} from "./pages/home"
import {Signup} from "./pages/signup"
import {Signin} from "./pages/singin"
import { ChannelLayout } from "./pages/channelLayout"
import {HomeLayout} from "./pages/homeLayout"
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
      <Route path={"/channels"} element={<ChannelLayout/>}>
       <Route index element={<Navigate to={"@me"} replace/>}/>
       <Route path="@me" element={<HomeLayout/>}></Route>
       <Route path=":serverId" element={<ServerPage/>}/>
      </Route>
      <Route path={`/invite/:inviteCode`} element={<InviteCodePage/>}/>
      <Route path={"/sso-callback"} element={<SSOcallback/>}></Route>
     </Routes>
   </div>
  )
}

export default App
