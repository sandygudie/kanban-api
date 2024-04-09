<h1 align="center"> Kanban-API</p>

  <br/>
  
### Resources

- Client App: https://kanban-track.vercel.app/
- Postman Documentation:

  <br/>

### Technologies and dependencies

- [**NodeJs 14.17.5**](https://nodejs.org/en/) - A cross-platform JavaScript runtime environment for developing server-side applications
- [**Express 4.18.2**](https://expressjs.com/) - A NodeJs web application framework that helps manage servers and routes.
- [**Mongoose ^7.0.0**](https://www.mongodb.com/) - A non-relational Database
- [**Nodemon ^3.0.2**](https://www.npmjs.com/package/nodemon) - Detects and automatically restarting the node application when file changes.
- [**Bycrypt ^5.1.1**](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords.
- [**Cors ^2.8.5**](https://www.npmjs.com/package/cors) - For cross origin resources sharing.
- [**Nodemailer ^6.9.8**](https://www.nodemailer.com/) - For sending email in Nodejs apllication.
- [**Jsonwebtoken ^9.0.2**](https://jwt.io/) - For decode, verify and generating JWT.
- [**google-auth-library ^9.7.0**](https://cloud.google.com/nodejs/docs/reference/google-auth-library/latest) - For Google authentication
- [**EJS ^3.1.9**](https://ejs.co/) - A Simple templating language that lets you generate HTML markup with plain JavaScript
- [**cookie-parser ^1.4.6**](https://www.npmjs.com/package/cookie-parser) - For parsing request cookies
- [**Eslint ^7.32.0 || ^8.2.0**](https://eslint.org/) - Handles codebase Linting, (Eslint standard used)
- [**Prettier ^2.8.4**](https://prettier.io/) - Code formatter to to make code base look pretty
- [**Husky ^8.0.3**](https://github.com/typicode/husky) and [**lint-staged ^13.2.0**](https://github.com/okonet/lint-staged) - Pre-commit hooks that runs on `git commit`

  <br/>

### Environment Setup

- Make sure you have **nodejs v14.17.5** and above installed. You can install **nodejs** from [here](https://nodejs.org/en/download/) if you don't have it.
- To check node version
  ```
  node --version
  ```
- Clone the respository to your local machine using the command.
  ```
  git clone https://github.com/sandygudie/kanban-api.git
  ```
- Navigate to the project folder.
  ```
  cd kanban-api
  ```
- You can open the project with your code editor (VScode recommended)

  <br/>

### Start the server

- Install the package dependencies by running the following command in the terminal `npm install`
- Create a `.env` in the project folder, get example variables from the `.env.example` file sample and ensure to add the values correctly(e.g MONGODB_URI)
- To start the server locally, run the command `npm run dev`

  <br/>

### Formatting for the project

- We're using `eslint` for js linting, and `prettier` for code formatting.
- Please make it a point to install `eslint` and `prettier` plugins on vscode to aid in your coding process.
- Run the command to fix all auto-fixable formatting errors in the whole project based on `eslint` rules.

  ```
  npm run lint
  ```

- Run the command to check and fix file formatting with `prettier`

  ```
  npm run format
  ```

- Also linting has been set up for staged commits in the project.

  <br/>

### Deployment on Render

- Application is on auto deploy from Github to Render.
