import { useEffect, useState } from 'react'
import { abbreviateNumber } from '../../../hooks/convertNumber'
import { useNecessary } from '../../../hooks/necessary'
import useApi from '../../../requestProvider/apiHandler'
import pointsbonus from '../../images/boostpage/pointsbonus.png'
import regeneration from '../../images/boostpage/regeneration.png'
import reward from '../../images/boostpage/reward.png'
import speedCamel from '../../images/boostpage/speedCamel.png'
import { ReactComponent as Star } from '../../images/boostpage/star.svg'
import waterCamel from '../../images/boostpage/waterCamel.png'
import { boost } from '../../models'

interface StarsProps {
	level: number
}

const Stars: React.FC<StarsProps> = ({ level }) => (
	<>
        {[...Array(10)].map((_, i) => (
                <Star key={i} className={`w-[16px] ${i < level ? 'text-myColor-700' : 'text-white'}`} />
        ))}
	</>
)

    const GetIcon = (icon: string) => {
        switch (icon) {
            case 'Speed': return <img src={speedCamel} alt="" className='w-[70px] h-[70px] z-10 relative p-1 mt-2' />
            case 'Regeneration': return <img src={regeneration} alt="" className='w-[70px] h-[70px] z-10 relative p-1 mt-2' />
            case 'PointBonus': return <img src={pointsbonus} alt="" className='w-[70px] h-[70px] z-10 relative p-1 mt-2' />
            case 'Stamina': return <img src={waterCamel} alt="" className='w-[70px] h-[70px] z-10 relative p-1 mt-2' />
        }
    }

    const {getData} = useNecessary()

const BoostTable = () => {
    const api = useApi()
    const { identityId } = useNecessary()
    const [upgrades, setUpgrades] = useState<boost[]>([])

    const getUpgrades = async () => {
        if (!identityId) return
        const res = await api<boost[]>({
            url: '/boost',
            method: 'GET',
            headers: {
                'x-user-id': identityId
            }
        })
        if (res) {
            setUpgrades(res)
						console.log(upgrades);
						
        }
    }

		const buyUpgrades = async (boostId:string) => {
			if (!identityId) return
			const res = await api<boost[]>({
					url: `/boost/buy-boost?boost_id=${boostId}`,
					method: 'POST',
					headers: {
							'x-user-id': identityId
					}
			})
			getUpgrades()
            getData()
	}

    useEffect(() => {
        getUpgrades()
    }, [identityId])

    return (
        <div className='flex flex-col gap-3 h-[400px] text-white'>
            {upgrades.map((upgrade, index) => (
                <div className='bg-black rounded-2xl custom-sm:py-1 px-4 py-2 flex justify-between' key={index}>
                    <div className='text-left'>
                        <p className='text-lg custom-sm:text-base'>{upgrade.type}</p>
                        <p className='text-[10px] opacity-80'>{upgrade.description}</p>
                        <div className='relative mt-1'>
                            <div className='flex gap-1 items-center'>
                                <div className='cursor-pointer' onClick={() => {buyUpgrades(upgrade.boost_id)}}>
                                    <img src={reward} alt="" className='w-[55px]' />
                                </div>
                                <div className='flex'>
                                    <Stars level={upgrade.lvl} />
                                </div>
                            </div>
                            {upgrade.price !== 0 && (
                                <>
                                 <p className='absolute top-1 left-1 text-[13px] text-center w-[22px] cursor-pointer' onClick={() => {buyUpgrades(upgrade.boost_id)}}>{abbreviateNumber(upgrade.price)}</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className='relative'>
                        {GetIcon(upgrade.type)}
                        <div className='absolute w-[80px] inset-0 bg-myColor-700 h-[50px] top-5 left-0 rounded-full blur-lg'></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default BoostTable
