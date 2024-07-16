interface TelegramUser {
	id: number;
	username: string;
    first_name: string
}

interface TelegramData {
	user: TelegramUser | null;
}

interface TelegramWebApp {
	initDataUnsafe?: TelegramData;
	close: () => void;
}

const tg: TelegramWebApp = (window as any).Telegram.WebApp;

export function useTelegram () {
    const onClose = () => {
        tg.close()
    }
    
    const userId = tg.initDataUnsafe?.user?.id || null
    const user = tg.initDataUnsafe?.user?.username || null
    const name = tg.initDataUnsafe?.user?.first_name || null

    return {
        onClose,
        tg,
        userId,
        user,
        name
    }
}
