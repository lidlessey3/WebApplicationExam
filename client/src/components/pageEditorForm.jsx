import { useEffect, useState } from "react";
import { Row, Col, Form, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './../style/pageEditorForm.css'
import dayjs from 'dayjs';


function PageEditorForm(props) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(undefined);
    const [components, setComponents] = useState([]);
    const [publicationDate, setPublicationDate] = useState(dayjs());
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.user === undefined) {
            navigate('/');
            return;
        }
        setAuthor({ name: props.user.name, id: props.user.id });
        if (props.user.admin !== 1)
            return;
        else
            fetch("http://localhost:4452/api/users/list", { credentials: "include" }).then((response) => response.json()).then((response) => {
                setUsers(response);
            });
    }, [props.user]);

    return (
        <>
            <Row className="d-flex w-100 underNav" id="newPageForm">
                <Col md='auto'>
                    <i className="bi bi-arrow-left-circle" id="backArrow" onClick={() => {
                        navigate(-1);
                    }}></i>
                </Col>
                {props.user ? <>
                    <Col md={9} id="EditContent">
                        <Container fluid className="d-flex flex-wrap">
                            <Row className="w-100" id="titleForm">
                                <div className="w-100 bg-light">
                                    <Form>
                                        <div className="d-flex justify-content-center align-items-center" id="title-tile">
                                            Title:<Form.Control type="text" required placeholder="Lorem Ipsum" value={title} onChange={(event) => setTitle(event.target.value)}></Form.Control><br />
                                        </div>
                                    </Form>
                                </div>
                            </Row>
                            <PageEditorArea components={components} updateComponents={setComponents}></PageEditorArea>
                        </Container>
                    </Col>
                    <Col md="auto" id="pageSettings">
                        <Form>
                            <div className="d-flex justify-content-beginning align-items-center">
                                Author: {props.user.admin === 1 ? <Form.Select className="w-auto" value={JSON.stringify(author)} onChange={(event) => {
                                    setAuthor(JSON.parse(event.target.value));
                                }}>
                                    {users.map((user) => <option key={user.id} value={JSON.stringify(user)}>{user.name}</option>)}
                                </Form.Select> : props.user.name}
                            </div>
                            <div className="d-flex justify-content-beginning align-items-center">
                                Publication date: <Form.Control type='date' className="w-auto" value={publicationDate.format('YYYY-MM-DD')} onChange={(event) => {
                                    setPublicationDate(dayjs(event.target.value, 'YYYY-MM-DD'))
                                }}></Form.Control>
                            </div>
                        </Form>
                        <PageComponent></PageComponent>
                    </Col>
                </> : <></>}
            </Row>
        </>
    );
}

function PageComponent(props) {
    return (
        <>
            
        </>
    );
}

function PageEditorArea(props) {
    return (<>
        <Row className="d-flex w-100" id="dropArea">
            <div className="w-100" id="backgroundText">
                <p>Drag Something Here</p>
                
            </div>
        </Row>
    </>)
}

export default PageEditorForm;