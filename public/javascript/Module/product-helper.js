import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/product`;
import { getSessionCookie, parseJSONCookie } from './cookieUtils.js';

const product = {
  async getProducts() {
    const sessionData = getSessionCookie();
    if (!sessionData) {
      console.log('No session data found.');
      return;
    }
    const session = await parseJSONCookie(sessionData);
    console.log(session);

    const response = await axios.post(`${API_URL}/findAll`, {
      user_credential: {
        username: session.username,
        password: session.password,
      },
    });
    console.log(response.data);
    return response.data;
  },
  async createProduct(product) {
    const sessionData = getSessionCookie();
    if (!sessionData) {
      console.log('No session data found.');
      return;
    }
    const session = await parseJSONCookie(sessionData);
    console.log(session);
    const user_credential = {
      username: session.username,
      password: session.password,
    };
    console.log(product);
    const response = await axios.post(`${API_URL}/create`, {
      user_credential: user_credential,
      query: product,
    });
    return response.data;
  },
};

export default product;
