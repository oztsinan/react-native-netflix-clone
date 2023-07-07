type ConfigTypes = {
  TMBDBaseUrl: string;
  TMBDImageServicesBaseUrl: string;
  TMDBApiKey: string;
};

const CONFIG: ConfigTypes = {
  TMBDBaseUrl: "https://api.themoviedb.org/3",
  TMBDImageServicesBaseUrl: "https://image.tmdb.org/t/p/original/",
  TMDBApiKey: "{apiKey}",
};

export default CONFIG;
