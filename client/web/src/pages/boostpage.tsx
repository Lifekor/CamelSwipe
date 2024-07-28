import BoostTable from '../components/ui/boostpage/boostTable'

const Boostpage = () => {
	return (
		<>
			<div className='h-[50px] items-center flex justify-center text-white text-2xl font-bold rounded-t-[30px] gap-2 bg-black bg-opacity-85'>
			Upgrades
		</div>

		<div className='h-full overflow-y-scroll pb-[150px] bg-myColor-700'>

		<div className='flex justify-center font-Montserrat'>
			  <div className='max-w-[350px] w-full'>
					<div className='mt-5'>
					<BoostTable/>
					</div>
			  </div>
		 </div>

		</div>
		</>
	)
}

export default Boostpage