# TeacherJournalApp

Initial setup includes:
* Cloning or downloading project
* Installing dependencies via npm
* Configuring .env file for express mongodb server, example stored in .env.example, where you need to pass connection string for your very own
database. Keep your connection string secret and don't tell anyone that my one is `mongodb+srv://serezhishe:Q98bNRUgUqLFU7mF@serezhishe-rvrhn.mongodb.net/test?retryWrites=true&w=majority`
* Well done, now you ready to try this amazing app!

## Client

Run `ng serve` for a server given away client part of teacher's journal. Navigate to `http://localhost:4200/` or just add `-o` for letting node open browser by itself. The app will automatically reload if you change any of the source files.

## Server

Run `npm run dev-server` for an express server running on 3001 port automatically reload if you change any of the source files.  
Run `npm run server` for an usual express server running on 3001 port.
### Make sure .env is configured   

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).  
Not all spec files include not generated tests so cases written by me contains fdescribes, that's why some tests are passed. 
