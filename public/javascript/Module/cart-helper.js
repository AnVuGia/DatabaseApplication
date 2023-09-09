import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/customer`;

const cartHelper = {
  async getCartProducts(customer_id) {
    const response = await axios.post(`${API_URL}/get-products`, {
      customer_id: customer_id,
    });
    return response.data;
  },
  async addToCart(cart) {
    const response = await axios.post(`${API_URL}/add-product`, {
      customer_id: cart.customer_id,
      product_id: cart.product_id,
      quantity: cart.quantity,
    });
    return response.data;
  },
};

export default cartHelper;
