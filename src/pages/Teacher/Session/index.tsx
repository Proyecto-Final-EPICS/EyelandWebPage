import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';

import useCourse from '@hooks/useCourse';
import useTeacherContext from '@hooks/useTeacherContext';
import useTeam from '@hooks/useTeam';
import useAuthStorage from '@hooks/useAuthStorage';
import { useTranslation } from 'react-i18next';

import Button from '@components/Button';
import SessionPanel from '@pages/Teacher/Session/components/SessionPanel';
import Ribbon from '@pages/Teacher/components/Ribbon';
import TeamGrid from '@pages/Teacher/Session/components/TeamGrid';

import {
	TeamDetail,
	TeamLeaderboardDetail
} from '@interfaces/teacher/Team.interface';
import { TaskDetail, TaskSummary } from '@interfaces/teacher/Task.interface';
import { SocketEvents } from '@enums/Socket.enum';

import { parseNumericParam } from '@utils/routing.utils';
import { connect, socket } from '@listeners/socket';

import DataGridIcon from '@icons/DataGrid.svg';
import PulseGray from '@animations/PulseGray.json';

import { decodeToken } from '@utils/auth';
import Leaderboard from '@pages/Teacher/Session/components/Leaderboard';
import LoadingScreen from '@components/LoadingScreen';

function Session() {
	// auth
	const authStorage = useAuthStorage();
	// navigation
	const navigate = useNavigate();
	// query params
	const [searchParams] = useSearchParams();
	// context
	const {
		coursesData: {
			course,
			setCourse,
			idSelectedCourse,
			setIdSelectedCourse
		}
	} = useTeacherContext();
	// useCourses hook
	const {
		getCourse,
		loading: loadingCourses,
		createSession,
		startSession,
		endSession
	} = useCourse();
	// useTeams hook
	const { teams, setTeams, getTeams, generateTeams } = useTeam();
	const [teamsLeaderboard, setTeamsLeaderboard] = useState<
		TeamLeaderboardDetail[] | null
	>(null);

	// states
	const [isSessionCreated, setSessionCreated] = useState(false);
	const [isSessionStarted, setSessionStarted] = useState(false);
	const [idCourse, setIdCourse] = useState<number | null>(
		parseNumericParam(searchParams.get('idCourse'))
	);
	const [task, setTask] = useState<TaskDetail | TaskSummary | null>(null);

	const { t } = useTranslation('', { keyPrefix: 'teacher.session' });

	const handleCreateSession = async () => {
		try {
			if (idCourse !== null) {
				await createSession(idCourse);
				setSessionCreated(true);
			}
		} catch (err) {}
	};

	const handleStartSession = async () => {
		try {
			if (idCourse !== null) {
				await startSession(idCourse);
				setSessionStarted(true);
			}
		} catch (err) {}
	};

	const handleEndSession = async () => {
		try {
			if (idCourse !== null) {
				await endSession(idCourse);
				if (isSessionStarted) setSessionStarted(false);
				setSessionCreated(false);
			}
		} catch (err) {}
	};

	const handleGenerateTeams = async () => {
		try {
			if (idCourse !== null) {
				await generateTeams(idCourse);
				await getTeams(idCourse);
			}
		} catch (err) {}
	};

	const connectSocket = () => {
		socket?.disconnect();
		const decoded = decodeToken(authStorage.getAccessToken());
		if (!decoded) return;
		connect();
		socket?.emit(SocketEvents.JOIN, decoded.id);
		console.log('connected');
	};

	const filteredTeams = !teams
		? []
		: !task
		? teams
		: teams.filter(({ taskOrder }) => taskOrder === task?.taskOrder);

	const filteredTeamsLeaderboard = useMemo(() => {
		if (!teamsLeaderboard || !task) return [];
		const filtered = teamsLeaderboard.filter(({ id }) => {
			const team = teams?.find((team) => team.id === id);
			return team?.taskOrder === task?.taskOrder;
		});
		const minPosition = Math.min(...filtered.map((team) => team.position));
		return filtered.map(({ position, ...fields }) => ({
			...fields,
			position: position - (minPosition - 1)
		}));
	}, [teamsLeaderboard, task]);

	useEffect(() => {
		if (!course) {
			if (isSessionCreated) setSessionCreated(false);
			if (isSessionStarted) setSessionStarted(false);
		} else {
			const { session } = course;
			if (session && !isSessionCreated) {
				setSessionCreated(true);
			} else if (!session) {
				if (isSessionCreated) setSessionCreated(false);
				if (isSessionStarted) setSessionStarted(false);
			}
		}
	}, [course]);

	useEffect(() => {
		if (isSessionCreated) {
			if (idCourse !== null) {
				getTeams(idCourse).catch(console.log);
				connectSocket();
				socket?.on(
					SocketEvents.TEAMS_STUDENT_UPDATE,
					(teams: TeamDetail[]) => {
						setTeams(teams);
					}
				);
			}
		} else {
			if (teams?.length) setTeams([]);
		}
		return () => {
			socket?.off(SocketEvents.TEAMS_STUDENT_UPDATE);
			console.log('Stop listening to teams update');
		};
	}, [isSessionCreated]);

	useEffect(() => {
		if (isSessionStarted) {
			if (idCourse !== null) {
				socket?.on(
					SocketEvents.COURSE_LEADERBOARD_UPDATE,
					(teamsLeaderboard: TeamLeaderboardDetail[]) => {
						console.log('leaderboard update', teamsLeaderboard);
						setTeamsLeaderboard(teamsLeaderboard);
					}
				);
			}
		}
		return () => {
			socket?.off(SocketEvents.COURSE_LEADERBOARD_UPDATE);
			console.log('Stop listening to leaderboard update');
		};
	}, [isSessionStarted]);

	useEffect(() => {
		setIdCourse(parseNumericParam(searchParams.get('idCourse')));
	}, [searchParams]);

	useEffect(() => {
		if (idCourse === null) {
			return navigate('/teacher/courses');
		}
		if (idSelectedCourse !== idCourse) setIdSelectedCourse(idCourse);
		if (!course || course.id !== idCourse) {
			getCourse(idCourse)
				.then((course) => setCourse(course))
				.catch(() => {
					if (course !== null) setCourse(null);
				});
			if (isSessionCreated) {
				getTeams(idCourse).catch(() => {
					if (teams?.length) setTeams([]);
				});
			}
		}
	}, [idCourse]);

	useEffect(() => {
		return () => {
			socket?.disconnect();
			console.log('disconnected');
		};
	}, []);

	// if (idCourse === null) return <></>;

	return (
		<div className="min-h-screen h-screen">
			<Ribbon
				bgColor={isSessionCreated ? 'green-quaternary' : 'gray-primary'}
			>
				{course ? (
					<>
						<img
							src={DataGridIcon}
							alt="GraduationCap"
							className="w-5 h-5"
						/>
						<div className="text-white font-semibold">
							{(course?.name ? `${course.name} - ` : '') +
								t('ribbon')}
						</div>
					</>
				) : (
					<div className="text-gray-primary">.</div>
				)}
			</Ribbon>
			<div className="pt-10 h-full relative">
				{course ? (
					!isSessionCreated ? (
						<div className="shadow-card rounded-md px-14 py-6 hover:scale-105 transition-all duration-300 flex flex-col items-center gap-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
							<Lottie
								animationData={PulseGray}
								loop
								className="w-20 h-20"
							/>
							<div className="text-green-primary text-center">
								{t('inactive.part1')}
								<div className="font-semibold text-gray-secondary">
									{t('inactive.part2')}
								</div>
							</div>
							<div className="w-min">
								<Button onClick={handleCreateSession}>
									{t('inactive.button')}
								</Button>
							</div>
						</div>
					) : (
						<div className="">
							<SessionPanel
								isSessionCreated={isSessionCreated}
								isSessionStarted={isSessionStarted}
								handleCreateSession={handleCreateSession}
								handleStartSession={handleStartSession}
								handleEndSession={handleEndSession}
								task={task}
								setTask={setTask}
							/>
							<div>
								<div
									className={`transition-all duration-1000 ${
										isSessionStarted &&
										filteredTeamsLeaderboard.length
											? 'min-h-[24rem]'
											: 'h-0'
									}
							`}
								>
									{(isSessionStarted &&
										filteredTeamsLeaderboard.length && (
											<div
												className="
										sm:pl-6 sm:pr-16 sm:pb-10
										md:pl-6 md:pr-6 md:pb-10
										lg:pl-10 lg:pr-16 lg:pb-10
										xl:pl-12 xl:pr-40 xl:pb-10
										2xl:pr-48 2xl:pb-10
										"
											>
												<div className="text-xl font-medium mt-2 py-4">
													Leaderboard
												</div>
												<Leaderboard
													teamsLeaderboard={
														filteredTeamsLeaderboard
													}
												/>
											</div>
										)) ||
										null}
								</div>
								{(isSessionStarted &&
									filteredTeamsLeaderboard.length && (
										<hr className="border-t border-gray-700 w-11/12 m-auto" />
									)) ||
									null}
							</div>
							{teams && (
								<div
									className="
									sm:pl-6 sm:pr-16 sm:pb-10
									md:pl-6 md:pr-6 md:pb-10
									lg:pl-10 lg:pr-16 lg:pb-10
									xl:pl-12 xl:pr-40 xl:pb-10
									2xl:pr-48 2xl:pb-10
								"
								>
									<div className="text-3xl font-bold mt-2 py-4 ml-2 mb-5">
										{t('active.teamsList.title')}
									</div>
									<TeamGrid
										teams={filteredTeams}
										handleGenerateTeams={
											handleGenerateTeams
										}
									/>
								</div>
							)}
						</div>
					)
				) : (
					<LoadingScreen loading={loadingCourses} />
				)}
			</div>
		</div>
	);
}

export default Session;
