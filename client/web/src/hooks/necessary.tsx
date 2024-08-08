import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import balance from '../components/images/balance.png'
import { ReactComponent as Boost } from '../components/images/boost.svg'
import { getDataInterface, idInterface } from '../components/models'
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
  const {updateRole, updateCurrentCoin, currentCoin} = useStore()
  const location = useLocation()
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

  const getData = async () => {
    const res = await api<getDataInterface>({
      url: '/auth/get-data',
      method: "GET",
      headers: {
        'x-user-id': identityId
    }
  })
    if (res) {
      updateCurrentCoin(res?.current_coin)
    }
  }
  

  useEffect(() => {
    if (!once.current) {
      getId()
      once.current = true
    }
  }, [])

  useEffect(() => {
    if (identityId) {
      getData()

    }
  }, [identityId])

  return (
    <NavContext.Provider value={{identityId}}>
      {location.pathname !== '/' ? (
        <>
        <div className='flex justify-between w-full mt-10 px-5 text-white font-Montserrat items-center'>

          <Link to={'/boost'}  className='flex items-center bg-gray-gradient px-3 py-[2px] gap-1 border rounded-2xl'>
              <Boost className='pb-[3px]' />
              <p className='text-[12px] text-center tracking-wider'>Boost</p>
          </Link>


          <div className='relative'>
            <img src={balance} alt="" />
            <p className='absolute left-[53px] top-[7px]'>{abbreviateNumber(currentCoin)}</p>
          </div>
          
        </div>
        <div className='background'/>
        <div className='fixed w-full h-[83vh] rounded-t-[30px] bottom-0 font-Montserrat'>
            {children}
            <NavPanel/>
        </div>
        </>
      ) : (
        <>
          <div className='w-full font-Montserrat'>
              {children}
              <NavPanel/>
          </div>
        </>
      )} 
      
    </NavContext.Provider>
  );
};
