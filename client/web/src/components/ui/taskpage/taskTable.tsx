import { initUtils } from '@tma.js/sdk'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNecessary } from '../../../hooks/necessary'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Coin } from '../../images/coin.svg'
import boost from '../../images/taskpage/boost.png'
import { ReactComponent as Discord } from '../../images/taskpage/discord.svg'
import friends from '../../images/taskpage/friends.png'
import { ReactComponent as Instagram } from '../../images/taskpage/instagram.svg'
import { ReactComponent as Telegram } from '../../images/taskpage/telegram.svg'
import { ReactComponent as TikTok } from '../../images/taskpage/tiktok.svg'
import { ReactComponent as Twitter } from '../../images/taskpage/twitter.svg'
import { ReactComponent as Welcome } from '../../images/taskpage/welcome.svg'
import { ReactComponent as Youtube } from '../../images/taskpage/youtube.svg'
import { missionsInterface } from '../../models'
const TaskTable = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const {identityId} = useNecessary()
  const [missions, setMissions] = useState<missionsInterface>()

  const api = useApi()

  const getMissions = async (): Promise<void> =>  {
    if (!identityId) return
    const res = await api<missionsInterface>({
      method: 'GET',
      url: '/mission/',
      headers: {
        "x-user-id": identityId
      }
    })
    if (res) {
      setMissions(res);
    }
  } 

  useEffect(() => {
    getMissions()
  }, [identityId])

  const startMission = async (id:string) => {
    const res = await api({
      method: 'POST',
      url: `/mission/navigate?mission_id=${id}`,
      headers: {
       'user-id': identityId
      }
    })
  }

  const checkMission = async (id:string) => {
    setLoading(true)
    try {
    const res = await api({
      method: 'POST',
      url: `/mission/check?mission_id=${id}`,
      headers: {
        'user-id': identityId
       }
    })
    await getMissions()
    setLoading(false)
   }catch(e) {
    setLoading(false)
    console.log(e);
  }
  }

  const claimMission = async (id:string) => {
    const res = await api({
      method: 'POST',
      url: `/mission/claim?mission_id=${id}`,
      headers: {
        'user-id': identityId
       }
    })
    await getMissions()
   /*  await getCoin() */
  }

  interface statusProps {
    status: string,
    id: string,
    link: string,
    type: string
  }

 const GetStatus = ({ status, id, link, type }: statusProps) => {
    const utils = initUtils()

    const handleButtonClick = async (id:string, link:string) => {
      try {
          if (type === 'Telegram') {
              utils.openTelegramLink(link)
              await startMission(id)
              getMissions()
            } else if(type === 'Friend') {
              navigate('/friends')
            } else if(type === 'Boost') {
              navigate('/')
            } else {
              utils.openLink(link)
              await startMission(id)
              getMissions()
            }
      } catch (error) {
        console.error('Error verifying reward', error);
      }
    };

    switch (status) {
      case 'open':
        return (
          <div>
            <div className='w-[50px] h-[30px] flex items-center justify-center'
            onTouchStart={() => handleButtonClick(id, link)}>
                  <Arrow className=''/>
            </div>
          </div>
        );
      case 'execution':
          return (
            <div className='w-[50px] h-[30px] flex items-center justify-center px-10 border border-myColor-400 text-myColor-400 rounded'>
            <p className='font-medium' onTouchStart={() => checkMission(id)}>Verify{loading && ('...')}</p>
            </div>
          );
      case 'verified':
        return (
          <div className='w-[50px] h-[30px] flex items-center justify-center px-10 border border-myColor-400 text-myColor-400 rounded'>
          <p className='font-medium' onTouchStart={() => claimMission(id)}>Claim</p>
          </div>
        );
      case 'completed':
        return (
          <div className='w-[50px] h-[30px] flex items-center justify-center border px-10 border-myColor-450 text-myColor-450 rounded'>
          <p className='font-bold text-[12px]'>Completed</p>
          </div>
        );

      default:
        return null;
    }
  };

  interface iconProps {
    icon: string
  }

  const GetIcon = ({ icon }:iconProps) => {
    switch (icon) {
      case 'Welcome':
      return <Welcome className='w-[30px]' />;
      case 'Youtube':
        return <Youtube className='w-[30px]' />;
      case 'Instagram':
        return <Instagram className='w-[30px]' />;
      case 'Discord':
        return <Discord className='w-[30px]' />;
      case 'Telegram':
        return <Telegram className='w-[30px]' />;
      case 'Tiktok':
        return <TikTok className='w-[30px]' />;
      case 'Twitter':
        return <Twitter className='w-[30px]' />;
      case 'Boost':
        return <img src={boost} className='w-[30px]' />;
      case 'Friend':
        return <img src={friends} alt='friends' className='w-[30px]' />;
      default:
        return null;
    }
  };

  
	return (
		<>
    <div className='h-[300px] overflow-y-scroll'>
    {missions?.data.map((mission) => (
      <div  className={`flex justify-between mt-5 items-center text-sm py-2 px-2 border-opacity-0 text-white bg-black rounded-3xl shadow-md shadow-myColor-150 h-[60px]`} >
      <div className='flex gap-2 items-center ml-2'>
       <GetIcon icon={mission.icon_type}/>
        <div className='flex-col ml-2'>
          <p className='font-medium text-[12px]'>{mission.name}</p>
            <div className='flex items-center'>
              <Coin className='ml-3'/>
              <p className='text-[13px] font-medium'>+{mission.reward}</p>
            </div>
          </div>
        </div>

        <GetStatus status={mission.status} type={mission.icon_type} id={mission.id} link={mission.id}/>
     </div>
    ))}
    </div>
		</>
	)
}

export default TaskTable