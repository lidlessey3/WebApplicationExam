import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/API';

function TopBar(props) {
    const navigate = useNavigate();
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
                        <div className='card border-light bg-info padding-05rem'>
                            <i className='icon-size text-light'>Log In</i>
                        </div>
                    </Link></Nav.Item> : <>
                        <Nav.Item className='margin-right-02rem'><div className='card border-light bg-info padding-05rem'><i className='icon-size text-light'>{props.user.name}</i></div></Nav.Item>
                        <Nav.Item className='margin-right-02rem'><Button variant='outline-light' onClick={(event) => {
                            logout()
                                .then((result) => {
                                    props.updateUser(undefined);
                                    navigate('/');
                                });
                        }}>Log Out</Button></Nav.Item>
                        {props.user.admin === 1 ? <Nav.Item><div className='card border-light bg-info padding-05rem'>
                            <Link to='/admin' className='text-light'>Admin Options</Link>
                        </div></Nav.Item> : <></>}
                    </>}
                </Nav>
            </Navbar>
        </>
    );
}

export default TopBar