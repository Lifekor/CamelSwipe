import { initUtils } from '@tma.js/sdk'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNecessary } from '../../../hooks/necessary'
import { useTelegram } from '../../../hooks/useTelegram'
import useApi from '../../../requestProvider/apiHandler'
import { ReactComponent as Arrow } from '../../images/arrow.svg'
import { ReactComponent as Coin } from '../../images/coin.svg'
import { ReactComponent as Completed } from '../../images/taskpage/apply.svg'
import boost from '../../images/taskpage/boost.png'
import { ReactComponent as Close } from '../../images/taskpage/close.svg'
import { ReactComponent as Discord } from '../../images/taskpage/discord.svg'
import friends from '../../images/taskpage/friends.png'
import { ReactComponent as Instagram } from '../../images/taskpage/instagram.svg'
import { ReactComponent as Telegram } from '../../images/taskpage/telegram.svg'
import { ReactComponent as TikTok } from '../../images/taskpage/tiktok.svg'
import { ReactComponent as Twitter } from '../../images/taskpage/twitter.svg'
import { ReactComponent as Welcome } from '../../images/taskpage/welcome.svg'
import { ReactComponent as Youtube } from '../../images/taskpage/youtube.svg'
import { infoTaskModal, missionsInterface } from '../../models'

const TaskTable = () => {
  const navigate = useNavigate();
  const { identityId } = useNecessary();
  const [missions, setMissions] = useState<missionsInterface>();
  const [openModal, setOpenMondal] = useState<boolean>(false);
  const [verifying, setVerifyng] = useState<boolean>(false);
  const [infoForModal, setInfoForModal] = useState<infoTaskModal>({
    id: '',
    name: '',
    reward: 0,
    link: '',
    status: '',
    icon_type: ''
  });
  const { tg } = useTelegram();

  const api = useApi();

  const getMissions = async (): Promise<void> => {
    if (!identityId) return;
    const res = await api<missionsInterface>({
      method: 'GET',
      url: '/mission/',
      headers: {
        "x-user-id": identityId
      }
    });
    if (res) {
      setMissions(res);
      if (openModal) {
        const updatedMission = res.data.find(mission => mission.id === infoForModal.id);
        if (updatedMission) {
          setInfoForModal({
            id: updatedMission.id,
            name: updatedMission.name,
            reward: updatedMission.reward,
            link: updatedMission.link,
            status: updatedMission.status,
            icon_type: updatedMission.icon_type
          });
        }
      }
    }
  };

  useEffect(() => {
    getMissions();
  }, [identityId]);

  const saveInfoForModal = (id: string, name: string, reward: number, link: string, status: string, icon_type: string) => {
    setInfoForModal({ id, name, reward, link, status, icon_type });
    setOpenMondal(true);
  };

  const startMission = async (id: string) => {
    await api({
      method: 'POST',
      url: `/mission/navigate?mission_id=${id}`,
      headers: {
        'x-user-id': identityId
      }
    });
    getMissions(); 
  };

  const checkMission = async (id: string) => {
    setVerifyng(true);
    try {
      await api({
        method: 'POST',
        url: `/mission/check?mission_id=${id}`,
        headers: {
          'x-user-id': identityId
        }
      });
      await getMissions();
    } catch (e) {
      console.log(e);
    } finally {
      setVerifyng(false);
    }
  };

  const claimMission = async (id: string) => {
    await api({
      method: 'POST',
      url: `/mission/claim?mission_id=${id}`,
      headers: {
        'x-user-id': identityId
      }
    });
    await getMissions();
  };

  interface statusProps {
    status: string;
    id: string;
    link: string;
    type: string;
  }

  const GetStatus = ({ status, id, link, type }: statusProps) => {
    const utils = initUtils();
    const { tg } = useTelegram();
    const eventHandler = tg.platform === 'tdesktop' ? 'onClick' : 'onTouchStart';

    const handleButtonClick = async (id: string, link: string) => {
      try {
        if (type === 'Telegram') {
          utils.openTelegramLink(link);
          await startMission(id);
        } else if (type === 'Friend') {
          navigate('/friends');
        } else if (type === 'Boost') {
          navigate('/');
        } else {
          utils.openLink(link);
          await startMission(id);
        }
        getMissions();
      } catch (error) {
        console.error('Error verifying reward', error);
      }
    };

    switch (status) {
      case 'open':
        return (
          <div>
            <div
              className='w-[200px] h-[45px] flex items-center justify-center bg-myColor-800 rounded-2xl border border-myColor-850 font-medium cursor-pointer'
              {...{ [eventHandler]: () => handleButtonClick(id, link) }}
            >
              <p>Execute</p>
            </div>
          </div>
        );
      case 'execution':
        return (
          <>
            {verifying ? (
              <p className='text-xl text-center font-medium px-5'>Checking if the task is completed, <br /> please wait</p>
            ) : (
              <div
                className='w-[110px] h-[45px] flex items-center justify-center bg-myColor-900 rounded-2xl border border-myColor-950 font-medium cursor-pointer'
                {...{ [eventHandler]: () => checkMission(id) }}
              >
                <p>Check</p>
              </div>
            )}
          </>
        );
      case 'verified':
        return (
          <div
            className='w-[100px] h-[45px] flex items-center justify-center bg-myColor-800 rounded-2xl border border-myColor-850 font-medium cursor-pointer'
            {...{ [eventHandler]: () => claimMission(id) }}
          >
            <p className='font-medium'>Claim</p>
          </div>
        );
      case 'completed':
        return (
          <div className='w-[110px] h-[45px] flex items-center justify-center bg-myColor-900 rounded-2xl border border-myColor-950 font-medium opacity-35'>
            <Completed />
          </div>
        );
      default:
        return null;
    }
  };

  interface iconProps {
    icon: string;
    width: number;
  }

  const GetIcon = ({ icon, width }: iconProps) => {
    switch (icon) {
      case 'Welcome':
        return <Welcome className={`w-[${width}px]`} />;
      case 'YouTube':
        return <Youtube className={`w-[${width}px]`} />;
      case 'Instagram':
        return <Instagram className={`w-[${width}px]`} />;
      case 'Discord':
        return <Discord className={`w-[${width}px]`} />;
      case 'Telegram':
        return <Telegram className={`w-[${width}px]`} />;
      case 'Tiktok':
        return <TikTok className={`w-[${width}px]`} />;
      case 'X':
        return <Twitter className={`w-[${width}px]`} />;
      case 'Boost':
        return <img src={boost} className={`w-[${width}px]`} />;
      case 'Friend':
        return <img src={friends} alt='friends' className={`w-[${width}px]`} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className='h-[330px] h-xs:h-[280px] overflow-y-scroll'>
        {missions?.data.map((mission) => (
          <div className={`flex justify-between mt-2 items-center text-sm py-2 px-2 border-opacity-0 text-white bg-black rounded-3xl shadow-md shadow-myColor-150 h-[60px] h-xs:h-[50px]`}>
            <div className='flex gap-2 items-center ml-2'>
              <GetIcon icon={mission.icon_type} width={35} />
              <div className='flex-col'>
                <p className='font-medium text-[12px]'>{mission.name}</p>
                <div className='flex items-center'>
                  <Coin />
                  <p className='text-[13px] font-medium'>+{mission.reward}</p>
                </div>
              </div>
            </div>
            <div className='w-[50px] h-[30px] flex items-center justify-center'>
              <Arrow className='cursor-pointer' onClick={() => saveInfoForModal(mission.id, mission.name, mission.reward, mission.link, mission.status, mission.icon_type)} />
            </div>
          </div>
        ))}
      </div>

      {openModal && (
        <div className='fixed bottom-0 w-full bg-myColor-150 h-[60vh] left-0 z-[999] rounded-t-[30px] px-5 py-4'>
          <div className='w-full flex justify-end cursor-pointer'>
            <Close className='float-right w-[30px] h-[30px]' onClick={() => setOpenMondal(false)} />
          </div>
          <div className='flex flex-col justify-center items-center'>
            <div className='w-[120px]'>
              <GetIcon icon={infoForModal.icon_type} width={130} />
            </div>
            <p className='text-2xl w-[200px] text-center font-medium'>{infoForModal.name}</p>
            <div className='flex mt-7 items-center gap-2 w-full justify-center relative'>
              <div className='w-[150px] h-[25px] absolute bg-myColor-700 rounded-full blur-lg z-0' style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              <Coin className='w-[35px] h-[35px] z-10' />
              <p className='text-2xl font-medium relative z-10'>+{infoForModal.reward}</p>
            </div>
            <div className='absolute bottom-5'>
              <GetStatus status={infoForModal.status} id={infoForModal.id} link={infoForModal.link} type={infoForModal.icon_type} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskTable;
