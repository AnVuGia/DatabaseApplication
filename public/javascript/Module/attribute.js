import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/attribute`;

const attribute = {
  async find(id) {
    const response = await axios.get(`${API_URL}/find/${id}`);
    return response.data;
  }
};

export default attribute;