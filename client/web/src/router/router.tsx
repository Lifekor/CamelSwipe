import { Route, Routes } from 'react-router-dom'
import { NavPanelProvider } from '../hooks/necessary'
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
		</Routes>
		</>
	)
}

export default Router