import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8656/api/counting/v1",
    headers: {
        "Content-type": "application/json"
    }
});
