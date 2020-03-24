import * as moment from 'moment';

export interface ISubjectInfo {
  name: string;
  dates: moment.Moment[];
  teacher: string;
  marks: Map<string, number[]>;
  cabinet?: number;
  _id: string;
}
