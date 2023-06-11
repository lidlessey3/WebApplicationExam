import { useEffect, useState } from "react";

function PageList(props) {
    const [pages, updatePages] = useState([]);

    useEffect(() => {
        fetch('http://localhost:4452/api/pages')
    }, [props.user])
}

export default PageList;