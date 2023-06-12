# API
## /api/session
### POST

sets the session cookie

## /api/session/current
### DELETE

removes the session cookie

## /api/pages

### GET

returns a list of all published pages with the following info:
```
{
    [
        {
            title,
            author,
            publicationDate,
            id
        },
        ...
    ]
}
```

## /api/pages/:id
### GET

if the page is published it returns the page, if it is scheduled or draft it will check that the user is logged in before returning the page otherwise it will return an error.

Return format:
```
{
    [
        {
            elementType,
            elementData
        },
        ...
    ]
}
```

### POST
if the user is logged in and can apply changes the page is updated

Post format:
```
{
    {
        title,
        author,
        publicationDate,
        content: [
            {
                elementType,
                elementData
            },
            ...
        ]
    }
}
```

### DELETE
if the user has permission delete the page

## /api/pages/new
### POST
creates the page:
Post format:
```
{
    {
        title,
        author,
        publicationDate,
        id,
        content: [
            {
                elementType,
                elementData
            },
            ...
        ]
    }
}
```

## /api/users/list
### GET
Return a list of all the users if the asker is an admin

## /api/user/new
### POST
creates a new user:
Post format:
```
{
    mail,
    displayname,
    password
}
```

## /api/site/name
### GET
returns the website name