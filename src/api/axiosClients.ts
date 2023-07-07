import axios from "axios";
import CONFIG from "../config/tmbd";

const tmdbClient = axios.create({
  baseURL: CONFIG.TMBDBaseUrl,
  params: {
    api_key: CONFIG.TMDBApiKey,
    language: "tr",
  },
});

export { tmdbClient };
