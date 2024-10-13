import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [genreFilter, setGenreFilter] = useState("all");
  const genres = ["Alle", "Action", "Krimi", "Drama", "Superheld", "Western"];
  // Filme beim ersten Laden der Komponente abrufen
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          "https://2zc6fti416.execute-api.eu-central-1.amazonaws.com/prod/movies/"
        );
        if (!response.ok) {
          console.error("Fehler beim Abrufen der Filme");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Fehler beim Abrufen der Filmdaten:", error);
      } finally {
        setIsLoadingMovies(false);
      }
    }

    loadData();
  }, []);

  // Funktion, um die Details eines Films abzurufen
  async function fetchMovieDetails(movieId) {
    try {
      setIsLoadingDetails(true);
      const response = await fetch(
        `https://2zc6fti416.execute-api.eu-central-1.amazonaws.com/prod/movies/${movieId}`
      );
      if (!response.ok) {
        console.error("Fehler beim Abrufen der Filmdetails");
      }
      const data = await response.json();
      setSelectedMovie(data);

      // Schauspieler abrufen
      fetchActorDetails(movieId);
    } catch (error) {
      console.error("Fehler beim Abrufen der Filmdetails:", error);
    } finally {
      setIsLoadingDetails(false);
    }
  }

  // Funktion, um die Schauspieler eines Films abzurufen
  async function fetchActorDetails(movieId) {
    try {
      const response = await fetch(
        `https://2zc6fti416.execute-api.eu-central-1.amazonaws.com/prod/movies/actors/${movieId}`
      );
      if (!response.ok) {
        console.error("Fehler beim Abrufen der Schauspielerdaten");
        console.error("Response status", response.status);
      }
      const data = await response.json();
      setActors(data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Schauspielerdaten:", error);
    }
  }

  // Gefilterte Filme basierend auf dem Genre-Filter
  function filteredMovies() {
    if (genreFilter === "all") {
      return movies; // Wenn der Filter "all" ist, gebe alle Filme zurück.
    } else {
      return movies.filter(
        (movie) => movie.genre.toLowerCase() === genreFilter.toLowerCase()
      );
    }
  }

  return (
    <div className="App">
      <h1>Movie List</h1>

      {/* Genre-Filter-Buttons */}
      <div className="genre-filter">
        {genres.map((item, index) => (
          <button key={index} onClick={() => setGenreFilter(item)}>
            {console.log("item", item)}
            {item}
          </button>
        ))}
      </div>

      {/* Filme anzeigen */}
      {isLoadingMovies ? (
        <p>Lädt Filme...</p>
      ) : (
        <ul>
          {filteredMovies().map((movie) => (
            <li key={movie.id}>
              {" "}
              {movie.title}
              <a href="#" onClick={() => fetchMovieDetails(movie.id)}>
                More details
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Details des ausgewählten Films anzeigen */}
      {isLoadingDetails ? (
        <p>Lädt Filmdetails...</p>
      ) : (
        selectedMovie && (
          <div className="movie-details">
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.tagline}</p>
            <p>Genre: {selectedMovie.genre}</p>

            <h3>Schauspieler:</h3>
            <ul>
              {actors.length > 0 ? (
                actors.map((actor) => <li key={actor.id}>{actor.name}</li>)
              ) : (
                <p>Keine Schauspieler verfügbar.</p>
              )}
            </ul>
          </div>
        )
      )}
    </div>
  );
}

export default App;
