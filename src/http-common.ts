import axios from "axios";

export default axios.create({
    baseURL: "http://0.0.0.0:8656/api/counting/v1",
    headers: {
        "Content-type": "application/json"
    }
});
