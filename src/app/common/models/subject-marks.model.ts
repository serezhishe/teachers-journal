import { IStudent } from '../models/student.model';

export interface IStudentMarks {
    student: IStudent;
    averageMark: number;
    marks: number[];
}
