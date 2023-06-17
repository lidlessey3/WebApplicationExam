import { Button, Form } from 'react-bootstrap';
import thinker from './../assets/thinker.jpg';
import disk from './../assets/disk.jpg';
import colosseum from './../assets/colosseum.jpg';
import parthenon from './../assets/Parthenon.jpg';

const images = [thinker, disk, colosseum, parthenon];

function ContentHeather(props) {

}

function ContentHeatherEditor(props) {
    return (
        <>
            <div className='contentEditor'>
                <Button variant='danger-outline' onClick={(event)=>props.remove()}><i className='bi bi-x-lg'></i></Button>
                <Form>
                    <Form.Control type='text' value={props.data.elementData} onChange={(event) => {
                        let newElement;
                        newElement.elementType = props.data.elementType;
                        newElement.elementData = event.target.value;
                        props.updateItem(newElement);
                    }}></Form.Control>
                </Form>
            </div>
        </>
    );
}

function ContentText(props) {

}

function ContentTextEditor(props) {
    return (
        <>
            <div className='contentEditor'>
                <Button variant='danger-outline' onClick={(event)=>props.remove()}><i className='bi bi-x-lg'></i></Button>
                    <textarea value={props.data.elementData} onChange={(event) => {
                        let newElement;
                        newElement.elementType = props.data.elementType;
                        newElement.elementData = event.target.value;
                        props.updateItem(newElement);
                    }}></textarea>
            </div>
        </>
    );
}

function ContentImage(props) {
    
}

function ContentImageEditor(props) {
    return (
        <>
            <div className='contentEditor'>
                <Button variant='danger-outline' onClick={(event) => props.remove()}><i className='bi bi-x-lg'></i></Button>
                <img src={images[props.data.elementData]}></img>
                <Form>
                    <Form.Select value={props.data.elementData} onChange={(event) => {
                        let newElement;
                        newElement.elementType = props.data.elementType;
                        newElement.elementData = event.target.value;
                        props.updateItem(newElement);
                    }}>
                        <option value={0}>thinker</option>
                        <option value={1}>disk</option>
                        <option value={2}>colosseum</option>
                        <option value={3}>parthenon</option>
                    </Form.Select>
                </Form>
            </div>
        </>
    );
}

export { ContentTextEditor, ContentImageEditor, ContentHeatherEditor };

