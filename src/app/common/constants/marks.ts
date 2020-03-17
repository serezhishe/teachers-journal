// tslint:disable
import { students } from './student';
import { subjectsList } from './subjects-list';
import * as moment from 'moment';
export const marksList = subjectsList.map((subj, index) => ({
        subject: subj,
        dates: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((elem) => moment(Date.UTC(2020, 2, elem))),
        teacher: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'.split(' ')[index],
        marks: students.map(() => [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() =>
            Math.round(Math.random() * 30) - 20 > 0 ?  Math.round(Math.random() * 10) : undefined))
    }));
