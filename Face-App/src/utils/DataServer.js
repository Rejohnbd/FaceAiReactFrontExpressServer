import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:2800",
  baseURL: "https://118.67.215.228:2800",
});

export default instance;
