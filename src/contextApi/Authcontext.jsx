import { createContext, useState } from "react";


export const Authcontext = createContext()
export const AuthProvider =({children})=> {

    const [currentUser, setCurrentUser] = useState("")
    const [loggedin,setloggedin] = useState(JSON.parse(localStorage.getItem("mindbrain_token"))? true :false)
    
     const login = ()=>{
            setloggedin(true)
        }

        const logout =()=>{
            setloggedin(false)
        }


    return(
        <Authcontext.Provider value={{loggedin,login,logout,currentUser, setCurrentUser}}>
            {children}
        </Authcontext.Provider>
    )
}