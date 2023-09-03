import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}`;
const auth = {
  async login(username, password) {
    const user_credential = {
      username: 'lazada_auth',
      password: 'password',
    };
    const info = {
      username: username,
      password: password,
    };
    const response = await axios.post(`${API_URL}/login`, {
      user_credential: user_credential,
      info: info,
    });
    return response.data;
  },
  async register(username, password, name, address) {
    const user_credential = {
      username: 'lazada_guest',
      password: 'password',
    };
    const role = 'customer';
    const info = {
      username: username,
      password: password,
      name: name,
      address: address,
    };
    const response = await axios.post(`${API_URL}/signup`, {
      user_credential: user_credential,
      role: role,
      info: info,
    });
    return response.data;
  },
};
export default auth;
