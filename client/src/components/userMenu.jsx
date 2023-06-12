import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css'
import './../style/userMenu.css'
import dayjs from 'dayjs';

function UserMenu(props) {
    return (
        <>
            <Link to='/page/new'>
                <div className="w-100 card bg-primary text-light align-items-center d-flex"><h3 id="createNewButton"><i className="bi bi-plus-circle-fill"></i> Create new</h3></div>
            </Link>
            <Table>
                <tbody>
                    {props.pages.map((page) => <UnpublishedRow key={page.id} page={page} user={props.user}></UnpublishedRow>)}
                </tbody>
            </Table>
        </>
    );
}

function UnpublishedRow(props) {
    return (
        <>
            <tr>
                <td>
                    <h4><Link to={'/page/' + props.page.id}>{props.page.title}</Link></h4>
                </td>
                <td>
                    <i>{'by ' + props.page.author.username}</i>
                </td>
                <td>
                    <p className="text-secondary">{props.page.creationDate.format("DD/MM/YYYY")}</p>
                </td>
                {(props.user.id === props.page.author.id || props.user.admin === 1) ? <td>
                    <Link to={'/page/' + props.page.id + '/edit'}><div className="card outline-secondary"><i className="bi bi-pencil-fil"></i></div></Link>
                </td> : <></>}
            </tr>
        </>
    );
}

export default UserMenu;