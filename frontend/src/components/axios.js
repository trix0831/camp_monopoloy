import _axios from "axios";

const instance = _axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "https://sunbank-v1-1054651216998.asia-east1.run.app/api",
  timeout: 2000,
});

export default instance;
