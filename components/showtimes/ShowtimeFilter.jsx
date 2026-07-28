export default function ShowtimeFilter({ filters, movies = [], cinemas = [], onChange, onSubmit, onReset }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChange({ ...filters, [name]: value });
  }

  return (
    <form onSubmit={onSubmit} className="cinetime-panel" noValidate>
      <div className="ct-form-grid">
        <label className="ct-field">
          Tarih
          <input type="date" name="date" value={filters.date} onChange={handleChange} />
        </label>

        <label className="ct-field">
          Film
          <select name="movieId" value={filters.movieId} onChange={handleChange}>
            <option value="">Tum filmler</option>
            {movies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </label>

        <label className="ct-field">
          Sinema
          <select name="cinemaId" value={filters.cinemaId} onChange={handleChange}>
            <option value="">Tum sinemalar</option>
            {cinemas.map((cinema) => (
              <option key={cinema.id} value={cinema.id}>
                {cinema.name} {cinema.city ? `- ${cinema.city}` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="ct-form-actions">
        <button type="submit" className="ct-button ct-button-primary">
          Seanslari filtrele
        </button>
        <button type="button" className="ct-button ct-button-ghost" onClick={onReset}>
          Temizle
        </button>
      </div>
    </form>
  );
}
