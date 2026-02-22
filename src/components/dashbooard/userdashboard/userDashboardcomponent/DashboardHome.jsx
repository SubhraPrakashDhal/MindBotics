import axios from 'axios'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../../../../customHooks/useAuth'

const DashboardHome = () => {

  const id = useParams()
  
  const {currentUser} = useAuth()

  return (
    <div className='w-[100%] h-[100%] p-6 '>
        <div className='w-[100%] h-[20%] bg-orange-400 rounded-xl px-8 py-5 capitalize '>
            <h1 className='text-[35px] font-semibold '>welcome to mindbotics {currentUser.username} </h1>
            <p>Powering the Next Generation of Robotics Innovators.</p>
        </div>
    </div>
  )
}

export default DashboardHome