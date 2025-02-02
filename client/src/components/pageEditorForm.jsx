import { useEffect, useState } from "react";
import { Row, Col, Form, Container, Button, Collapse } from 'react-bootstrap';
import { useNavigate, useParams } from "react-router-dom";
import './../style/pageEditorForm.css'
import dayjs from 'dayjs';
import { ContentHeatherEditor, ContentImageEditor, ContentTextEditor } from "./pageContent";
import { getUserList, getPagesContent, createPage, editPage } from "../utils/API";

function PageEditorForm(props) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(undefined);
    const [components, setComponents] = useState([]);
    const [publicationDate, setPublicationDate] = useState(undefined);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (props.user === undefined) {
            navigate('/');
            return;
        }
        if (!id)
            setAuthor({ name: props.user.name, id: props.user.id });
        if (props.user.admin !== 1)
            return;
        else
            getUserList().then((response) => {
                setUsers(response);
            });
    }, [props.user]);

    useEffect(() => {
        if (!id)
            return;
        getPagesContent(id).then((response) => {
            if (response.error) {
                setErrors([response.error]);
                return;
            }
            setComponents(response);
            let page = props.pages.find((elem) => elem.id == id);
            setAuthor({ name: page.author.name, id: page.author.id });
            setPublicationDate(page.publicationDate ? dayjs(page.publicationDate) : undefined);
            setTitle(page.title);
        });
    }, []);

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
                                <div className="w-100">
                                    <Form onSubmit={(event) => event.preventDefault()}>
                                        <div className="d-flex justify-content-center align-items-center" id="title-tile">
                                            Title:<Form.Control type="text" required placeholder="Lorem Ipsum" value={title}
                                                onChange={(event) => setTitle(event.target.value)}></Form.Control><br />
                                        </div>
                                    </Form>
                                </div>
                            </Row>
                            <PageEditorArea components={components} updateComponents={setComponents}></PageEditorArea>
                        </Container>
                    </Col>
                    <Col md={2} id="pageSettings">
                        <Form>
                            <div className="d-flex justify-content-beginning align-items-center margin-top-05rem">
                                Author: {props.user.admin === 1 ? <Form.Select className="w-auto" value={JSON.stringify(author)} onChange={(event) => {
                                    setAuthor(JSON.parse(event.target.value));
                                }}>
                                    {users.map((user) => <option key={user.id} value={JSON.stringify(user)}>{user.name}</option>)}
                                </Form.Select> : props.user.name}
                            </div>
                            <div className="d-flex justify-content-beginning align-items-center margin-top-05rem">
                                Publication date: <Form.Control type='date' className="w-auto"
                                    value={publicationDate ? publicationDate.format('YYYY-MM-DD') : ''} onChange={
                                        (event) => {
                                            if (event.target.value !== '')
                                                setPublicationDate(dayjs(event.target.value, 'YYYY-MM-DD'));
                                            else
                                                setPublicationDate(undefined);
                                        }}></Form.Control>
                            </div>
                        </Form>
                        <PageComponentAdder components={components} setComponents={setComponents}></PageComponentAdder>
                        <PageSave components={components} title={title} publicationDate={publicationDate} author={author} setErrors={setErrors} navigate={navigate}
                            pages={props.pages} setPages={props.setPages} id={id} />
                        <SaveError errors={errors}></SaveError>
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
                };
                let updateItem = (newItem) => {
                    let newComponents = Array(...props.components);
                    newComponents.splice(index, 1, newItem);
                    props.updateComponents(newComponents);
                };
                let moveUp = () => {
                    let newComponents = Array(...props.components);
                    let [newItem] = newComponents.splice(index, 1);
                    newComponents.splice(index - 1, 0, newItem);
                    props.updateComponents(newComponents);
                };
                let moveDown = () => {
                    let newComponents = Array(...props.components);
                    let [newItem] = newComponents.splice(index, 1);
                    newComponents.splice(index + 1, 0, newItem);
                    props.updateComponents(newComponents);
                };
                switch (element.elementType) {
                    case 'header':
                        return (<ContentHeatherEditor key={index} data={element} remove={remove} updateItem={updateItem}
                            moveUp={index === 0 ? undefined : moveUp} moveDown={index === props.components.length - 1 ? undefined : moveDown}></ContentHeatherEditor>);
                    case 'text':
                        return (<ContentTextEditor key={index} data={element} remove={remove} updateItem={updateItem}
                            moveUp={index === 0 ? undefined : moveUp} moveDown={index === props.components.length - 1 ? undefined : moveDown}></ContentTextEditor>);
                    case 'image':
                        return (<ContentImageEditor key={index} data={element} remove={remove} updateItem={updateItem}
                            moveUp={index === 0 ? undefined : moveUp} moveDown={index === props.components.length - 1 ? undefined : moveDown}></ContentImageEditor>);
                }
            })}
        </Row>
    </>)
}

function PageSave(props) {
    return (<>
        <Button variant="outline-success" onClick={() => {
            let actualComponents = Array(...props.components).filter((component) => component.elementData !== '');
            let errors = [];
            if (props.title === '')
                errors.push('The article must have a title.');
            let headerComponentsNum = actualComponents.filter((component) => component.elementType === 'header').length;
            if (headerComponentsNum === 0)
                errors.push('The article must have at least an header component.');
            if ((actualComponents.length - headerComponentsNum) === 0)
                errors.push('The article must have at least one among image or text components.');
            if (props.publicationDate && ((props.id && props.publicationDate.isBefore(props.pages.find((pg) => pg.id == props.id).creationDate, 'day'))
                || props.publicationDate.isBefore(dayjs(), 'day')))
                errors.push('The publication date cannot be before its creation');

            if (errors.length === 0)
                if (!props.id)
                    createPage(props.title, props.author.id, props.publicationDate ? props.publicationDate.toISOString() : undefined, actualComponents)
                        .then((response) => {
                            if (response.error)
                                props.setErrors([...errors, response.error]);
                            else {
                                props.navigate(-1);
                                let newPages = Array(...props.pages);
                                newPages.push({
                                    id: response.id, title: props.title, author: props.author,
                                    publicationDate: props.publicationDate ? props.publicationDate : undefined, creationDate: dayjs()
                                });
                                props.setPages(newPages);
                            }
                        });
                else
                    editPage(props.id, props.title, props.author.id, props.publicationDate ? props.publicationDate.toISOString() : undefined, actualComponents)
                        .then((response) => {
                            if (response.error)
                                props.setErrors([...errors, response.error]);
                            else {
                                props.navigate(-1);
                                let newPages = Array(...props.pages);
                                newPages = newPages.map((elem) => {
                                    if (elem.id != props.id)
                                        return elem;
                                    else
                                        return ({
                                            id: elem.id, title: props.title, author: props.author,
                                            publicationDate: props.publicationDate ? props.publicationDate : undefined,
                                            creationDate: elem.creationDate
                                        });
                                });
                                props.setPages(newPages);
                            }
                        });
            else
                props.setErrors(errors);
        }} className="w-100 margin-top-05rem"><i className="bi bi-check2-circle">Save</i></Button>
    </>);
}

function SaveError(props) {
    return (
        <>
            <Collapse in={props.errors.length !== 0}>
                <div className="card bg-danger text-light margin-top-05rem" id="errorContainer">
                    {props.errors.map((err, index) => <p key={index}>{err}</p>)}
                </div>
            </Collapse>
        </>
    );
}

export default PageEditorForm;