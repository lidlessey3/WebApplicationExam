import { useEffect, useState } from "react";
import { Row, Col, Form } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import './../style/pageEditorForm.css'



function PageEditorForm(props) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(props.user);
    const [components, setComponents] = useState([]);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        console.log(props.user);
        if (props.user === undefined)
            navigate('/');
        else if (props.user.admin !== 1)
            return;
        else
            fetch("http://localhost:4452/api/users/list", { credentials: "include" }).then((response) => response.json()).then((response) => {
                console.log('list of users');
                console.log(response);
                setUsers(response);
            });
    }, [props.user])

    return (
        <>
            <Row className="vh-100 underNav" id="newPageForm">
                <Col md='auto'>
                    <i className="bi bi-arrow-left-circle" id="backArrow" onClick={() => {
                        navigate(-1);
                    }}></i>
                </Col>
                {props.user ? <DragDropContext>
                    <Col md={9} id="EditContent">
                        <Row>
                            <div className="w-100 bg-light">
                                <Form>
                                    Title:<Form.Control type="text" required placeholder="Lorem Ipsum" value={title} onChange={(event) => setTitle(event.target.value)}></Form.Control><br />
                                    Author: {props.user.admin === 1 ? <Form.Select value={author} onChange={(event) => setAuthor(event.target.value)}>
                                        {users.map((user) => <option key={user.id} value={user}>{user.name}</option>)}
                                    </Form.Select> : props.user.name}
                                </Form>
                            </div>
                        </Row>
                    </Col>
                </DragDropContext> : <></>}
            </Row>
        </>
    );
}

export default PageEditorForm;