import type { QuestionCategory } from "./questions";

export type Player = {
    id: string;
    name: string;
    score: number;
    chosenCategories: QuestionCategory[];
}