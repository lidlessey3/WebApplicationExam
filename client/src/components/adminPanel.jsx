import { useState } from "react";
import { Row, Collapse, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { setWebsiteName } from "../utils/API";

function AdminPanel(props) {
    const [siteName, setSiteName] = useState(props.websiteName);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    return (
        <>
            <Row className="w-100 justify-content-center align-items-center">
                <div className="card bg-light" id="loginForm" onSubmit={(event) => {
                    event.preventDefault();
                    setWebsiteName(siteName).then((json) => {
                        if (json.error === undefined) {
                            props.setWebsiteName(siteName);
                            console.log(json);
                            navigate('/');
                        }
                        else {
                            setError(json.error);
                        }
                    });
                }}>
                    <Collapse in={error !== ''}>
                        <div className="card bg-danger text-light">{error}</div>
                    </Collapse>
                    <p>
                        Setting website name:
                    </p>
                    <Form>
                        <Form.Control type="text" value={siteName} onChange={(x) => setSiteName(x.target.value)} required />
                        <div className="d-grid">
                            <Button variant="outline-success" type="submit" size="lg">Save</Button>
                        </div>
                    </Form>
                </div>
            </Row>
        </>
    );
}

export default AdminPanel;