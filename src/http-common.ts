import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8656/api/counting/v1",
    // process.env.REACT_APP_API_URL,
    headers: {
        "Content-type": "application/json"
    }
});
