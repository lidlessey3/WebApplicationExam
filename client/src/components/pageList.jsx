import { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import './../style/pageList.css';

function author(id, username) {
    this.id = id;
    this.username = username;
}

function page(id, publicationDate, creationDate, title, author) {
    this.id = id;
    if (publicationDate !== undefined)
        this.publicationDate = dayjs(publicationDate);
    if (creationDate !== undefined)
        this.creationDate = dayjs(creationDate);
    this.title = title;
    this.author = author;
}

function PageList(props) {
    const [pages, updatePages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4452/api/pages').then((result) => result.json()).then((json) => {
            updatePages(json.map((elem) => {
                return new page(elem.id, elem.publicationDate, elem.creationDate, elem.title, new author(elem.author.id, elem.author.name));
            }));
        });
    }, [props.user]);



    return (
        <>
            <Row className='vh-100' id='pageList'>
                {props.user === undefined ? <Col md={12} xl={12} id='pageTable'><PageTable pages={pages}></PageTable></Col> :
                    <><Col md={4} xl={3}></Col><Col md={8} xl={9}><PageTable user={props.user} pages={pages.filter((elem) => {
                        if (elem.publicationDate === undefined)
                            return false;
                        else
                            return dayjs().isAfter(elem.publicationDate);
                    }).sort((a, b) => a.publicationDate.isAfter(b.publicationDate) ? 1 : -1)}></PageTable></Col></>}
            </Row>
        </>
    );
}

function PageTable(props) {
    return (
        <>
            <Table striped>
                <tbody>
                    {props.pages.map((page) => <PageRow page={page} user={props.user} key={page.id} />)}
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
                    <i>{ 'by ' + props.page.author.username }</i>
                </td>
                <td>
                    <p className="text-secondary">{props.page.publicationDate.format("DD/MM/YYYY")}</p>
                </td>
                {(props.user !== undefined && (props.user.id === props.page.author.id || props.user.admin === 1)) ? <td>
                    <Link to={'/page/' + props.page.id + '/edit'}><div className="card outline-secondary"><i className="bi bi-pencil-fil"></i></div></Link>
                </td>:<></> }
            </tr>
        </>
    );
}

export default PageList;