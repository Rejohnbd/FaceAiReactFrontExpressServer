import axios from "axios";

const instance = axios.create({
  // baseURL: "http://localhost:5000",
  baseURL: "https://realailab.com",
  // withCredentials: false,
  // headers: {
  //   "Access-Control-Allow-Methods": "*",
  // },
});

export default instance;
