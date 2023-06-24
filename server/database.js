"use strict";

const dayjs = require("dayjs");
const sqlite = require("sqlite3");

const db = new sqlite.Database('database.db', (err) => {
    if (err) throw err;
});

/*
*************************DATABASE STRUCTURE*********************************
TABLE users:
id,
username,
mail,
password,
salt,
admin

TABLE pages:
id,
creationDate,
publicationDate,
author -> users(id),
title

TABLE pagescontent:
id,
position,
page -> pages(id),
type,
CONTENT

TABLE settings:
setting,
value

*/

exports.getUserByID = function getUserByID(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE id = ?;";
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getAllUsers = function getAllUsers() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT username AS name, id FROM users;";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

exports.getUserByMail = function getUserByMail(mail) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM users WHERE email = ?;";
        db.get(sql, [mail], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.getPageByID = function getPageByID(id) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM pages WHERE id = ?;";
        db.get(sql, [id], (err, row) => {
            if (err)
                reject(err);
            else if (row)
                resolve(row);
            else
                reject('Not found');
        });
    });
}

exports.getPageContent = function getPageContent(id) { // returns the content of a page given its id sorted in ascending order
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM pagescontent, pages, users WHERE page = ? AND pages.id = page AND author = users.id;";
        db.all(sql, [id], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.sort((a, b) => a.position - b.position));
        });
    });
}

exports.getPublishedPages = function getPublishedPages() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id, publicationDate, title, username FROM pages, users WHERE pages.author = users.id AND publicationDate <= ?;";
        db.all(sql, [dayjs().toISOString()], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows.sort((a, b) => dayjs(a.publicationDate).isAfter(dayjs(b.publicationDate)) ? 1 : -1));
        });
    });
}

exports.getAllPages = function getAllPages() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT pages.id, publicationDate, title, creationDate, username, users.id AS authorID FROM pages, users WHERE users.id = pages.author;";
        db.all(sql, [], (err, rows) => {
            if (err)
                reject(err);
            else
                resolve(rows);
        });
    });
}

exports.deletePage = function deletePage(id) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM pages WHERE id = ?;";
        const sqlRemoveContent = "DELETE FROM pagescontent WHERE page = ?;";
        db.run(sql, [id], (err) => {
            if (err)
                reject(err);
            else
                db.run(sqlRemoveContent, [id], (err) => {
                    if (err)
                        reject(err);
                    else
                        resolve(true);
                })
        });
    })
}

exports.updatePage = function updatePage(page, content) {
    const sqlPage = "UPDATE pages SET author = ?, publicationDate = ?, title = ? WHERE id = ?;";
    const sqlNewContent = "INSERT INTO pagescontent(page, position, type, CONTENT) VALUES(?, ?, ?, ?);";
    const sqlRemoveContent = "DELETE FROM pagescontent WHERE page = ?;";
    console.log(page, content);
    return new Promise((resolve, reject) => {
        db.run(sqlPage, [page.author, page.publicationDate ? page.publicationDate.toISOString() : undefined, page.title, page.id], (err) => {
            if (err)
                reject(err);
            else
                db.run(sqlRemoveContent, [page.id], function (err) {
                    if (err) {
                        reject(err);
                    }
                    else
                        Promise.all(content.map((element, index) => {
                            return new Promise((resolve, reject) => db.run(sqlNewContent, [page.id, index, element.type, element.CONTENT], (err) => {
                                if (err)
                                    reject(err);
                                else
                                    resolve(true);
                            }));
                        })).then((result) => {
                            resolve(true);
                        }).catch((err) => {
                            reject(err);
                        });
                });
        });
    });
}

exports.newPage = function newPage(page, content) {
    const sqlPage = "INSERT INTO pages(author, publicationDate, creationDate, title) VALUES(?, ?, ?, ?);";
    const sqlNewContent = "INSERT INTO pagescontent(page, position, type, CONTENT) VALUES(?, ?, ?, ?);";
    const now = dayjs();
    return new Promise((resolve, reject) => {
        db.run(sqlPage, [page.author, page.publicationDate ? page.publicationDate.toISOString() : undefined, now.toISOString(), page.title], function (err) {
            console.log(this.lastID);
            if (err) {
                reject(err);
                return;
            }
            else {
                Promise.all(content.map((element, index) => new Promise((resolve, reject) => {
                    db.run(sqlNewContent, [this.lastID, index, element.type, element.CONTENT], (result, err) => {
                        if (err)
                            reject(err);
                        else
                            resolve(result);
                    });
                }))).then((result) => resolve({id: this.lastID})).catch((err) => reject(err));
            }
        });
    });
}

exports.getSetting = function getSetting(setting) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT value FROM settings WHERE setting = ?;"
        db.get(sql, [setting], (err, row) => {
            if (err)
                reject(err);
            else
                resolve(row);
        });
    });
}

exports.updateSetting = function updateSetting(setting, value) {
    const sql = "UPDATE settings SET value = ? WHERE setting = ?;";
    return new Promise((resolve, reject) => {
        db.run(sql, [value, setting], function (err) {
            if (err)
                reject(err);
            else if (this.changes === 0)
                reject('Not found');
            else
                resolve(true);
        });
    });
}
