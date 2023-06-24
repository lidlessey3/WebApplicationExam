import { useEffect, useState } from "react";
import { Row, Col, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import dayjs from 'dayjs';
import UserMenu from "./userMenu";
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
    console.log(this);
}

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
                    }).sort((a, b) => a.creationDate.isAfter(b.creationDate) ? 1 : -1)}></UserMenu></Col><Col md={8} xl={9}><PageTable user={props.user}
                        pages={props.pages.filter((elem) => {
                            if (elem.publicationDate === undefined)
                                return false;
                            else
                                return dayjs().isAfter(elem.publicationDate, 'day') || dayjs().isSame(elem.publicationDate, 'day');
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
                    <tr>
                        <td>Title</td>
                        <td>Author</td>
                        <td>Publication Date</td>
                    </tr>
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
                        <Button variant="outline-danger" onClick={() => { }}><i className="bi bi-trash3-fill"></i></Button>
                    </td>
                </> : <></>}
            </tr>
        </>
    );
}

export default PageList;