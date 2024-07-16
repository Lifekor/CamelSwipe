import { useState } from 'react'
import useApi from '../../../requestProvider/apiHandler'
import { friends, friendsData } from '../../models'
const InvitedTable = () => {
	const api = useApi()
	const [friends, setFriends] = useState<friendsData[]>([])
	const [referal, setReferal] = useState<string>('')

	const getFriends = async():Promise<void> => {
		const res = await api<friends>({
			url: '/friend/',
			method: 'GET',

		})
		if (res) {
			setFriends(res.data)
			setReferal(res.user_inviter)
		}
	}


	return (
		<>
			{/* <div className='bg-myColor-150 p-2 px-5 rounded-xl'>
				<div className='w-full h-[25px] px-1 rounded text-white flex items-center justify-between font-light text-sm'>
					<p className='opacity-75'>Your Inviter :</p>
					<p className='opacity-75'>@{referal}</p>
				</div>
		  </div> */}
		<div className='text-white mt-5'>
			<p className='text-center font-bold text-lg'>My friends</p>

			<div className='mt-4'>

					<div className='border-b pb-2 flex justify-between border-opacity-50 mt-3' >
						<div className='flex gap-3 items-center'>
							<p className='text-sm'>rokky822</p>
						</div>
						<div className='flex gap-1 items-center'>
						<p className=''>+ 5.000 coins</p>
						</div>
					</div>

			</div>
		</div>
		</>
	)
}

export default InvitedTable