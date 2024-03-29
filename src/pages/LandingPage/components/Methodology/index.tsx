import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Title from '@components/Title';
import Task from '@pages/LandingPage/components/Methodology/Task';
import Description from '@pages/LandingPage/components/Description';

import PreTaskPhone from '@images/PreTaskPhone.svg';
import DuringTaskPhone from '@images/DuringTaskPhone.svg';
import PosTaskPhone from '@images/PosTaskPhone.svg';

function Methodology() {
	const [count, setCount] = useState(0);
	const { t } = useTranslation('', { keyPrefix: 'landingPage.methodology' });

	const [classPretask, setClassPretask] = useState('md:-top-32');
	const [classPretaskP, setClassPretaskP] = useState(
		'md:top-10 md:-right-28'
	);
	const [classPretaskD, setClassPretaskD] = useState(
		'md:top-20 md:-translate-x-44 md:opacity-0'
	);

	const [classActivity, setClassActivity] = useState('md:-right-24');
	const [classActivityP, setClassActivityP] = useState(
		'md:top-24 md:-right-36'
	);
	const [classActivityD, setClassActivityD] = useState(
		'md:top-20 md:-translate-x-44 md:opacity-0'
	);

	const [classPosTask, setClassPosTask] = useState('md:-bottom-32');
	const [classPosTaskP, setClassPosTaskP] = useState(
		'md:top-44 md:-right-28'
	);
	const [classPosTaskD, setClassPosTaskD] = useState(
		'md:top-20 md:-translate-x-44 md:opacity-0'
	);

	useEffect(() => {
		switch (count) {
			case 0:
				setClassActivity('md:-right-24');
				setClassActivityP('md:top-24 md:-right-36');
				setClassActivityD('md:top-20 md:-translate-x-44 md:opacity-0');
				setClassPosTask('md:-bottom-32');
				setClassPosTaskP('md:top-44 md:-right-28');
				setClassPosTaskD('md:top-20 md:-translate-x-44 md:opacity-0');

				break;
			case 1:
				setClassPretask('md:-top-32');
				setClassPretaskP('md:top-10 md:-right-28');
				setClassPretaskD('md:top-20 md:-translate-x-44 md:opacity-0');
				setClassPosTask('md:-bottom-32');
				setClassPosTaskP('md:top-44 md:-right-28');
				setClassPosTaskD('md:top-20 md:-translate-x-44 md:opacity-0');
				break;
			case 2:
				setClassPretask('md:-top-32');
				setClassPretaskP('md:top-10 md:-right-28');
				setClassPretaskD('md:top-20 md:-translate-x-44 md:opacity-0');
				setClassActivity('md:-right-24');
				setClassActivityP('md:top-24 md:-right-36');
				setClassActivityD('md:top-20 md:-translate-x-44 md:opacity-0');
				break;
			default:
				break;
		}
	}, [count]);

	return (
		<div className="flex h-auto w-screen flex-col items-center justify-center px-5 md:mb-48">
			<Title textColor="text-black" title={t('title')} />
			<Description>{t('description')}</Description>

			<div className="w-full md:flex md:w-screen md:max-w-[1366px] md:justify-start">
				<div className="relative mt-10 flex flex-col items-end gap-10 md:-left-28 md:mt-52 md:h-[600px] md:w-[600px] md:flex-row md:items-center md:justify-center md:gap-0 md:rounded-full md:bg-green-primary">
					<div className="absolute -left-[1650px] -top-[700px] -z-10 h-[2000px] w-[2000px] rounded-full  bg-green-tertiary md:-left-[1600px]" />
					<div className="absolute -left-[1600px] -top-[650px] -z-10 h-[1900px] w-[1900px] rounded-full bg-white md:-left-[1550px]" />

					<h1 className="hidden md:block md:text-8xl md:font-bold md:text-white">
						{t('task.name')}
					</h1>
					<Task
						title={t('task.parts.preTask.title')}
						description={t('task.parts.preTask.description')}
						img={PreTaskPhone}
						classTask={classPretask}
						classTaskP={classPretaskP}
						classTaskD={classPretaskD}
						setClassTask={setClassPretask}
						setClassTaskP={setClassPretaskP}
						setClassTaskD={setClassPretaskD}
						setCount={setCount}
						index={0}
					/>

					<Task
						title={t('task.parts.duringTask.title')}
						description={t('task.parts.duringTask.description')}
						img={DuringTaskPhone}
						classTask={classActivity}
						classTaskP={classActivityP}
						classTaskD={classActivityD}
						setClassTask={setClassActivity}
						setClassTaskP={setClassActivityP}
						setClassTaskD={setClassActivityD}
						setCount={setCount}
						index={1}
					/>

					<Task
						title={t('task.parts.postTask.title')}
						description={t('task.parts.postTask.description')}
						img={PosTaskPhone}
						classTask={classPosTask}
						classTaskP={classPosTaskP}
						classTaskD={classPosTaskD}
						setClassTask={setClassPosTask}
						setClassTaskP={setClassPosTaskP}
						setClassTaskD={setClassPosTaskD}
						setCount={setCount}
						index={2}
					/>
				</div>
			</div>
		</div>
	);
}

export default Methodology;
