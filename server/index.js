"use strict";

const dayjs = require('dayjs');
const express = require('express');
const passport = require('passport');
const strategy = require('passport-local');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const db = require('./database');
const authentication = require('./authentication');


const app = express();

app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true,
    cookie: {
        sameSite: 'none'
    }
}
app.use(cors(corsOptions));

passport.use(new strategy(async (username, password, cb) => {
    const user = await authentication.authenticateUser(username, password);
    if (user)
        return cb(null, user);
    return cb(null, false, 'Incorrect username or password.');
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    console.log('deserializing');
    return cb(null, user);
});

app.use(session({
    secret: "I am a mysterious string",
    resave: false,
    saveUninitialized: false,
    httpOnly: true
}));
app.use(passport.authenticate('session'));

function checkLoggedIn(req, res, next) {
    if (!req.isAuthenticated())
        res.status(401).json({ error: 'forbidden, you must be authenticated to perform this action' });
    return next();
}

// Begin API workings
/*
    # API
## /api/session
### POST

sets the session cookie
*/
app.post('/api/session', function (req, res, next) {
    console.log("Received the following login request:");
    console.log(req.body);
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json({ error: info });
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            console.log(req.session);
            return res.status(201).json(req.user);
        });
    })(req, res, next);
});

app.get('/api/session/current', (req, res, next) => {
    res.json(req.user);
});
/*
## /api/session/current
### DELETE

removes the session cookie
*/
app.delete('/api/session/current', (req, res) => {
    console.log("logging out");
    req.logout(() => {
        res.end();
    });
});
/*
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
*/
app.get('/api/pages', (req, res) => {
    let elaborate = async (value) => {
        console.log(value);
        res.status(200).json(value.map((elem) => {
            let result = {
                title: elem.title,
                author: { id: elem.authorID, name: elem.username }, publicationDate: elem.publicationDate, id: elem.id
            }
            if (elem.creationDate !== undefined)
                result.creationDate = elem.creationDate;
            return result;
        }));
    };
    if (req.isAuthenticated())
        db.getAllPages().then(elaborate);
    else
        db.getPublishedPages().then(elaborate);
});
/*
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
*/
app.get('/api/pages/:id', async (req, res, next) => {
    // first check if the page is published and if it is not check if the user is logged in
    // if he isn't return an error
    let page = await db.getPageByID(req.params.id);

    if (dayjs().isBefore(dayjs(page.publicationDate)) && !req.isAuthenticated())
        res.status(401).send("You must be logged in to access this resource.");
    else
        res.status(200).json((await db.getPageContent(req.params.id)).map((elem) => { elementType: elem.type; elementData: elem.CONTENT }));
})
/*
### POST
if the user is logged in and can apply changes the page is updated

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
        content: [
            {
                elementType,
                elementData
            },
            ...
        ]
    }
}
```*/
app.post('/api/pages/new', checkLoggedIn, (req, res) => {
    db.getUserByID(req.user.id).then((user) => {
        let page = { ...req.body };
        if (page.publicationDate)
            page.publicationDate = dayjs(page.publicationDate);
        if (user === undefined)
            return res.status(401).json({ error: 'Forbidden, you must be authenticated to perform this action' });
        else if (user.id !== page.author && user.admin !== 1)
            return res.status(403).json({ error: 'Only an admin can attribute a page to another user' });
        else if (page.title === undefined || page.title === '')
            return res.status(400).json({ error: 'The title field cannot be empty.' });
        else if (page.publicationDate && page.publicationDate.isBefore(dayjs(), 'day'))
            return res.status(400).json({ error: 'The publication date cannot be in the past.' });

        page.content = page.content.filter((elem) => elem.elementData !== '' && (elem.elementType === 'header' || elem.elementType === 'text' || elem.elementType === 'image'));
        let numHeader = page.content.filter((elem) => (elem.elementType === 'header')).length;
        if (numHeader === 0 || page.content.length === numHeader)
            return res.status(400).json({ error: 'The page must contain at least one header and one among image or text.' });

        db.newPage({ title: page.title, author: page.author, publicationDate: page.publicationDate },
            page.content.map((elem) => ({ type: elem.elementType, CONTENT: elem.elementData }))).then((result) => res.status(200).json(result))
            .catch((err) => console.log(err));
    })
});
/*
## /api/users/list
### GET
Return a list of all the users if the asker is an admin
*/
app.get('/api/users/list', checkLoggedIn, (req, res) => {
    // check if the user is an admin
    db.getUserByID(req.user.id).then((user) => {
        if (user === undefined || user.admin === 0)
            return res.status(403).json({ error: "Only admins can access this" });
        db.getAllUsers().then((result) => {
            return res.status(200).json(result);
        });
    });
});
/*

## /api/site/name
### GET
returns the website name
*/

app.get("/api/site/name", (req, res) => {
    db.getSetting("websiteName").then((result) => {
        res.status(200).json(result);
    });
});

app.listen(4452);
console.log("Listening on port 4452");
