import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import background from '../components/images/background.png'
import { idInterface } from '../components/models'
import useStore from '../components/store/zustand'
import NavPanel from '../components/ui/NavPanel'
import useApi from '../requestProvider/apiHandler'
import { useTelegram } from './useTelegram'

interface NavContextType {
  identityId: string;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const useNecessary = () => {

  const context = useContext(NavContext);

  if (context === undefined) {
    throw new Error('useNecessary must be used within a NavPanelProvider');
  }
  return context;
};

interface NavPanelProviderProps {
  children: ReactNode;
}

export const NavPanelProvider = ({ children }: NavPanelProviderProps) => {
  const api = useApi()
  const [identityId, setIdentityId] = useState<string>('')
  const {updateRole} = useStore()

  const id = 2010808497
  const {userId, user, name} = useTelegram()
  const once = useRef<boolean>(false)


  const getId = async (): Promise<void> => {
    const res = await api<idInterface>({
      method: 'POST',
      url: `/auth/sign-in?user_id=${userId}&username=${user !== null ? user : name}`
    })
    if (res) {
      updateRole(res?.role)
      setIdentityId(res?.user_id)
    }
  }

  useEffect(() => {
    if (!once.current) {
      getId()
      once.current = true
    }
  }, [])

  return (
    <NavContext.Provider value={{identityId}}>
    <div className='relative'>
    <img src={background} alt="" className='w-full' />
      <div className='absolute w-full z-10 top-36'>
        <div className="bg-myColor-700 rounded-t-3xl text-center w-full pb-[100px]">
          {children}
        </div>
      </div>
    </div>
    <NavPanel />
    </NavContext.Provider>
  );
};
