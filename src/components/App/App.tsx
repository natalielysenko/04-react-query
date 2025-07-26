import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies } from "../../services/movieService.ts";
import type { MovieResponse } from "../../services/movieService.ts";
import { useState, useEffect } from "react";
import type { Movie } from "../../types/movie.ts"
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";



import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";


export default function App() {

const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [topic, setTopic] = useState("");

  const { data, isLoading, isError, isSuccess } = useQuery <MovieResponse, Error>({
    queryKey: ["movies", topic, currentPage],
    queryFn: () => fetchMovies(topic, currentPage),
    enabled: topic !== "",
    placeholderData: keepPreviousData,
    
  });

  useEffect(() => {
    if (data && data.results.length === 0 && isSuccess) {
      toast.error("No movies found for your request.");
    }
    if (isError) {
      toast.error("An error occurred while fetching movies.");
    }
  }, [data, isSuccess, isError]);

  const totalPages = data?.total_pages ?? 0;

  const handleSearch = async (query: string) => {
    setTopic(query);
    setCurrentPage(1);
  };
    
    
    
    const handleSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

    
    return (
        <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && data.results.length > 0 && (
        <MovieGrid onSelect={handleSelect} movies={data.results} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleClose} />
      )}
    </div>
)
}