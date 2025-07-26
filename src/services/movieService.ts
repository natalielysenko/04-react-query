import axios from "axios";
import type { Movie } from "../types/movie.ts";

const BASE_URL = "https://api.themoviedb.org/3/search/movie";
const myKey = import.meta.env.VITE_TMDB_TOKEN;

export interface MovieResponse {
  results: Movie[];
  total_pages: number;
  total_results: number;

}

export const fetchMovies = async (query: string, page: number): Promise<MovieResponse> => {
  const response = await axios.get<MovieResponse>(BASE_URL, {
    params: {
      query,
     page,
    },
    headers: {
      Authorization: `Bearer ${myKey}`,
    },
  });
  return response.data;
};