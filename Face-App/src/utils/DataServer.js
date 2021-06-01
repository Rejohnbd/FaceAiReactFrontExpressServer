import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:2800",
});

export default instance;
