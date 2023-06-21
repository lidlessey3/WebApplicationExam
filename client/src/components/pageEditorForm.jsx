import { useEffect, useState } from "react";
import { Row, Col, Form, Container, Button } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import './../style/pageEditorForm.css'
import dayjs from 'dayjs';
import { ContentHeatherEditor, ContentImageEditor, ContentTextEditor } from "./pageContent";


function PageEditorForm(props) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(undefined);
    const [components, setComponents] = useState([]);
    const [publicationDate, setPublicationDate] = useState(undefined);
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
                            <div className="d-flex justify-content-beginning align-items-center margin-top-05rem">
                                Author: {props.user.admin === 1 ? <Form.Select className="w-auto" value={JSON.stringify(author)} onChange={(event) => {
                                    setAuthor(JSON.parse(event.target.value));
                                }}>
                                    {users.map((user) => <option key={user.id} value={JSON.stringify(user)}>{user.name}</option>)}
                                </Form.Select> : props.user.name}
                            </div>
                            <div className="d-flex justify-content-beginning align-items-center margin-top-05rem">
                                Publication date: <Form.Control type='date' className="w-auto" value={publicationDate ? publicationDate.format('YYYY-MM-DD') : ''} onChange={
                                    (event) => {
                                        if (event.target.value !== '')
                                            setPublicationDate(dayjs(event.target.value, 'YYYY-MM-DD'));
                                        else
                                            setPublicationDate(undefined);
                                    }}></Form.Control>
                            </div>
                        </Form>
                        <PageComponentAdder components={components} setComponents={setComponents}></PageComponentAdder>
                    </Col>
                </> : <></>}
            </Row>
        </>
    );
}

function PageComponentAdder(props) {
    return (
        <>
            <Button variant="outline-primary" className="w-100 margin-top-05rem" onClick={(event) => {
                props.setComponents([...props.components, { elementType: 'header', elementData: '' }]);
            }}>Add Header</Button>
            <Button variant="outline-primary" className="w-100 margin-top-05rem" onClick={(event) => {
                props.setComponents([...props.components, { elementType: 'text', elementData: '' }]);
            }}>Add Text</Button>
            <Button variant="outline-primary" className="w-100 margin-top-05rem" onClick={(event) => {
                props.setComponents([...props.components, { elementType: 'image', elementData: 0 }]);
            }}>Add Image</Button>
        </>
    );
}

function PageEditorArea(props) {
    return (<>
        <Row className="d-flex w-100 align-items-start flex-column" id="dropArea">
            {props.components.length === 0 ? <div className="w-100" id="backgroundText">
                <p>Add something to start working</p>
            </div> : <></>}
            {props.components.map((element, index) => {
                let remove = () => {
                    let newComponents = Array(...props.components);
                    newComponents.splice(index, 1);
                    props.updateComponents(newComponents);
                }
                let updateItem = (newItem) => {
                    let newComponents = Array(...props.components);
                    newComponents.splice(index, 1, newItem);
                    props.updateComponents(newComponents);
                }
                let moveUp = () => {
                    if (index === 0)
                        return;
                    let newComponents = Array(...props.components);
                    let [newItem] = newComponents.splice(index, 1);
                    newComponents.splice(index - 1, 0, newItem);
                    props.updateComponents(newComponents);
                }
                let moveDown = () => {
                    if (index === props.components.length - 1)
                        return;
                    let newComponents = Array(...props.components);
                    let [newItem] = newComponents.splice(index, 1);
                    newComponents.splice(index + 1, 0, newItem);
                    props.updateComponents(newComponents);
                }
                switch (element.elementType) {
                    case 'header':
                        return (<ContentHeatherEditor key={index} data={element} remove={remove} updateItem={updateItem}
                            moveUp={moveUp} moveDown={moveDown}></ContentHeatherEditor>);
                    case 'text':
                        return (<ContentTextEditor key={index} data={element} remove={remove} updateItem={updateItem}
                            moveUp={moveUp} moveDown={moveDown}></ContentTextEditor>);
                    case 'image':
                        return (<ContentImageEditor key={index} data={element} remove={remove} updateItem={updateItem}
                            moveUp={moveUp} moveDown={moveDown}></ContentImageEditor>);
                }
            })}
        </Row>
    </>)
}

export default PageEditorForm;