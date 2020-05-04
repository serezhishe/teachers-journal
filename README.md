# TeacherJournalApp

Initial setup includes:
* Cloning or downloading project
* Installing dependencies via npm
* Configuring .env file for express mongodb server, example stored in .env.example, where you need to pass connection string for your very own
database. Keep your connection string secret and don't tell anyone that my one is `mongodb+srv://serezhishe:Q98bNRUgUqLFU7mF@serezhishe-rvrhn.mongodb.net/test?retryWrites=true&w=majority`
* Well done, now you ready to try this amazing app!

## Client

Run `ng serve` for a server given away client part of teacher's journal. Navigate to `http://localhost:4200/` or just add `-o` to let node open browser. The app will automatically reload if you change any of the source files.

## Server

Run `npm run dev-server` for an express server running on 3001 port which automatically reload if any of the source files were changed.  
Run `npm run server` for an usual express server running on 3001 port.
### Make sure .env is configured   

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).  
Not all spec files include not generated tests so cases written by me contains fdescribes, that's why some tests are passed. 

## How it works

So we have app-component (our root). By itself it contains:
* panel-component
* breadcrumbs-component
* dynamically rendered popup-component when it is needed
* router-outlet
At this point we have routes:
* students (default route)
* subjects
as export and statistics components are not implemented, this routes show 404 and suggest you go at default page (students)

Students page have two inner components:
* students-table, in which we can find all students and their info or remove some student from our database. From this page we can open our student-form to add someone.
* student-form itself. This component includes shared form component which is configured from student-form. Here we adding some styles and emit form output to students service (we will talk about it later).

Subjects page have three inner components:
* subjects-page, in which we can find all subjects and navigate to subject-table of specific one. From this page we can open our subject-form to add subject, here we delete and rename subjects.
* subject-table, in which we see students assigned to subject and their marks. We can remove student from subject, add new mark column (new date), change teacher and work with marks. To save changes it is needed to click save button. If something was changed by mistake we can discard changes to return to the last saved version of this subject.
* subject-form. Same as student-form.

This is the main features of app. Let's see how it works inside.

We have 2 main services: subjects-service and students-service.
They are handling adding, changing and deleting subjects/students.
They store data in BehaviourSubjects so components subcribe to it.

Breadcrumb-service helps to build breadcrumbs.
Pop-up-service provides methods to trigger popups of different and streams to subscribe on this events.
Session-storage-service used only in storage-interceptor to prevent multiple requests for same data.
Also we can find map-fix-interceptor. It is needed to convert es6 Map of marks to array before sending on back-end. Without this convertion it will be casted to empty object.

The main entities are: IStudent, ISubjectInfo, ISubjectPage.
ISubjectInfo stores info like subject name, teacher, id, description and cabinet, while ISubjectPage includes also students, marks and dates. moment.js is used to make work with dates easier.  

Back-end is an express server connected to mongodb cloudly stored.