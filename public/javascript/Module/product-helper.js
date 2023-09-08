import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/product`;

const product = {
  async getProducts() {
    const response = await axios.post(`${API_URL}/findAll`, {});
    return response.data;
  },
  async getProductBySeller(id) {
    const response = await axios.post(`${API_URL}/find/${id}`, {});
    return response.data;
  },
  async createProduct(product) {
    const response = await axios.post(`${API_URL}/create`, {
      query: product,
    });
    return response.data;
  },
  async updateProduct(product) {
    const response = await axios.post(
      `${API_URL}/update/${product.product_id}`,
      {
        query: product,
      }
    );
    return response.data;
  },
  async deleteProduct(product) {
    const response = await axios.post(
      `${API_URL}/delete/${product.product_id}`,
      {
        query: product,
      }
    );
    return response.data;
  },
};

export default product;
