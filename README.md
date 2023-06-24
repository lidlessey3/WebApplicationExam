[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8AapHqUJ)
# Exam #1: "CMSmall"
## Student: s314895 Pavarino Leonardo 

## React Client Application Routes

- Route `/`: it contains the list of published pages, and in case a user is logged in it also displays a list of the pages that are either draft or scheduled.
- Route `/login`: it allows the user to log in
- Route `/page/:id/edit`: it allows a logged in user to edit a page, param id specifies the id of the page that is being edited
- Route `/page/:id`: it allows a logged in user and a non logged in user to visualize the content of a page, param id specifies the id of the page
- Route `/page/new`: it allows a logged in user to create a new page
- Route `/admin`: it allows an admin to change the name of the website
- Route `/*`: it shows a basic 404 error, with a link back to '/'

## API Server

- POST `/api/session`
  - used to log in
  - request body content:
  ```
  {
    username: email address,
    password: password
  }
  ```
  - response body content if login is successful:
  ```
  {
    id: the id of the user,
    name: the username of the user,
    admin: 0 if not admin 1 if admin
  }
  ```
- DELETE `/api/session/current`
  - Logs out of the application
  - request body content: none
  - response body content: none
- GET `/api/session/current`
  - Gets the info of the current logged in user
  - response body content:
  ```
  {
    id: id of the user,
    name: the username of the user,
    admin: 0 if not admin 1 if admin
  }
  ```
- GET `/api/site/name`
  - returns the website name
  - response body content:
  ```
  {value: the name of the website}
  ```
- PUT `/api/site/name`
  - sets the name of the website
  - request body: 
  ```
  {value: the new name of the website}
  ```
- GET `/api/pages`
  - if the user is not logged in it returns a list of all published pages with this format sorted by publication date:
  ```
  [
    {
      title: title of the page,
      author: {
        id: id of the author,
        name: username of the author
      },
      publicationDate: date of the publication,
      id: id of the page
    },
    ...
  ]
  ```
  - if the user is logged in instead it returns a list of all pages (published and not) with the following format:
  ```
  [
    {
      title: title of the page,
      author: {
        id: id of the author,
        name: username of the author
      },
      publicationDate: date of the publication,
      creationDate: the date the page was created,
      id: id of the page
    },
    ...
  ]
  ```
- GET `/api/pages/:id`
  - parameters: id of the page to retrieve
  - returns the content of the page as a sorted list with the following format:
  ```
  [
    {
      elementType: the type of the element,
      elementData: the content of the element
    },
    ...
  ]
  ```
- PUT `/api/pages/:id`
  - parameters: id of the page to modify
  - Request body:
  ```
  {
    title: the title to set,
    author: the new author of the page (can only be modified by an admin),
    publicationDate: the publication date,
    content: [
      {
        elementType,
        elementData
      },
      ...
    ]
  }
  ```
- DELETE `/api/pages/:id`
  - parameters: id of the page to delete
- POST `/api/pages/new`
  - creates a new page
  - request body:
  ```
  {
    title: the title,
    author: the author of the page (must be the same as the logged in user, unless the user is an admin),
    publicationDate: the publication date,
    content: [
      {
        elementType,
        elementData
      },
      ...
    ]
  }
  ```
  - response body:
  ```
  {
    id: the id of the created page
  }
  ```
- GET `/api/users/list`
  - response:
  ```
  [
    {
      id: id of the user,
      name: username of the user
    },
    ...
  ]
  ```

## Database Tables

- Table `users` - contains id username mail password salt admin{boolean value}
- Table `pages` - contains id creationDate publicationDate author[users(id)] title
- Table `pagescontent` - contains id position page[pages(id)] type CONTENT
- Table `settings` - contains setting{the name of the setting(in this case only websiteName)} value

### Legend:
- [FOREIGN KEY]
- {Comment}

## Main React Components

- `TopBar` (in `topBar.jsx`): It is responsible for the navbar that is displayed in all pages, it also allows a user to log in, log out, access the admin settings
- `PageList` (in `PageList.jsx`): it shows a list of the published pages in a table, also in case the user is logged in it additionally shows a button to add more components and a button to create more pages and a separate table with all the unpublished pages
- `PageEditorForm` (in `pageEditorForm.jsx`): it allows the logged in user to edit an existing page or create a new one, it performs checks to assure that the input data is valid (e.g. the title is not empty, the publication date is not before the creation date, ...), the user can discard changes by clicking on the back arrow or saving them by clicking on save
- `PageEditorArea` (in `pageEditorForm.jsx`): it is the area where all the components of the page are rendered, they can be edited and their position can be changed through the use of arrows buttons
- `PageDisplay` (in `pageDisplay.jsx`): it show the a page contents rendering all the different types of components in the correct order
- `LoginForm` (in `loginForm.jsx`): it allows the user to log in entering their email and password, it also checks the fields are compiled in a correct way.
- `AdminPanel` (in `adminPanel.jsx`): it allows the admins to change the title of the website, checking that the field is not empty.

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- virgilio@rome.it, Eneide is an admin
- orazio@rome.it, LeOdi not an admin
- seneca@rome.it, BrevitateVitae is an admin
- giovenale@rome.it, LeSatire not an admin
