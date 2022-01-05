import http from "./httpService";
import url from "../config";

const getByLocation = (id) => {
  return http.get(`${url}/api/location/${id}`);
};

const searchLocation = (query) => {
  return http.get(`${url}/api/location/search/?query=${query}`);
};

const imgUrl = (imgName) => {
  return `https://www.metaweather.com/static/img/weather/${imgName}.svg`;
};

const weatherApi = {
  getByLocation,
  searchLocation,
  imgUrl,
};

export default weatherApi;
