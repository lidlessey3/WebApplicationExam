import { Navbar, Nav } from 'react-bootstrap';
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
                    </Link></Nav.Item> : <><Nav.Item onClick={(event) => {
                            fetch('http://localhost:4452/api/session/current', { method: 'DELETE' }).then((result) => props.updateUser(undefined));
                        }}><i className='icon-size text-light'>{ props.user.name }</i></Nav.Item></>}
                </Nav>
            </Navbar>
        </>
    );
}

export default TopBar