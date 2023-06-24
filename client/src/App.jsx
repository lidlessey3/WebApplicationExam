import { useEffect, useState } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import TopBar from './components/topBar';
import PageList from './components/pageList';
import LoginForm from './components/loginForm';
import PageEditorForm from './components/pageEditorForm';
import PageDisplay from './components/pageDisplay';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NotFoundPage from './components/404';
import { Container } from 'react-bootstrap';
import dayjs from 'dayjs';

function App() {
  const [user, changeUser] = useState(undefined);
  const [websiteName, updateWebsiteName] = useState("");
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4452/api/pages', { credentials: "include" }).then((result) => result.json()).then((json) => {
      setPages(json.map((elem) => {
        console.log(elem);
        return {
          id: elem.id, publicationDate: elem.publicationDate ? dayjs(elem.publicationDate) : undefined,
          creationDate: elem.creationDate ? dayjs(elem.creationDate) : undefined, title: elem.title, author: { id: elem.author.id, name: elem.author.name }
        };
      }));
    });
  }, [user]);

  useEffect(() => {
    fetch('http://localhost:4452/api/site/name').then((res) => res.json()).then((res) => updateWebsiteName(res.value));
    const interval = setTimeout(() => fetch('http://localhost:4452/api/site/name').then((res) => res.json()).then((res) => updateWebsiteName(res.value)), 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('http://localhost:4452/api/session/current', { credentials: "include" }).then((answer) => answer.json()).then((answer) => {
      if (answer.error !== undefined && answer !== user)
        changeUser(answer);
    }, (err) => changeUser(undefined));
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<>
            <TopBar user={user} websiteName={websiteName} updateUser={changeUser}></TopBar>
            <Container fluid className='d-flex align-items-stretch'>
              <Outlet></Outlet>
            </Container></>}>
            <Route element={<><PageList user={user} pages={pages}></PageList></>} path='/'>

            </Route>
            <Route element={<><LoginForm updateUser={changeUser} /></>} path='/login'>

            </Route>
            <Route element={<><PageEditorForm user={user} pages={pages} setPages={setPages} /></>} path='/page/:id/edit'>

            </Route>
            <Route element={<><PageDisplay /></>} path='/page/:id'>
            </Route>
            <Route element={<><PageEditorForm user={user} pages={pages} setPages={setPages} /></>} path='/page/new'>

            </Route>
            <Route element={<><NotFoundPage /></>} path='*'>

            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
