import { ReactComponent as Taskprize } from '../components/images/taskpage/taskprize.svg'
import TaskTable from '../components/ui/taskpage/taskTable'

const TasksPage = () => {
	return (
		<>
			<div className='h-[50px] items-center flex justify-center text-white text-2xl custom-sm:text-lg font-bold rounded-t-[30px] gap-2 bg-black bg-opacity-85'>
				Tasks
			</div>
			<div className='h-full overflow-y-scroll pb-[150px] bg-myColor-700'>
				<div className='flex justify-center font-Montserrat'>
					<div className='max-w-[350px] w-full text-white'>

						<div className='flex flex-col items-center justify-center'>
							<div className='relative'>
								<p className='text-center relative text-xl top-2'>Earn more rewards</p>
								<Taskprize className='w-[350px] h-[250px] relative bottom-8' />
								{/* <div className='absolute inset-0 w-[100px] h-[55px] top-20 bg-white left-14 blur-3xl'></div> */}
							</div>
						</div>

						<div className='relative'>
							<div className='relative' style={{ marginTop: '-130px' }}>
								<TaskTable />
							</div>
						</div>

					</div>
				</div>
			</div>
		</>
	)
}

export default TasksPage
