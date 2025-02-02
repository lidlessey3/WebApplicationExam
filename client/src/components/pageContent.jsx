import { Button, Form } from 'react-bootstrap';
import thinker from './../assets/thinker.jpg';
import disk from './../assets/disk.jpg';
import colosseum from './../assets/colosseum.jpg';
import parthenon from './../assets/Parthenon.jpg';

const images = [thinker, disk, colosseum, parthenon];

function ContentHeather(props) {
    return (<div className='w-100 d-flex justify-content-start'>
        <h3>{props.data.elementData}</h3>
    </div>);
}

function ContentHeatherEditor(props) {
    return (
        <>
            <div className='contentEditor card'>
                <div className='d-flex justify-content-start align-items-center'>
                    <Button variant='outline-danger' onClick={(event) => props.remove()} className='margin-right-02rem'><i className='bi bi-x-lg'></i></Button>
                    {props.moveUp ? <Button variant='outline-info' onClick={(event) => props.moveUp()} className='margin-right-02rem'>
                        <i className='bi bi-arrow-up'></i>
                    </Button>
                        : <></>}
                    {props.moveDown ? <Button variant='outline-info' onClick={(event) => props.moveDown()} className='margin-right-02rem'>
                        <i className='bi bi-arrow-down'></i>
                    </Button>: <></>}
                    <h4>Header</h4>
                </div>
                <Form className='margin-top-05rem' onSubmit={(event) => event.preventDefault()}>
                    <Form.Control type='text' value={props.data.elementData} onChange={(event) => {
                        let newElement = {};
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
    return (<div className='w-100 d-flex justify-content-start'>
        <p>{props.data.elementData}</p>
    </div>);
}

function ContentTextEditor(props) {
    return (
        <>
            <div className='contentEditor card'>
                <div className='d-flex justify-content-start align-items-center'>
                    <Button variant='outline-danger' onClick={(event) => props.remove()} className='margin-right-02rem'><i className='bi bi-x-lg'></i></Button>
                    {props.moveUp ? <Button variant='outline-info' onClick={(event) => props.moveUp()} className='margin-right-02rem'>
                        <i className='bi bi-arrow-up'></i>
                    </Button>
                        : <></>}
                    {props.moveDown ? <Button variant='outline-info' onClick={(event) => props.moveDown()} className='margin-right-02rem'>
                        <i className='bi bi-arrow-down'></i>
                    </Button>: <></>}
                    <h4>Text</h4>
                </div>
                <textarea value={props.data.elementData} onChange={(event) => {
                    let newElement = {};
                    newElement.elementType = props.data.elementType;
                    newElement.elementData = event.target.value;
                    props.updateItem(newElement);
                }} className='margin-top-05rem bg-light text-dark'></textarea>
            </div>
        </>
    );
}

function ContentImage(props) {
    return (<div className='w-100'>
        <img src={images[props.data.elementData]} className='content-image'></img>
    </div>);
}

function ContentImageEditor(props) {
    return (
        <>
            <div className='contentEditor card'>
                <div className='d-flex justify-content-start align-items-center'>
                    <Button variant='outline-danger' onClick={(event) => props.remove()} className='margin-right-02rem'><i className='bi bi-x-lg'></i></Button>
                    {props.moveUp ? <Button variant='outline-info' onClick={(event) => props.moveUp()} className='margin-right-02rem'>
                        <i className='bi bi-arrow-up'></i>
                    </Button>
                        : <></>}
                    {props.moveDown ? <Button variant='outline-info' onClick={(event) => props.moveDown()} className='margin-right-02rem'>
                        <i className='bi bi-arrow-down'></i>
                    </Button>: <></>}
                    <h4>Image</h4>
                </div>
                <img src={images[props.data.elementData]} className='content-image margin-top-05rem'></img>
                <Form className='margin-top-05rem' onSubmit={(event) => event.preventDefault()}>
                    <Form.Select value={props.data.elementData} onChange={(event) => {
                        let newElement = {};
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

export { ContentTextEditor, ContentImageEditor, ContentHeatherEditor, ContentHeather, ContentText, ContentImage };

