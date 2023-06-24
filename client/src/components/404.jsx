import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function NotFoundPage(props) {
    const navigate = useNavigate();
    return (
        <>
            <div className="card">
                <h1>Error 404</h1>
                <Button onClick={() => navigate('/')}>Go back Home</Button>
            </div>
    </>
    );
}

export default NotFoundPage;
