import { useEffect, useState } from 'react'
import { useNecessary } from '../../../hooks/necessary'
import useApi from '../../../requestProvider/apiHandler'
import { friends, friendsData } from '../../models'
const InvitedTable = () => {
	const api = useApi()
	const [friends, setFriends] = useState<friendsData[]>([])
	const [referal, setReferal] = useState<string>('')
	const {identityId} = useNecessary()

	const getFriends = async():Promise<void> => {
		if (!identityId) return
		const res = await api<friends>({
			url: '/friend/',
			method: 'GET',
			headers: {
				'x-user-id': identityId
			}
		})
		if (res) {
			console.log(res);
			setFriends(res.data)
			setReferal(res.user_inviter)
		}
	}

	useEffect(() => {
		getFriends()
	}, [identityId])


	return (
		<>
			<div className='bg-myColor-150 p-2 px-5 rounded-xl shadow-md shadow-black'>
				<div className='w-full h-[25px] px-1 rounded text-white flex items-center justify-between font-light text-sm'>
					<p className='opacity-75'>Your Inviter :</p>
					<p className='opacity-75'>@{referal}</p>
				</div>
		  </div>

		<div className='text-white mt-5'>
			<p className='text-center font-bold text-lg'>My friends</p>
			<div className=''>
			{friends.map((friend, index) => (
				<div className='mt-4' key={index}>

				<div className='border-b pb-2 flex justify-between border-opacity-50 mt-3' >
					<div className='flex gap-3 items-center'>
						<p className='text-sm'>{friend.referral_username}</p>
					</div>
					<div className='flex gap-1 items-center'>
					<p className=''>+ {friend.missions_finished} coins</p>
					</div>
				</div>

		  </div>
			  ))}
				</div>
		</div>
		</>
	)
}

export default InvitedTable