import { useContext } from "react"
import { Authcontext } from "../contextApi/Authcontext"

export const useAuth = () => {
  const authcontext = useContext(Authcontext)

  if (!authcontext) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return authcontext
}
