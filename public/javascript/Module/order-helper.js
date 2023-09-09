import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}/customer`;

const orderHelper = {
    async addOrder(order) {
        const response = await axios.post(`${API_URL}/addOrder`, order);
        return response;
    },
    async getOrdersByCustomerId(customer_id) {
        const response = await axios.post(`${API_URL}/getOrdersByCustomerId`, customer_id);
        return response;
    },
};
export default orderHelper;