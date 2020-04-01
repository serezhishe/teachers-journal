import { IStudent } from './student.model';

export interface IStudentMarks {
    student: IStudent;
    averageMark: number;
    marks: number[];
}
