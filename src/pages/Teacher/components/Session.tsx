import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import Loading from 'react-loading';

import useCourses from '@hooks/useCourse';
import useTeacherContext from '@hooks/useTeacherContext';
import useTeam from '@hooks/useTeam';

import { TeamDetail } from '@interfaces/Team.interface';

import { connect, socket } from '@utils/socket';

import DesktopAndMobile from '@animations/DesktopAndMobile.json';
import useAuthStorage from '@hooks/useAuthStorage';
import { SocketEvents } from '@enums/Socket.enum';

import TeamGrid from '@pages/Teacher/components/TeamGrid';
import SessionOptions from '@pages/Teacher/components/SessionOptions';

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
			idSelectedCourse,
			setIdSelectedCourse,
			course,
			setCourse
		}
	} = useTeacherContext();
	// useCourses hook
	const {
		getCourse,
		loading: loadingCourses,
		createSession,
		startSession,
		endSession
	} = useCourses();
	// useTeams hook
	const {
		teams,
		setTeams,
		getTeams,
		generateTeams
		// loading: loadingTeams
	} = useTeam();

	// states
	const [isSessionCreated, setSessionCreated] = useState(false);
	const [isSessionStarted, setSessionStarted] = useState(false);
	const [idCourse, setIdCourse] = useState<number | null>(
		parseIdCourse(searchParams.get('idCourse'))
	);

	const handleCreateSession = async () => {
		try {
			if (idSelectedCourse !== null) {
				await createSession(idSelectedCourse);
				setSessionCreated(true);
			}
		} catch (err) {}
	};

	const handleStartSession = async () => {
		try {
			if (idSelectedCourse !== null) {
				await startSession(idSelectedCourse);
				setSessionStarted(true);
			}
		} catch (err) {}
	};

	const handleEndSession = async () => {
		try {
			if (idSelectedCourse !== null) {
				await endSession(idSelectedCourse);
				if (isSessionStarted) setSessionStarted(false);
				setSessionCreated(false);
			}
		} catch (err) {}
	};

	const handleGenerateTeams = async () => {
		try {
			if (idSelectedCourse !== null) {
				await generateTeams(idSelectedCourse);
				await getTeams(idSelectedCourse);
			}
		} catch (err) {}
	};

	const connectSocket = () => {
		socket?.disconnect();
		connect();
		socket?.emit(SocketEvents.JOIN, authStorage.getAccessToken());
	};

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
			if (idSelectedCourse !== null) {
				getTeams(idSelectedCourse).catch(() => {});
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
		};
	}, [isSessionCreated]);

	useEffect(() => {
		const idCourseNum = parseIdCourse(searchParams.get('idCourse'));
		if (idCourseNum === null) {
			return navigate('/teacher/courses');
		}
		if (idCourseNum !== idCourse) setIdCourse(idCourseNum);
	}, [searchParams]);

	useEffect(() => {
		if (idCourse === null) {
			return navigate('/teacher/courses');
		}
		if (idSelectedCourse !== idCourse) setIdSelectedCourse(idCourse);
		if (idSelectedCourse !== idCourse || !course) {
			getCourse(idCourse)
				.then((course) => {
					setCourse(course);
				})
				.catch(() => {
					if (course !== null) setCourse(null);
				});
		}
	}, [idCourse]);

	useEffect(() => {
		return () => {
			socket?.disconnect();
		};
	}, []);

	return (
		<div className="px-8 py-4 h-full relative">
			{idSelectedCourse !== null ? (
				course ? (
					<>
						<div className="absolute top-4 right-8 flex items-stretch gap-4">
							<SessionOptions
								isSessionCreated={isSessionCreated}
								isSessionStarted={isSessionStarted}
								handleCreateSession={handleCreateSession}
								handleStartSession={handleStartSession}
								handleEndSession={handleEndSession}
							/>
						</div>
						<div className="flex flex-col h-full">
							<div>
								<div className="font-semibold text-3xl flex items-center gap-4">
									<div
										className={`rounded-full w-5 h-5 bg-${
											!isSessionCreated
												? 'orange-primary'
												: 'green-primary'
										}`}
									></div>
									{course.name}
								</div>
								<div className="text-xl">
									{!isSessionCreated ? (
										<span>
											El curso actualmente se encuentra{' '}
											<b>Inactivo</b>
										</span>
									) : (
										<span>
											El curso actualmente se encuentra{' '}
											<b>Activo</b>
										</span>
									)}
								</div>
							</div>
							{isSessionCreated && teams && (
								<div className="sm:pr-0 sm:pb-2 md:pr-0 md:pb-4 lg:pr-32 lg:pb-6 xl:pr-36 xl:pb-8 2xl:pr-48 2xl:pb-10">
									<TeamGrid
										teams={teams}
										handleGenerateTeams={
											handleGenerateTeams
										}
									/>
								</div>
							)}
						</div>
					</>
				) : (
					<div className="flex flex-col grow justify-center items-center h-full">
						{loadingCourses ? (
							<Loading type="spin" color="#0D9748" />
						) : (
							<div className="italic w-3/5 text-center text-lg">
								No se pudo obtener la información
							</div>
						)}
					</div>
				)
			) : (
				<div className="flex flex-col justify-center items-center w-full h-full">
					<div className="w-1/2">
						<Lottie animationData={DesktopAndMobile} loop={true} />
					</div>
				</div>
			)}
		</div>
	);
}

function parseIdCourse(idCourseStr: string | null) {
	const idCourseNum = parseInt(String(idCourseStr));
	if (isNaN(idCourseNum)) return null;
	return idCourseNum;
}

export default Session;
