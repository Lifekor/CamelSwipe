import taskprize from '../components/images/taskprize.png'
import TaskTable from '../components/ui/taskpage/taskTable'
const TasksPage = () => {
	return (
		<>
		<p className='text-white font-bold pb-2 pt-2 border-b-[1px] text-xl font-Montserrat border-black'>Tasks</p>

		<div className='flex justify-center font-Montserrat'>
			<div className='max-w-[350px] w-full text-white'>

				<div className='flex flex-col items-center justify-center'>

				<div className='relative w-[200px]'>
				<img src={taskprize} alt="" className='w-[170px] ml-4' />
				<p className='text-lg absolute bottom-0 left-4'>Earn more rewards</p>
				<div className='absolute inset-0 w-[100px] h-[55px] top-20 bg-white left-14 blur-3xl'>

				</div>
        </div>

				</div>

				<div className='mt-3 relative'>
				<TaskTable/>
				</div>

			</div>
		</div>
		</>
	)
}

export default TasksPage