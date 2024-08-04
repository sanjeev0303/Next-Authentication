 "use client"

import UserInfo from '@/components/UserInfo'
import { useCurrentUser } from '@/hooks/user-current-user'
import React from 'react'

const ClientPage = () => {

    const user = useCurrentUser()

  return (
    <div className='text-white'>
        <UserInfo user={user} label="📱 Client component" />
    </div>
  )
}

export default ClientPage