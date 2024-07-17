import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ReactComponent as Friends } from '../images/friends.svg'
import { ReactComponent as Home } from '../images/home.svg'
import rocket from '../images/rocket.png'
import { ReactComponent as Tasks } from '../images/tasks.svg'


const NavPanel = () => {
	const [activeLink, setActiveLink] = useState<string | null | boolean>(null);
	const location = useLocation();

	useEffect(() => {
		setActiveLink(location.pathname);
	}, [location.pathname]);

	return (
		<>
			<footer className="fixed bottom-0 left-0 w-full text-white px-4 z-10  font-Monsterrat">
				<div className='w-full h-[65px] flex items-center justify-center rounded-t-xl gap-10 pb-2'>

					<Link to={'/'}  className='flex flex-col items-center'>
						<Home style={{ fill: activeLink === '/' ? 'white' : '#616161' }} className='pb-[3px]' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/' ? 'white' : '#616161' }}>Home</p>
					</Link>

					{/* <Link to={'/wallet'} className='flex flex-col items-center'>
						<Wallet style={{ fill: activeLink === '/wallet' ? 'white' : '#616161' }} className='pb-1' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/wallet' ? 'white' : '#616161' }}>Wallet</p>
					</Link>

					<Link to={'/admin'} className='flex flex-col items-center'>
						<Admin style={{ fill: activeLink === '/admin' ? 'white' : '#616161' }} className='pb-1 w-[30px]' />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/admin' ? 'white' : '#616161' }}>Admin</p>
					</Link> */}

					<Link to={'/tasks'} className='flex flex-col items-center'>
						<Tasks style={{ fill: activeLink === '/tasks' ? 'white' : '#616161' }} className='ml-2' />
						<p className='text-[10px] text-center  tracking-wider' style={{ color: activeLink === '/tasks' ? 'white' : '#616161' }}>Tasks</p>
					</Link>
				
					<Link to={'/friends'} className='flex flex-col items-center'>
						<Friends style={{ fill: activeLink === '/friends' ? 'white' : '#616161' }} />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/friends' ? 'white' : '#616161' }}>Friends</p>
					</Link>

					<Link to={'/boost'} className='flex flex-col items-center'>
						<img src={rocket} className='w-[30px]' style={{ fill: activeLink === '/boost' ? 'white' : '#616161' }} />
						<p className='text-[10px] text-center tracking-wider' style={{ color: activeLink === '/boost' ? 'white' : '#616161' }}>Upgrades</p>
					</Link>

					
					</div>
			</footer>
		</>
	)
}

export default NavPanel
