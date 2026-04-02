import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from './contextApi/ThemeContext'
import { AuthProvider } from './contextApi/Authcontext'

const App = () => {

    return (
        <>
        <AuthProvider>
            <ThemeProvider>
                <ToastContainer/>
                <RouterProvider router={routes}/>
            </ThemeProvider>
        </AuthProvider>
        </>
    )
}

export default App