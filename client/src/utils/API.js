"strict mode";

function getPagesList() {
    return fetch('http://localhost:4452/api/pages', { credentials: "include" }).then((res) => res.json());
}

function getWebsiteName() {
    return fetch('http://localhost:4452/api/site/name').then((res) => res.json());
}

function setWebsiteName(siteName) {
    return fetch('http://localhost:4452/api/site/name', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ value: siteName }),
    }).then((res) => res.json())
}

function login(email, password) {
    return fetch('http://localhost:4452/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username: email, password: password }),
    }).then((response) => response.json());
}

function logout() {
    return fetch('http://localhost:4452/api/session/current', { method: 'DELETE', credentials: 'include' }).then((result) => result.json());
}

function getCurrentUser() {
    return fetch('http://localhost:4452/api/session/current', { credentials: "include" }).then((res) => res.json())
}

function getUserList() {
    return fetch("http://localhost:4452/api/users/list", { credentials: "include" }).then((response) => response.json());
}

function getPagesContent(id) {
    return fetch('http://localhost:4452/api/pages/' + id, { credentials: 'include' }).then((response) => response.json());
}

function editPage(id, title, authorID, publicationDate, components) {
    return fetch('http://localhost:4452/api/pages/' + id, {
        credentials: 'include',
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title, author: authorID,
            publicationDate: publicationDate, content: components
        })
    }).then(response => response.json());
}

function deletePage(id) {
    return fetch('http://localhost:4452/api/pages/' + id, { method: 'DELETE', credentials: 'include' }).then((result) => result.json());
}

function createPage(title, authorID, publicationDate, components) {
    return fetch('http://localhost:4452/api/pages/new', {
        credentials: 'include',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: title, author: authorID,
            publicationDate: publicationDate, content: components
        })
    }).then(response => response.json());
}

export { getPagesList, getWebsiteName, getCurrentUser, setWebsiteName, getPagesContent, deletePage, login, getUserList, createPage, editPage, logout };
