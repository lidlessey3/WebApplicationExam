'use strict';

const sqlite = require('sqlite3');
const crypto = require('crypto');

const db = new sqlite.Database('database.db', (err) => {
    if (err) throw err;
});

const username = "Virgilio";
const email = "virgilio@rome.it";
const password = "Eneide";
const admin = true;

const sql = "INSERT INTO users(username, email, password, salt, admin) VALUES(?, ?, ?, ?, ?);";

function generateSalt() {
    let secret = '';
    let characters = "ABCDEF0123456789";
    let len = characters.length;

    for (let i = 0; i < 32; i++) {
        secret += characters.charAt(Math.random() * len);
    }

    console.log(secret);
    return secret;
}

const salt = generateSalt();

crypto.scrypt(password, Buffer.from(salt, 'hex'), 32, (err, key) => {
    console.log(key.toString('hex'));
    db.run(sql, [username, email, key.toString('hex'), salt, admin]);
});