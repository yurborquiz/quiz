import { Option } from "./IOption";

export interface Question {
    id: number;
    type: "RADIO" | "CHECKBOX";
    question: string;
    options: Option[];
    isRequired: boolean;
}