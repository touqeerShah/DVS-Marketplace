import axios from "axios";
import { Response } from "../class/backendRequest"
import { BACKEND_ENDPOINT } from "../lib/config"; // it will help as to load all the environment variable

/**
 * This is user to get call on Backend server
 * @param {*} api
 * @param {*} params
 * @returns
 */
export async function get(api: string, params: any) {
  var response: Partial<Response> = {};

  try {
    const { data } = await axios.get(`${BACKEND_ENDPOINT}${api}`, {
      params: params,
    });
    // setNfts(data);
    // console.log("datadatadatadata", api, data);
    return data as Response;


  } catch (err: any) {
    console.log(err);
    response.status = 400;
    response.data = {};
    response.message = err.toString();

    return response;
  }
}

/**
 * This will help as to do all post call on backend
 * @param {*} api
 * @param {*} args
 * @returns
 */
export async function post(api: string, args: any, header?: any) {
  var response: Partial<Response> = {};

  try {
    const { data } = await axios.post(`${BACKEND_ENDPOINT}${api}`, args, header);
    return data as Response;
  } catch (err: any) {
    console.log(err);
    response.status = 400;
    response.data = {};
    response.message = err.toString();

    return response;
  }
}


