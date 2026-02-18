import { createRoot } from "react-dom/client";
import "./index.css"
import App from "./App";
import { AuthProvider } from "./contextApi/Authcontext";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App/>
    </AuthProvider>
)