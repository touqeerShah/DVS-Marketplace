import axios from "axios";
var tokenCountId = "6310919b5682966da6544ca3"; // it is default id where we keep our token id count
var response = {};
import { BACKEND_ENDPOINT } from "./../config"; // it will help as to load all the environment variable

/**
 * This is user to get call on Backend server
 * @param {*} api
 * @param {*} params
 * @returns
 */
async function get(api, params) {
  try {
    const { data } = await axios.get(`${BACKEND_ENDPOINT}${api}`, {
      params: params,
    });
    // setNfts(data);
    // console.log("datadatadatadata", api, data);
    return { data: data, status: data.status };


  } catch (err) {
    console.log(err);
    response.status = 400;
    response.data = {};
    response.message = err;

    return response;
  }
}
/**
 * This will help as to make all type of put call on backend
 * @param {*} api
 * @param {*} params
 * @returns
 */
async function put(api, params) {
  try {
    const { data } = await axios.put(`${BACKEND_ENDPOINT}${api}`, {
      _id: tokenCountId,
    });
    // setNfts(data);

    return data;
  } catch (err) {
    console.log(err);
    response.status = 400;
    response.data = {};
    response.message = err;

    return response;
  }
}

/**
 * This will help as to do all post call on backend
 * @param {*} api
 * @param {*} args
 * @returns
 */
async function post(api, args) {
  try {
    const { data } = await axios.post(`${BACKEND_ENDPOINT}${api}`, args);
    return data;
  } catch (err) {
    console.log(err);
    response.status = 400;
    response.data = {};
    response.message = err;

    return response;
  }
}

module.exports = {
  get,
  put,
  post,
};
