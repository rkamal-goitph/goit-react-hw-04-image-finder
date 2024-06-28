import axios from 'axios';

export const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "42872670-b141582d5b3cf608eefd20d22";

export const getAPI = async (query, page) => {
    const url = `${BASE_URL}?q=${query}&page=${page}&key=${API_KEY}&
    image_tupe=photo&orientation+horizontal&per_page=12`;

    const response = await axios.get(url);

    return response.data;
}