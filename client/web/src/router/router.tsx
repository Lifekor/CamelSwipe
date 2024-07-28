import { Route, Routes } from 'react-router-dom'
import RedirectToGame from '../components/services/redirectToGame'
import { NavPanelProvider } from '../hooks/necessary'
import Boostpage from '../pages/boostpage'
import Friendspage from '../pages/friendspage'
import Homepage from '../pages/homepage'
import Taskspage from '../pages/taskspage'

const Router = () => {
	return (
		<>
		<Routes>
			  <Route path='/' element={
					<NavPanelProvider>
						  <Homepage/>
					</NavPanelProvider>
				  }/>
				<Route path='/tasks' element={
					<NavPanelProvider>
						  <Taskspage/>
					</NavPanelProvider>
				  }/>
				<Route path='/friends' element={
					<NavPanelProvider>
						  <Friendspage/>
					</NavPanelProvider>
				  }/>
				<Route path='/boost' element={
					<NavPanelProvider>
						  <Boostpage/>
					</NavPanelProvider>
				  }/>
				<Route path="/redirect-to-game" element={<RedirectToGame />} />
		</Routes>
		</>
	)
}

export default Router