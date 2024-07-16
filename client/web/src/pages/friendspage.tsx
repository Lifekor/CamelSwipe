import { ReactComponent as Copy } from '../components/images/friendspage/copy.svg'
import InviteLink from '../components/ui/friendspage/inviteLink'
import InvitedTable from '../components/ui/friendspage/invitedTable'

const Friendspage = () => {
	return (
		<>
		  <p className='text-white font-bold pb-2 pt-2 border-b-[2px] text-xl font-Montserrat'>Friends</p>

		   <div className='flex justify-center font-Montserrat'>
			  <div className='max-w-[350px] w-full'>
					<div className='mt-4'>
						<InviteLink/>
					</div>

					<div className='mt-5'>
						<InvitedTable/>
					</div>

					<div className='flex justify-between flex-wrap items-center text-white mt-16'>

						<button className='bg-myColor-750 rounded-xl py-3 p-2 w-[270px] font-bold'>
							Invite a friend
						</button>

						<button className='bg-black p-2 px-3 py-2 rounded-xl'>
							<Copy/>
						</button>

					</div>

			  </div>
			</div>
		</>
	)
}

export default Friendspage