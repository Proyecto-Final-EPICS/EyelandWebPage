import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from 'react-loading';

import useTask from '@hooks/useTask';
import useTeacherContext from '@hooks/useTeacherContext';
import { useTranslation } from 'react-i18next';

import DataGridIcon from '@icons/DataGrid.svg';

function SubMenuTasks() {
	const navigate = useNavigate();
	const { tasks, getTasks, loading } = useTask();
	const {
		tasksData: { idSelectedTask, setIdSelectedTask }
	} = useTeacherContext();
	const { t } = useTranslation('', {
		keyPrefix: 'teacher.menu.subMenu.tasks'
	});

	const onSelectTask = (id: number) => {
		setIdSelectedTask(id);
		navigate(`/teacher/tasks/${id}`);
	};

	useEffect(() => {
		if (!tasks) getTasks().catch(console.log);
	}, []);

	return (
		<div className="h-full text-white px-6 py-6 flex flex-col">
			<div className="font-semibold text-lg flex items-center gap-4 text-center before:content-[''] before:grow before:border before:border-white before:border-solid after:content-[''] after:grow after:border after:border-white after:border-solid">
				{t('title')}
			</div>
			{tasks ? (
				<div className="flex flex-col gap-4 mt-4 items-start text-sm grow">
					{tasks.map(({ name, id, taskOrder }, i) => (
						<div
							key={i}
							className={`flex items-center gap-4 px-4 py-2 rounded-md cursor-pointer w-full ${
								idSelectedTask === id
									? 'bg-white bg-opacity-20'
									: 'hover:bg-white hover:bg-opacity-10'
							}`}
							onClick={() => onSelectTask(id)}
						>
							<img
								src={DataGridIcon}
								alt="Icon"
								className=" w-6 h-6"
							/>
							{`${taskOrder}. ${name}`}
						</div>
					))}
				</div>
			) : (
				<div className="flex flex-col grow justify-center items-center">
					{loading ? (
						<Loading type="spin" width={50} />
					) : (
						<div className="italic w-3/5 text-center text-xs">
							{t('error')}
						</div>
					)}
				</div>
			)}
		</div>
	);
}

export default SubMenuTasks;
