import { create } from 'zustand'
import { storeInterface } from '../models'

const useStore = create<storeInterface>((set) => ({
	role: '',
	solBalance: 0,
	solDeposit: 0,

	updateRole: (role: string) => {
		set(state => ({
			role
		}))
	},

	updateSolBalance: (solBalance: number) => {
		set(state => ({
			solBalance
		}))
	},

	updateSolDeposit: (solDeposit: number) => {
		set(state => ({
			solDeposit
		}))
	}

}))


export default useStore