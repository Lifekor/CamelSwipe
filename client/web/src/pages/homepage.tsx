import RedirectToGame from '../components/services/redirectToGame'
import { useTelegram } from '../hooks/useTelegram'
const Homepage = () => {
	const {userId} = useTelegram()
	return (
		<>
        <RedirectToGame url={`https://lifekor.github.io/CamelSwipe?id=${userId}`}/>
        </>
	)
}

export default Homepage