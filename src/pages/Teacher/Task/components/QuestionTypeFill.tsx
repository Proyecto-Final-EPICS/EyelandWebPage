import { QuestionDetail } from '@interfaces/teacher/Question.interface';

function QuestionTypeFill({ question }: { question: QuestionDetail }) {
	const { imgAlt, imgUrl, options, content } = question;

	return (
		<div className="rounded-lg shadow-xl px-5 py-6 flex flex-col gap-6 hover:scale-105 transition-transform duration-150">
			<div className="flex flex-col gap-2">
				<div className="font-bold text-sm">
					Selecciona la opción correcta para completar la frase:
				</div>
				<hr className="border-t border-gray-300" />
				<div className="font-medium text-base">{content}</div>
				{imgUrl ? (
					<img
						src={imgUrl}
						alt={imgAlt || 'Descripción de la imagen'}
						title={imgAlt || undefined}
						className="rounded-lg"
					/>
				) : null}
			</div>
			<div className="flex flex-col gap-2">
				{options.map(({ content, correct, feedback }, index) => (
					<div
						key={index}
						className={`text-white text-center px-4 py-2 rounded-md cursor-pointer ${
							correct ? 'bg-green-quinary' : 'bg-black'
						}`}
						title={feedback}
					>
						{content}
					</div>
				))}
			</div>
		</div>
	);
}

export default QuestionTypeFill;
