import reward from '../../images/boostpage/reward.png'
import speedCamel from '../../images/boostpage/speedCamel.png'
import { ReactComponent as Star } from '../../images/boostpage/star.svg'
import waterCamel from '../../images/boostpage/waterCamel.png'
const Stars = () => {
	return (
		<>
		<Star className='w-[16px] text-myColor-700' />
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		<Star className='w-[16px]'/>
		</>
	)
}
const BoostTable = () => {
	return (
		<>
		<div className='flex flex-col gap-3 h-[400px] text-white'>

		 <div className='bg-black h-[100px] rounded-2xl px-4 py-1 flex justify-between'>
			<div className='text-left'>
		    <p className='text-lg'>Speed</p>
				<p className='text-[10px] opacity-80'>For each upgrade, +5% to speed</p>
				<div className='relative mt-1'>
				<div className='flex gap-1 items-center'>

				<div>
				<img src={reward} alt="" className='w-[55px]' />
				</div>

				<div className='flex'>
					<Stars/>
				</div>

				</div>
				<p className='absolute top-1 left-1 text-[13px] text-center w-[22px]'>1k</p>
				</div>
			</div>

			<div className='relative'>
				<img src={speedCamel} alt="" className='w-[80px] z-10 relative p-2' />
				<div className='absolute w-[80px] inset-0 bg-myColor-700 h-[50px] top-5 left-0 rounded-full blur-lg'></div>
			</div>

		 </div>

		 <div className='bg-black h-[100px] rounded-2xl px-4 py-1 flex justify-between'>
			<div className='text-left'>
		    <p className='text-lg'>Stamina</p>
				<p className='text-[10px] opacity-80'>Increase your water supply</p>
				<div className='relative mt-1'>
				<div className='flex gap-1 items-center'>

				<div>
				<img src={reward} alt="" className='w-[55px]' />
				</div>

				<div className='flex'>
					<Stars/>
				</div>

				</div>
				<p className='absolute top-1 left-1 text-[13px] text-center w-[22px]'>1k</p>
				</div>
			</div>

			<div className='relative'>
				<img src={waterCamel} alt="" className='w-[80px] z-10 relative p-3' />
				<div className='absolute w-[80px] inset-0 bg-myColor-700 h-[60px] top-5 blur-lg  rounded-full '></div>
			</div>

		 </div>

		</div>
		</>
	)
}

export default BoostTable