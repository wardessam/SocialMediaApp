import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://api.noroff.dev/api/v1/social/",
});