import UserInfo from '@/components/UserInfo'
import { currentUser } from '@/lib/auth'

const ServerPage = async () => {

   const user = await currentUser()

  return (
    <div className='text-white'>
        <UserInfo user={user} label="💻 Server component" />
    </div>
  )
}

export default ServerPage