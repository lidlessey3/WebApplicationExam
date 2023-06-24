import { Table, Button } from "react-bootstrap";
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
                    <tr>
                        <td>Title</td>
                        <td>Author</td>
                        <td>Creation Date</td>
                    </tr>
                    {props.pages.map((page) => {
                        const remove = () => {
                            let newPages = [];
                            for (let i = 0; i < props.allPages.length; i++) {
                                if (page.id !== props.allPages[i].id)
                                    newPages.push(props.allPages[i]);
                            }
                            console.log(props.allPages);
                            console.log(newPages);
                            props.setPages(newPages);
                        };
                        return (<UnpublishedRow key={page.id} page={page} user={props.user} remove={remove}></UnpublishedRow>);
                    })}
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
                    <i>{'by ' + props.page.author.name}</i>
                </td>
                <td>
                    <p className="text-secondary">{props.page.creationDate.format("DD/MM/YYYY")}</p>
                </td>
                {(props.user.id === props.page.author.id || props.user.admin === 1) ? <>
                    <td>
                        <Link to={'/page/' + props.page.id + '/edit'}><div className="card outline-secondary"><i className="bi bi-pencil-fill"></i></div></Link>
                    </td>
                    <td>
                        <Button variant="outline-danger" onClick={() => { 
                             fetch('http://localhost:4452/api/pages/' + props.page.id, { method: 'DELETE', credentials: 'include' }).then((result) => result.json())
                             .then((result) => {
                                 console.log(result);
                                 if (!result.error)
                                     props.remove();
                                 else
                                     console.log('AAAAAa', result.error);
                             });
                         }}><i className="bi bi-trash3-fill"></i></Button>
                    </td>
                </> : <></>}
            </tr>
        </>
    );
}

export default UserMenu;