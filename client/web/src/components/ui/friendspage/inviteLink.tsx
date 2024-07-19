import CRTCoin from '../../images/friendspage/CRTCoin.png'

const InviteLink = () => {

	return (
		<>
		<div>
      
		  <div className='bg-myColor-150 p-2 px-4 rounded-xl flex justify-between items-center shadow-md shadow-black'>
				<p className='text-center text-[13px] leading-[1rem] w-[160px] text-white'>Invite friends and receive 100 points for every friend registration. You can also receive bonuses for completed missions by your friends</p>

        <div className='relative'>
        <img src={CRTCoin} alt="" className='relative w-[100px] h-[65px] z-10' />
        <div className='absolute top-4 bg-myColor-700 w-[70px] h-[60px] inset-0 blur-lg left-4 rounded-full'></div>
        </div>

		  </div>

		</div>
		</>
	)
}

export default InviteLink