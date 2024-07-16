import { useTelegram } from '../../../hooks/useTelegram'
import CRTCoin from '../../images/friendspage/CRTCoin.png'

const InviteLink = () => {
  const {userId} = useTelegram()
/* 	const [link, setLink] = useState<string>(`https://t.me/12313123?start=${userId}`)
	const [copySuccess, setCopySuccess] = useState<string>('')

	const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopySuccess('Link copied')
      }).catch((error) => {
        setCopySuccess('Link not copied')
      })
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = link
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
 */
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

			{/* <div className='bg-myColor-150 p-2 px-5 mt-4 rounded-xl px-'>
				<p className='text-center text-[15px] text-white font-bold'>Your Invite Link</p>
				<div className='flex justify-between text-white items-center border border-myColor-300 rounded h-[25px] mt-1 px-3'>
					<input type='text' className='w-full text-[12px] items-center mr-3 bg-transparent outline-none' value={link} readOnly />
					<button onClick={() => copyToClipboard()}>Copy</button>
				</div>
				{copySuccess && (<p className='text-center mt-1 text-[12px] text-white'>{copySuccess}</p>)}
		  </div> */}
		</div>
		</>
	)
}

export default InviteLink