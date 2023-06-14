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

function App() {
  const [user, changeUser] = useState(undefined);
  const [websiteName, updateWebsiteName] = useState("");

  useEffect(() => {
    fetch('http://localhost:4452/api/site/name').then((res) => res.json()).then((res) => updateWebsiteName(res.value));
    const interval = setTimeout(() => fetch('http://localhost:4452/api/site/name').then((res) => res.json()).then((res) => updateWebsiteName(res.value)), 60* 1000);
    
    return () => clearInterval(interval);
  }, [websiteName]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<><TopBar user={user} websiteName={websiteName} updateUser={changeUser}></TopBar><Container fluid><Outlet></Outlet></Container></>}>
            <Route element={<><PageList user={user}></PageList></>} path='/'>

            </Route>
            <Route element={<><LoginForm updateUser={changeUser} /></>} path='/login'>

            </Route>
            <Route element={<><PageDisplay /></>} path='/page/:id'>
              <Route element={<><PageEditorForm /></>} path='edit'>

              </Route>
            </Route>
            <Route element={<><PageEditorForm user={user} /></>} path='/page/new'>

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
