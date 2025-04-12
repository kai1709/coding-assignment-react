import { User, UserContextType } from '@acme/shared-models'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

export const UserContext = React.createContext<UserContextType>({ state: { users: [] }, actions: () => { } })

export default ({ children }: { children: any }) => {
  const [isLoading, setIsLoading] = useState(false)

  const [userData, setUserData] = useState<User[]>([])
  const getUserData = async () => {
    setIsLoading(true)
    const data = await axios.get('/api/users');
    setUserData(data.data)
    setIsLoading(false)
  }

  useEffect(() => {
    getUserData()
  }, [])

  const providerValue = {
    state: {
      users: userData,
      isLoading,
    },
    actions: {
      getUserData: getUserData
    },
  }
  return <UserContext.Provider value={providerValue}>{children}</UserContext.Provider>
}
