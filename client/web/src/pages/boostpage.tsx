import BoostTable from '../components/ui/boostpage/boostTable'



const Boostpage = () => {
	return (
		<>
		 <p className='text-white font-bold pb-2 pt-2 border-b-[1px] text-xl font-Montserrat border-black'>Upgrades</p>
		 <div className='flex justify-center font-Montserrat'>
			  <div className='max-w-[350px] w-full'>
					<div className='mt-5'>
					<BoostTable/>
					</div>
			  </div>
		 </div>
		</>
	)
}

export default Boostpage