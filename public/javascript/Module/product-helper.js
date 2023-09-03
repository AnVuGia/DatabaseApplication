import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/product`;
import { getSessionCookie, parseJSONCookie } from './cookieUtils';
const user_credential_raw = getSessionCookie();
const user_credential = parseJSONCookie(user_credential_raw);
const product = {
  async getProducts() {
    const response = await axios.post(`${API_URL}/findAll`, {
      user_credential: user_credential,
    });
    return response.data;
  },
  async createProduct(product) {
    const response = await axios.post(`${API_URL}/create`, {
      user_credential: user_credential,
      query: product,
    });
    return response.data;
  },
};
export default product;
