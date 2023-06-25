import { Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import UserMenu from "./userMenu";
import { deletePage } from "../utils/API";
import './../style/pageList.css';

function PageList(props) {
    return (
        <>
            <Row className='w-100 underNav' id='pageList'>
                {props.user === undefined ? <Col md={12} xl={12} id='pageTable'><PageTable pages={props.pages}></PageTable></Col> :
                    <><Col md={4} xl={3}><UserMenu user={props.user} pages={props.pages.filter((elem) => {
                        if (elem.publicationDate === undefined)
                            return true;
                        else
                            return elem.publicationDate.isAfter(dayjs(), 'day');
                    }).sort((a, b) => a.creationDate.isAfter(b.creationDate) ? 1 : -1)} allPages={props.pages} setPages={props.setPages}></UserMenu></Col><Col md={8} xl={9}><PageTable user={props.user}
                        pages={props.pages.filter((elem) => {
                            if (elem.publicationDate === undefined)
                                return false;
                            else
                                return dayjs().isAfter(elem.publicationDate, 'day') || dayjs().isSame(elem.publicationDate, 'day');
                        }).sort((a, b) => a.publicationDate.isAfter(b.publicationDate) ? 1 : -1)}
                        setPages={props.setPages} allPages={props.pages}></PageTable></Col></>}
            </Row>
        </>
    );
}

function PageTable(props) {
    return (
        <>
            <Table striped>
                <tbody>
                    <tr>
                        <td>Title</td>
                        <td>Author</td>
                        <td>Publication Date</td>
                    </tr>
                    {props.pages.map((page, index) => {
                        const remove = () => {
                            if (!props.allPages) {
                                return;
                            }
                            let newPages = [];
                            for (let i = 0; i < props.allPages.length; i++) {
                                if (page.id !== props.allPages[i].id)
                                    newPages.push(props.allPages[i]);
                            }
                            console.log(props.allPages);
                            console.log(newPages);
                            props.setPages(newPages);
                        };
                        return (<PageRow page={page} user={props.user} key={page.id} remove={remove} />);
                    })}
                </tbody>
            </Table>
        </>
    );
}

function PageRow(props) {
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
                    <p className="text-secondary">{props.page.publicationDate ? props.page.publicationDate.format("DD/MM/YYYY") : 'Not published'}</p>
                </td>
                {(props.user !== undefined && (props.user.id === props.page.author.id || props.user.admin === 1)) ? <>
                    <td>
                        <Link to={'/page/' + props.page.id + '/edit'}><div className="card outline-secondary"><i className="bi bi-pencil-fill"></i></div></Link>
                    </td>
                    <td>
                        <Button variant="outline-danger" onClick={() => {
                            deletePage(props.page.id)
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

export default PageList;