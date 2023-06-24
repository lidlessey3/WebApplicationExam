import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Col, Container } from 'react-bootstrap';
import { ContentHeather, ContentImage, ContentText } from "./pageContent";

function PageDisplay(props) {
    const { id } = useParams();
    const [page, setPage] = useState({ title: '' });
    const [components, setComponents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:4452/api/pages/' + id, { credentials: 'include' }).then((response) => response.json()).then((response) => {
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
                    {props.user ? (props.user.admin || props.user.id === page.author.id) ? <>
                        <i className="bi bi-pencil-fill"></i>
                        <i className="bi bi-pencil-fill"></i>
                    </> : <></> : <></>}
                </Col>
                <Col md={11} id="ViewContent">
                    <Container fluid className="d-flex flex-wrap">
                        <Row className="w-100">
                            <div className="w-100 d-flex justify-content-center align-items-center">
                                <h1>{page ? page.title : ''}</h1>
                            </div>
                        </Row>
                        <PageVisualize components={components}></PageVisualize>
                    </Container>
                </Col>
            </Row>
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