import { useState } from "react";
import { Form, Button, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./../style/loginForm.css"

function LoginForm(props) {
    const [email, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    return (
        <>
            <Row className="justify-content-center align-items-center">
                <div className="card bg-light" id="loginForm" onSubmit={(event) => {
                    event.preventDefault();
                    console.log("Sending login request");
                    fetch('http://localhost:4452/api/session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ username: email, password: password }),
                    }).then((response) => response.json()).then((json) => {
                        props.updateUser(json);
                        console.log(json);
                        navigate('/');
                    });
                }}>
                    <Form>
                        <Form.Control type='email' placeholder="email" value={email} onChange={(x) => setMail(x.target.value)} required />
                        <Form.Control type="password" placeholder="password" value={password} onChange={(x) => setPassword(x.target.value)} required />
                        <div className="d-grid">
                            <Button variant="outline-success" type="submit" size="lg">Log In</Button>
                        </div>
                    </Form>
                </div>
            </Row>
        </>
    );
}

export default LoginForm;