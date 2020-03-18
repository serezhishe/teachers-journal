import * as moment from 'moment';

export interface ISubjectInfo {
  subject: string;
  dates: moment.Moment[];
  teacher: string;
  marks: number[][];
}
