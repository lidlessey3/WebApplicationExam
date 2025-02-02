import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Row, Col, Container, Button } from 'react-bootstrap';
import { ContentHeather, ContentImage, ContentText } from "./pageContent";
import { getPagesContent, deletePage } from "../utils/API";

function PageDisplay(props) {
    const { id } = useParams();
    const [page, setPage] = useState({ author: {} });
    const [components, setComponents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getPagesContent(id).then((response) => {
            if (response.error) {
                setErrors([response.error]);
                return;
            }
            setComponents(response);
            setPage(props.pages.find((elem) => elem.id == id));
        });
    }, []);

    return (
        <>
            <Row className="d-flex w-100 underNav">
                <Col md='auto' className="d-flex flex-column">
                    <i className="bi bi-arrow-left-circle" id="backArrow" onClick={() => {
                        navigate(-1);
                    }}></i>
                    {props.user && page ? (props.user.admin || props.user.id === page.author.id) ? <>
                        <div className="outline-info card text-light margin-top-05rem">
                            <Link to='edit'><i className="bi bi-pencil-fill"></i></Link>
                        </div>
                        <Button variant='outline-danger' className="margin-top-05rem" onClick={() => {
                            deletePage(id).then((result) => {
                                if (!result.error) {
                                    let newPages = [];
                                    for (let i = 0; i < props.pages.length; i++) {
                                        if (page.id !== props.pages[i].id)
                                            newPages.push(props.pages[i]);
                                    }
                                    props.setPages(newPages);
                                    navigate(-1);
                                }
                                else
                                    console.log(result.error);
                            });
                        }}><i className="bi bi-trash3-fill"></i></Button>
                    </> : <></> : <></>}
                </Col>
                <Col md={11} id="ViewContent">
                    <Container fluid className="d-flex flex-wrap">
                        <Row className="w-100">
                            <div className="w-100 d-flex justify-content-center align-items-center flex-column">
                                <h1>{page ? page.title : ''}</h1><br />
                                <h2>By {page.author.name}</h2><br />
                                <h5>{page.publicationDate ? "Published on " + page.publicationDate.format('YYYY-MM-DD') : ''}
                                    {page.creationDate ? ' Created on ' + page.creationDate.format('YYYY-MM-DD') : ''}</h5>
                            </div>
                        </Row>
                        <PageVisualize components={components}></PageVisualize>
                    </Container>
                </Col>
            </Row >
        </>
    );
}

function PageVisualize(props) {
    return (
        <>
            <Row className="d-flex w-100 align-items-start flex-column">
                {props.components.map((element, index) => {
                    switch (element.elementType) {
                        case 'header':
                            return (<ContentHeather key={index} data={element}></ContentHeather>);
                        case 'text':
                            return (<ContentText key={index} data={element}></ContentText>);
                        case 'image':
                            return (<ContentImage key={index} data={element}></ContentImage>);
                    }
                })}
            </Row>
        </>
    );
}

export default PageDisplay;