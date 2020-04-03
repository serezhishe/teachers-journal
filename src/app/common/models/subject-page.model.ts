export interface ISubjectPage {
  subjectId: string;
  dates: string[];
  marks: Map<string, number[]>;
  students: string[];
}
