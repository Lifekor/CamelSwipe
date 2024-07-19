import { initUtils } from '@tma.js/sdk'
import { useState } from 'react'
import { ReactComponent as Copy } from '../components/images/friendspage/copy.svg'
import InviteLink from '../components/ui/friendspage/inviteLink'
import InvitedTable from '../components/ui/friendspage/invitedTable'
import { useTelegram } from '../hooks/useTelegram'
const Friendspage = () => {
const utils = initUtils()
const {userId} = useTelegram()
const shareUrl = `https://t.me/cameldevmainopsbot?start=${userId}`
const [copySuccess, setCopySuccess] = useState<string>('')

const handleShareClick = () => {
	if (userId) {
		utils.openLink(`https://telegram.me/share/url?url=${encodeURIComponent(shareUrl)}`);
	} else {
		console.error('User ID is not available.');
	}
};

const copyToClipboard = () => {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(shareUrl).then(() => {
			setCopySuccess('Link copied')
		}).catch((error) => {
			setCopySuccess('Link not copied')
		})
	} else {
		const textarea = document.createElement('textarea')
		textarea.value = shareUrl
		document.body.appendChild(textarea)
		textarea.select()
		try {
			document.execCommand('copy')
			setCopySuccess('Link copied')
		} catch (error) {
			setCopySuccess('Link not copied')
		}
		document.body.removeChild(textarea)
	}
	setTimeout(() => setCopySuccess(''), 2000)
}

	return (
		<>
		  <p className='text-white font-bold pb-2 pt-2 border-b-[1px] text-xl font-Montserrat border-black'>Friends</p>

		   <div className='flex justify-center font-Montserrat'>
			  <div className='max-w-[350px] w-full'>
					<div className='mt-4'>
						<InviteLink/>
					</div>

					<div className='mt-5'>
						<InvitedTable/>
					</div>

					<div className='flex justify-between flex-wrap items-center text-white mt-12'>

						<button className='bg-myColor-750 rounded-xl py-3 p-2 w-[280px] font-bold' onClick={() => handleShareClick()}>
							Invite a friend
						</button>

						<button className='bg-black p-2 px-3 py-3 rounded-xl' onClick={() => copyToClipboard()}>
							<Copy/>
						</button>

					</div>
			  </div>
				
			</div>
		</>
	)
}

export default Friendspage