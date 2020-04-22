import { ISubjectInfo } from './subject-info.model';

export interface ISubjectPage extends ISubjectInfo {
  subjectId?: string;
  dates: string[];
  marks: Map<string, number[]>;
  students: string[];
}
