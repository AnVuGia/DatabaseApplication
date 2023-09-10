import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/productWarehouse`;

const product = {
  async findAll(body) {
    const response = await axios.post(`${API_URL}/findAll`, {
        query : body
    });
    return response.data;
  },
  async moveProduct(body) {
    const response = await axios.post(`${API_URL}/moveProduct`, {
        query : body
    });
    return response;
  }
};
export default product;
