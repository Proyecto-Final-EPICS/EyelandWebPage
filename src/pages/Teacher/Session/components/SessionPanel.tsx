import { Dispatch, SetStateAction, useMemo } from 'react';
import Lottie from 'lottie-react';
import ReactDropdown, { Option } from 'react-dropdown';
import Loading from 'react-loading';
import 'react-dropdown/style.css';

import PulseGreen from '@animations/PulseGreen.json';
import SessionOptions from '@pages/Teacher/Session/components/SessionOptions';
import useTask from '@hooks/useTask';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TaskDetail, TaskSummary } from '@interfaces/teacher/Task.interface';

function SessionPanel({
	isSessionCreated,
	isSessionStarted,
	handleCreateSession,
	handleStartSession,
	handleEndSession,
	task,
	setTask
}: {
	isSessionCreated: boolean;
	isSessionStarted: boolean;
	handleCreateSession: () => void;
	handleStartSession: () => void;
	handleEndSession: () => void;
	task: TaskDetail | TaskSummary | null;
	setTask: Dispatch<SetStateAction<TaskDetail | TaskSummary | null>>;
}) {
	const { tasks, getTasks, loading } = useTask();
	const { t, i18n } = useTranslation('', {
		keyPrefix: 'teacher.session.active'
	});

	const onSelectTask = (option: Option) => {
		console.log(option);
		if (!tasks) return;
		if (option.value === '') {
			if (task) setTask(null);
		} else {
			const value = parseInt(option.value);
			setTask(tasks.find(({ id }) => id === value) || null);
		}
	};

	const dropdownOptions = useMemo(() => {
		if (!tasks) return [];
		return [
			{
				value: '',
				label: t('dropdown.all')
			},
			...tasks.map(({ id, name, taskOrder }) => ({
				value: String(id),
				label: `${taskOrder}. ${name}`
			}))
		];
	}, [tasks, i18n.language]);

	useEffect(() => {
		if (!tasks) {
			getTasks().catch(() => {
				if (task) setTask(null);
			});
		}
	}, []);

	return (
		<div className="border-b border-solid border-gray-600">
			<div className="pr-6 pl-8 flex justify-between items-center">
				<div className="flex items-center gap-4">
					<Lottie
						animationData={PulseGreen}
						loop
						className="w-32 h-32"
					/>
					<div className="">
						{t('title')}
						<div className="font-semibold text-green-quaternary">
							{t('state')}
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<SessionOptions
						isSessionCreated={isSessionCreated}
						isSessionStarted={isSessionStarted}
						handleCreateSession={handleCreateSession}
						handleStartSession={handleStartSession}
						handleEndSession={handleEndSession}
					/>
					<div className="flex gap-4 justify-between">
						<ReactDropdown
							options={dropdownOptions}
							onChange={onSelectTask}
							disabled={!tasks}
							className="grow"
							placeholder={'Seleccione una task'}
						/>
						{loading && (
							<div>
								<Loading
									type="spin"
									color="#A9A9A9"
									width={40}
								/>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default SessionPanel;
