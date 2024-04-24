import React, { useState, useEffect, useCallback, useMemo } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [retryIntervalId, setRetryIntervalId] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://swapi.dev/api/films/");
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }
      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
        return {
          id: movieData.episode_id,
          title: movieData.title,
          openingText: movieData.opening_crawl,
          releaseDate: movieData.release_date,
        };
      });
      setMovies(transformedMovies);
      setRetryCount(0);
    } catch (error) {
      setError(error.message);
      setRetryCount((prevRetryCount) => prevRetryCount + 1);
    }
    setIsLoading(false);
  }, []);

  const cancelRetryHandler = useCallback(() => {
    clearInterval(retryIntervalId);
    setRetryCount(0);
  }, [retryIntervalId]);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  useEffect(() => {
    if (retryCount > 0) {
      setRetryIntervalId(
        setInterval(() => {
          fetchMoviesHandler();
        }, 5000)
      );
    }
    return () => {
      clearInterval(retryIntervalId);
    };
  }, [retryCount, fetchMoviesHandler]);
  const content = useMemo(() => {
    if (movies.length > 0) {
      return <MoviesList movies={movies} />;
    } else if (error) {
      return (
        <React.Fragment>
          <p>{error}</p>
          <button onClick={fetchMoviesHandler}>Retry</button>
          <button onClick={cancelRetryHandler}>Cancel</button>
        </React.Fragment>
      );
    } else if (isLoading) {
      return <p>Loading...</p>;
    } else {
      return <p>Found no movies.</p>;
    }
  }, [movies, error, isLoading, fetchMoviesHandler, cancelRetryHandler]);
  return (
    <React.Fragment>
      <section>{content}</section>
    </React.Fragment>
  );
}
export default App;