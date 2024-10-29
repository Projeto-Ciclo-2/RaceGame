export interface IPollQuestion {
	id: number;
	statement: string;
	options: string[];
	answer: string;
	explanation: string;
}

export interface IPoll {
	id: string;
	title: string;
	theme: string;
	number_of_question: number;
	number_of_alternatives: number;
	duration_in_minutes: number;
	started: boolean;
	owner: string;
	created_at?: number; //timestamp
	started_at?: number | null; //timestamp
	questions: IPollQuestion[];
	playing_users: Array<{ userID: string; username: string }>;
}

// redis:
export interface IVote {
	userID: string;
	pollID: string;
	pollQuestionID: number;
	userChoice: string;
	voted_at: number; //o timestamp de quando o voto ocorreu no frontend
}
