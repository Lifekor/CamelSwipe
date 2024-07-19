
export interface storeInterface {
	role: string
	solBalance: number
	solDeposit: number

	updateRole: (newRole: string) => void
	updateSolBalance: (newSol: number) => void
	updateSolDeposit: (newSolDeposit: number) => void
}

export interface idInterface {
	user_id: string,
	role: string
}

export interface coinInterface {
	current_coin: number,
	speed_per_second: number,
	ghs: number
}

export interface walletInterface {
	sol: number
}

export interface missionsInterface {
	  completed: number,
		data: [{
			id: string;
			name: string;
			reward: number;
			link: string;
			status: string;
			icon_type: string;
		}]
}

export interface adminWithdrawDataInterface {
			id: string,
      amount: number,
      address: string,
      status: string,
      transaction_date: string,
}

export interface adminWithdrawInterface {
	data: adminWithdrawDataInterface[],
	total: number,
}

export interface walletDataTransaction {
		transaction_id: string,
		amount: number,
		type: string,
		status: string,
		transaction_date: string
}

export interface walletTransaction {
	data: walletDataTransaction[],
	total: number
}

export interface withdrawInfo {
	address: string,
	count: number,
	id: string
}

export interface friendsData {
	referral_username: string,
  missions_finished: number,
  inviter_id: number
}

export interface friends {
	user_inviter: string,
	data: friendsData[]
}

export interface boost {
	boost_id: string,
  lvl: number,
	type: string,
	description: string,
	price: number
}



