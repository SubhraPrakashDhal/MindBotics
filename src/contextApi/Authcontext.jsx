import { createContext, useEffect, useState } from "react";

export const Authcontext = createContext()
export const AuthProvider =({children})=> {

    const [currentUser, setCurrentUser] = useState("")
    // ❌ JSON.parse hata diya
    const [loggedin,setloggedin] = useState(!!localStorage.getItem("mindbrain_token"))
    
     const login = ()=>{
            setloggedin(true)
        }

        const logout =()=>{
            setloggedin(false)
        }

    // ✅ refresh pe token ke saath sync rahe
    useEffect(() => {
      setloggedin(!!localStorage.getItem("mindbrain_token"))
    }, [])

    return(
        <Authcontext.Provider value={{loggedin,login,logout,currentUser, setCurrentUser}}>
            {children}
        </Authcontext.Provider>
    )
}
