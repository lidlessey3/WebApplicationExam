import { useState } from "react";
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { DragDropContext } from 'react-beautiful-dnd';
import './../style/pageEditorForm.css'



function PageEditorForm(props) {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState(props.user);
    const [components, setComponents] = useState([]);
    const navigate = useNavigate();

    return (
        <>
            <Row className="vh-100 underNav" id="newPageForm">
                <Col md='auto'>
                    <i className="bi bi-arrow-left-circle" id="backArrow" onClick={() => {
                        navigate(-1);
                    }}></i>
                </Col>
                <DragDropContext>
                    <Col md={9} id="EditContent">

                    </Col>
                </DragDropContext>
            </Row>
        </>
    );
}

export default PageEditorForm;