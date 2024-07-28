import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import balance from '../components/images/balance.png'
import { idInterface } from '../components/models'
import useStore from '../components/store/zustand'
import '../components/ui/background.css'
import NavPanel from '../components/ui/NavPanel'
import useApi from '../requestProvider/apiHandler'
import { abbreviateNumber } from './convertNumber'
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
      url: `/auth/sign-in?user_id=${111}&username=${user !== null ? user : 111}`
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
      <div className='flex justify-between w-full mt-10 px-5 text-white font-Montserrat items-center'>

        <div className='p-1 bg-gray-gradient rounded-2xl px-3 border '>
          {user}
        </div>

        <div className='relative'>
          <img src={balance} alt="" />
          <p className='absolute left-[53px] top-[7px]'>{abbreviateNumber(0)}</p>
        </div>
        
      </div>
    <div className='background'/>
		<div className='fixed w-full h-[83vh] rounded-t-[30px] bottom-0 font-Montserrat'>
					{children}
					<NavPanel/>
		</div>
    </NavContext.Provider>
  );
};
