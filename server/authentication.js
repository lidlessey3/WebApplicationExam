'use strict';

const db = require('./database');
const crypto = require('crypto');

exports.authenticateUser = (email, password) => {
    return new Promise((resolve, reject) => {
        db.getUserByMail(email).then((result) => {
            console.log("Found user: ");
            console.log(result);
            if (result === undefined)
                resolve(false);
            else {
                const user = { id: result.id, username: result.email, name: result.username, admin: result.admin };
                crypto.scrypt(password, Buffer.from(result.salt, 'hex'), 32, (err, hashedPassword) => {
                    if (err)
                        reject(err);
                    if (crypto.timingSafeEqual(Buffer.from(result.password, 'hex'), hashedPassword))
                        resolve(user);
                    else
                        resolve(false);
                })
            }
        }, (err) => reject(err));
    });
}