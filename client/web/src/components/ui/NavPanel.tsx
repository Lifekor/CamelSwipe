import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as Boost } from '../images/boost.svg'
import { ReactComponent as Friends } from '../images/friends.svg'
import { ReactComponent as Home } from '../images/home.svg'
import { ReactComponent as Start } from '../images/start.svg'
import { ReactComponent as Tasks } from '../images/tasks.svg'


const NavPanel = () => {
	const navigate = useNavigate();
	const [activeLink, setActiveLink] = useState<string | null | boolean>(null);
	const location = useLocation();

	useEffect(() => {
		setActiveLink(location.pathname);
	}, [location.pathname]);
	/* const init = initUtils() */


  const handleRedirect = () => {
    navigate('/redirect-to-game');
  };

	return (
		<>
			<footer className="fixed bottom-0 left-0 w-full text-white z-10  font-Monsterrat bg-black rounded-t-3xl">
				<div className='w-full h-[65px] flex items-center justify-center rounded-t-2xl gap-8 pb-2'>

					<Link to={'/boost'}  className='flex flex-col items-center'>
						<Boost style={{ fill: activeLink === '/boost' ? 'white' : '#616161' }} className='pb-[3px]' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/boost' ? 'white' : '#616161' }}>Boost</p>
					</Link>

					<Link to={'/'} className='flex flex-col items-center'>
						<Home style={{ fill: activeLink === '/' ? 'white' : '#616161' }} className='pb-1' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/' ? 'white' : '#616161' }}>Home</p>
					</Link>

					<div  className='flex flex-col items-center' onClick={() => handleRedirect()}>
						<Start style={{ fill: activeLink === '/' ? 'white' : '#616161' }} className='h-[80px] w-[80px] mb-4' />
					</div>

					<Link to={'/tasks'} className='flex flex-col items-center'>
						<Tasks style={{ fill: activeLink === '/tasks' ? 'white' : '#616161' }} className='' />
						<p className='text-[10px] text-center  tracking-wider' style={{ color: activeLink === '/tasks' ? 'white' : '#616161' }}>Tasks</p>
					</Link>
				
					<Link to={'/friends'} className='flex flex-col items-center'>
						<Friends style={{ width: '27px', fill: activeLink === '/friends' ? 'white' : '#616161' }} />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/friends' ? 'white' : '#616161' }}>Friends</p>
					</Link>

					
					</div>
			</footer>
		</>
	)
}

export default NavPanel
