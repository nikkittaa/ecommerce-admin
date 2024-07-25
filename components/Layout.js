import { useSession, signIn } from "next-auth/react"
import Nav from "./Nav";
import { useState } from "react";
import Logo from "./Logo";

export default function Layout({children}) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);
  
  if(!session){
    return (
      <div className="bg-gray-400 w-screen h-screen flex items-center">
        <div className = 'text-center w-full'>
          <button onClick = {() => signIn('google')} className = 'bg-white p-2 px-4 rounded-lg'>Login with Google</button>
        </div>
      </div>
    );
  }

  return(
    <div className = 'bg-gray-100 min-h-screen '>
      <div className = 'flex px-2 pt-4 block md:hidden gap-2'>
      <button onClick = {() => setShowNav(true)}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>

      </button>
      <div className = 'flex grow justify-center mr-6'><Logo/></div>
      </div>
      <div className = 'flex'>
      <Nav show = {showNav}/>
      <div className = 'mt-2 mr-2 mb-2 rounded-lg p-4 bg-white flex-grow h-screen'>
        {children}
      </div>
    </div>
    </div>
    
  );
  
}
