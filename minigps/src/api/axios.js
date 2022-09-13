import axios from "axios";

export default axios.create({
    baseURL: 'http://159.65.134.221:8082/',
    headers: {
        'content-type': 'application/json',
    }
});