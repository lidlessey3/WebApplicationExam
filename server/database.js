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
            else
                resolve(row);
        });
    });
}

exports.getPageContent = function getPageContent(id) { // returns the content of a page given its id sorted in ascending order
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM pagescontent WHERE page = ?;";
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
        const sql = "SELECT pages.id, publicationDate, title, username, users.id AS authorID FROM pages, users WHERE pages.author = users.id AND publicationDate <= ?;";
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
        const sql = "SELECT pages.id, publicationDate, title, creationDate, username, users.id FROM pages, users WHERE users.id = pages.author;";
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
        db.run(sql, [id], (result, err) => {
            if (err)
                reject(err);
            else
                resolve(result);
        });
    })
}

exports.updatePage = async function updatePage(page, content) {
    const sqlPage = "UPDATE pages SET author = ?, publicationDate = ?, title = ? WHERE id = ?;";
    const sqlNewContent = "INSERT INTO pagescontent(page, position, type, CONTENT) VALUES(?, ?, ?, ?);";
    const sqlRemoveContent = "DELETE FROM pagescontent WHERE page = ?;";
    db.run(sqlPage, [page.author, page.publicationDate.toISOString(), page.title, page.id]);
    db.run(sqlRemoveContent, [page.id], (result, err) => {
        if (err) {
            throw err;
        }
        else
            content.forEach(element => {
                db.run(sqlNewContent, [page.id, element.position, element.type, element.CONTENT]);
            });
    });
}

exports.newPage = async function newPage(page, content) {
    const sqlPage = "INSERT INTO pages(author, publicationDate, creationDate, title) VALUES(?, ?, ?, ?);";
    const sqlNewContent = "INSERT INTO pagescontent(page, position, type, CONTENT) VALUES(?, ?, ?, ?);";
    const now = dayjs();
    return new Promise((resolve, reject) => {
        db.run(sqlPage, [page.author, page.publicationDate ? page.publicationDate.toISOString() : undefined, now.toISOString(), page.title], (result, err) => {
            console.log(result);
            if (err) {
                reject(err);
                return;
            }
            else {
                const sqlNewPage = 'SELECT id FROM pages WHERE author = ? AND creationDate = ? AND title = ?;';
                db.get(sqlNewPage, [page.author, now.toISOString(), page.title], (err, row) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    Promise.all(content.map((element, index) => new Promise((resolve, reject) => {
                        db.run(sqlNewContent, [row.id, index, element.type, element.CONTENT], (result, err) => {
                            if (err)
                                reject(err);
                            else
                                resolve(result);
                        });
                    }))).then((result) => resolve(result)).catch((err) => reject(err));
                });
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

exports.updateSetting = async function updateSetting(setting, value) {
    const sql = "UPDATE settings SET value = ? WHERE setting = ?;";
    db.run(sql, [value, setting]);
}
