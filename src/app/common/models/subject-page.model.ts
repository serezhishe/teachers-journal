export interface ISubjectPage {
  subjectID: string;
  dates: string[];
  marks: Map<string, number[]>;
  students: string[];
}
