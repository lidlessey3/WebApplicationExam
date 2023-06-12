[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/8AapHqUJ)
# Exam #1: "CMSmall"
## Student: s314895 Pavarino Leonardo 

## React Client Application Routes

- Route `/`: page content and purpose
- Route `/something/:param`: page content and purpose, param specification
- ...

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
    admin: boolean value that indicates whether the user is an admin
  }
  ```
  - If login is not successful then the result is:
  ```
  {error: 'Incorrect username or password'}
  ```
- DELETE `/api/session/current`
  - Logs out of the application
  - request body content: none
  - response body content: none 
- GET `/api/site/name`
  - returns the website name
  - response body content:
  ```
  {value: the name of the website}
  ```
- GET `/api/pages`
  - if the user is not logged in it returns a list of all published pages with this format sorted by publication date:
  ```
  {
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
  }
  ```
  - if the user is logged in instead it returns a list of all pages (published and not) with the following format:
  ```
  {
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
  }
  ```
- GET `/api/pages/:id`
  - parameters: id of the page to retrieve
  - returns the content of the page as a sorted list with the following format:
  ```
  {
    [
      {
        elementType: the type of the element,
        elementData: the content of the element
      },
      ...
    ]
  }
  ```
- POST `/api/pages/:id`
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
- GET `/api/users/list`
  - response:
  ```
  {
    [
      {
        id: id of the user,
        name: username of the user
      },
      ...
    ]
  }
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

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- virgilio@rome.it, Eneide is an admin
- username, password (plus any other requested info)
