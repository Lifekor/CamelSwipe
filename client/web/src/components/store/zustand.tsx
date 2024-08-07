import { create } from 'zustand'
import { storeInterface } from '../models'

const useStore = create<storeInterface>((set) => ({
	role: '',
	currentCoin: 0,
	solDeposit: 0,

	updateRole: (role: string) => {
		set(state => ({
			role
		}))
	},

	updateCurrentCoin: (currentCoin: number) => {
		set(state => ({
			currentCoin
		}))
	},

	updateSolDeposit: (solDeposit: number) => {
		set(state => ({
			solDeposit
		}))
	}

}))


export default useStore