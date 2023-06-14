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
            return res.status(401).json({error: info });
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
        res.status(200).json((await db.getPageContent(req.params.id)).map((elem) => { elementType: elem.type;  elementData: elem.CONTENT}));
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
*/
app.get('/api/users/list', (req, res) => {
    // check if the user is an admin
    if (req.user === undefined || req.user.admin !== 1)
        return res.status(401).json({ error: "Only admins can access this" });
    db.getAllUsers().then((result) => {
        return res.status(200).json(result);
    });
})
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
