import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { routes } from './routes/routes'
import { ToastContainer } from 'react-toastify'

const App = () => {

    return (
        <>
        <ToastContainer/>
        <RouterProvider router={routes}/>
        </>
    )
}

export default App