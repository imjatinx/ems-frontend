# An Employee Management System

Clone this repository or download the project directly.

In the project directory, you can run:

### `npm install` 
or 
### `npm i`

It can automatically install all dependencies from package.json file

To start the nodejs Server, run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Libraries used in this project

### reactjs, react-hook-form, react-icons, bootstrap, react-router-dom, react-toastify (for alert messages) and axios.

## Techniques used in this project

#### 1. User login/signed up with their credentials, they will redirected to the profile/home page.
#### 2. without login, users can not visit protected routes (used custom component to verify token and fetch profile).
#### 3. if the login user's role is employee, they will see only 1 tab for profile information.
#### 4. if the login user's role is manager, they will see only 3 more tab other than profile such as Employees, Managers, Departments.
#### 5. A user with role manager is created at the time of project building from directly database.
#### 6. then managers can operate employees, other managers and departments
#### 7. but the current loggedin (self) manager can not delete and update their associated department and role.
#### 8. if the employee role user wants to reach out to the manager routes from url bar then the system will automatically logged out and end the session.

## Usages
### Configuration:

This app integrates the backends APIs so that make sure to start the backend project's server first. prefer Readme.md file of the backend project.

### Functionality:
There are login and signup functionality available for employees and only login available for managers ( Signup not for managers because a manager can create/assign a manager ).

There are 4 sections for users
#### 1. See their profile (For both employee and managers)
#### 2. Create, Update, Delete, See All Employees (Only for managers)
#### 3. Filter employees in ascending and descending order according to their name and location (Only for managers)
#### 4. Create, Update, Delete, See All Manager (Only for managers)
#### 5. Create, Update, Delete, See All Department (Only for managers)
#
# Happy New Year All of You.
###### created by Jatin Gautam.
