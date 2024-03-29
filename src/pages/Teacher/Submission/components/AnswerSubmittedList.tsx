import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Collapse from 'rc-collapse';
import 'rc-collapse/assets/index.css';

import { QuestionSubmissionDetailPostask } from '@interfaces/teacher/Answer.interface';
import { ItemType } from 'rc-collapse/es/interface';
import AnswerSubmitted from './AnswerSubmitted';

function AnswerSubmittedList({
	questionSubmission: { content, questionOrder, options, answers },
	idAnswerSelected,
	setIdAnswerSelected
}: {
	questionSubmission: QuestionSubmissionDetailPostask;
	idAnswerSelected: number | null;
	setIdAnswerSelected: (id: number) => void;
}) {
	const { t, i18n } = useTranslation('', {
		keyPrefix: 'teacher.submission.answerList'
	});
	const onSelectAnswer = (id: number) => {
		if (idAnswerSelected !== id) {
			setIdAnswerSelected(id);
		}
	};

	const collapseItems = useMemo(
		(): ItemType[] =>
			answers.map(
				({ audioUrl, answerSeconds, idOption, text, id }, i) => ({
					key: i,
					label: (
						<div className="font-semibold">{`${t('answer')} ${
							i + 1
						}`}</div>
					),
					children: (
						<AnswerSubmitted
							answerOrder={i}
							answerSeconds={answerSeconds}
							audioUrl={audioUrl}
							id={id}
							idAnswerSelected={idAnswerSelected}
							idOption={idOption}
							onSelectAnswer={onSelectAnswer}
							options={options}
							text={text}
						/>
					)
				})
			),
		[idAnswerSelected, i18n.language]
	);

	return (
		<div className="flex flex-col justify-between px-4 py-2 text-sm">
			<div className="">
				<div className="font-medium text-lg">{`${t(
					'question'
				)} ${questionOrder}`}</div>
				{content}
			</div>
			<div className="flex flex-col gap-1">
				<Collapse
					defaultActiveKey={
						answers.findIndex(
							({ id }) => id === idAnswerSelected
						) ?? undefined
					}
					items={collapseItems}
				/>
			</div>
		</div>
	);
}

export default AnswerSubmittedList;
