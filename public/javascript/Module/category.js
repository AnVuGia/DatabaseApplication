import axios from 'https://cdn.jsdelivr.net/npm/axios@1.5.0/+esm';
const port = 3000;
const API_URL = `http://localhost:${port}`;
const category = {
    async search(query) {
        console.log(query);
        const response = await axios.post(`${API_URL}/category/search`, query);
        return response;
    },
    async findAll(user_credential, query) {
    const response = await axios.post(`${API_URL}/warehouse/findAll`, {
        user_credential: user_credential,
        query: query
    });
    return response;
    },
    async update(user_credential, query) {
    const response = await axios.post(`${API_URL}/warehouse/update`, {
        user_credential: user_credential,
        query: query
    });
    return response;
    },
    async delete(category) {
        const response = await axios.post(`${API_URL}/category/delete`, category); 
        return response;
    },
    
};
export default category;
