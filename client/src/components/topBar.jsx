import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TopBar(props) {
    return (
        <>
            <Navbar bg="info" expand="sm" variant='dark' fixed='top' className='navbar-padding'>
                <Navbar.Brand id="navName">
                    <Link to='/'>
                        <i className='icon-size text-light'>
                            {props.websiteName}
                        </i>
                    </Link>
                </Navbar.Brand>
                <Nav id="userDetails">
                    {props.user === undefined ? <Nav.Item><Link to='/login'>
                        <i className='icon-size text-light'>Log In</i>
                    </Link></Nav.Item> : <>
                        <Nav.Item className='margin-right-02rem'><i className='icon-size text-light'>{props.user.name}</i></Nav.Item>
                        <Nav.Item className='margin-right-02rem'><Button variant='outline-light' onClick={(event) => {
                            fetch('http://localhost:4452/api/session/current', { method: 'DELETE', credentials: 'include' }).then((result) => props.updateUser(undefined));
                        }}>Log Out</Button></Nav.Item>
                        {props.user.admin === 1 ? <Nav.Item>
                            <Link to='/admin' className='text-light'>Admin Options</Link>
                        </Nav.Item> : <></>}
                    </>}
                </Nav>
            </Navbar>
        </>
    );
}

export default TopBar