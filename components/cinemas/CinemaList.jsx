"use client";

import { useEffect, useMemo, useState } from "react";
import { Home, Search } from "lucide-react";
import CinemaCard from "./CinemaCard";
import { CINEMA_MESSAGES } from "@/helpers/messages/cinema-messages";
import styles from "./cinema-list.module.scss";

const FAVORITE_STORAGE_KEY = "cinetime.favoriteCinemaIds";
const SORT_MODES = {
  NAME: "name",
  NEARBY: "nearby",
  FAVORITES: "favorites",
};

function normalizeText(value) {
  return String(value ?? "").trim().toLocaleLowerCase("tr-TR");
}

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : String(value).split(",");
}

function getCinemaFeatures(cinema) {
  return [
    ...toArray(cinema.specialHall),
    ...toArray(cinema.specialHalls),
    ...toArray(cinema.hallType),
    ...toArray(cinema.hallTypes),
    ...toArray(cinema.features),
  ]
    .map((feature) => String(feature).trim())
    .filter(Boolean);
}

function buildMapHref(cinema) {
  const { name, city, district, address, latitude, longitude } = cinema;
  const query = latitude != null && longitude != null
    ? `${latitude},${longitude}`
    : [name, address, district, city].filter(Boolean).join(" ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function sortByName(first, second) {
  return String(first.name ?? "").localeCompare(String(second.name ?? ""), "tr");
}

export default function CinemaList({ cinemas = [], error }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFeature, setSelectedFeature] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortMode, setSortMode] = useState(SORT_MODES.NAME);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const storedFavorites = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || "[]");
        setFavoriteIds(Array.isArray(storedFavorites) ? storedFavorites.map(String) : []);
      } catch {
        setFavoriteIds([]);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const cityOptions = useMemo(
    () => [...new Set(cinemas.map((cinema) => cinema.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr")),
    [cinemas]
  );

  const featureOptions = useMemo(
    () => [...new Set(cinemas.flatMap(getCinemaFeatures))].sort((a, b) => a.localeCompare(b, "tr")),
    [cinemas]
  );
  const hasFeatureFilter = featureOptions.length > 0;
  const effectiveSelectedFeature = hasFeatureFilter ? selectedFeature : "";

  const filteredCinemas = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm);
    const normalizedFeature = normalizeText(effectiveSelectedFeature);

    const list = cinemas.filter((cinema) => {
      const haystack = normalizeText([cinema.name, cinema.city, cinema.district, cinema.address, cinema.phone].join(" "));
      const featureHaystack = normalizeText([...getCinemaFeatures(cinema), cinema.name, cinema.address].join(" "));
      const matchesCity = !selectedCity || cinema.city === selectedCity;
      const matchesFeature = !effectiveSelectedFeature || featureHaystack.includes(normalizedFeature);
      const matchesSearch = !normalizedSearch || haystack.includes(normalizedSearch);

      return matchesCity && matchesFeature && matchesSearch;
    });

    if (sortMode === SORT_MODES.FAVORITES) {
      return list.filter((cinema) => favoriteIds.includes(String(cinema.id))).sort(sortByName);
    }

    if (sortMode === SORT_MODES.NEARBY) {
      return [...list].sort((first, second) => {
        const firstHasCoordinates = first.latitude != null && first.longitude != null;
        const secondHasCoordinates = second.latitude != null && second.longitude != null;

        if (firstHasCoordinates !== secondHasCoordinates) {
          return Number(secondHasCoordinates) - Number(firstHasCoordinates);
        }

        return sortByName(first, second);
      });
    }

    return [...list].sort(sortByName);
  }, [cinemas, effectiveSelectedFeature, favoriteIds, searchTerm, selectedCity, sortMode]);

  function handleFavoriteToggle(cinemaId) {
    const id = String(cinemaId);
    setFavoriteIds((currentFavorites) => {
      const nextFavorites = currentFavorites.includes(id)
        ? currentFavorites.filter((favoriteId) => favoriteId !== id)
        : [...currentFavorites, id];

      localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(nextFavorites));
      return nextFavorites;
    });
  }

  function handleResetFilters() {
    setSelectedCity("");
    setSelectedFeature("");
    setSearchTerm("");
    setSortMode(SORT_MODES.NAME);
  }

  if (error) {
    return (
      <section className={styles.page}>
        <div className={styles.stateBox} role="alert">
          {error}
        </div>
      </section>
    );
  }

  if (!cinemas.length) {
    return (
      <section className={styles.page}>
        <div className={styles.stateBox}>{CINEMA_MESSAGES.public.emptyList}</div>
      </section>
    );
  }

  return (
    <section className={styles.page} aria-labelledby="cinema-selection-title">
      <div className={styles.breadcrumb}>
        <Home size={22} />
        <span>/</span>
        <strong>Sinema Salonlari</strong>
      </div>

      <div className={styles.selectionHeader}>
        <div>
          <span className="ct-eyebrow">Cinema Selection</span>
          <h2 id="cinema-selection-title">Sinemani sec</h2>
          <p>Once salonu filtrele, sonra detay sayfasinda o sinemanin gosterimdeki filmlerini ve seanslarini incele.</p>
        </div>
        <strong>{filteredCinemas.length} salon</strong>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          <label className={styles.selectWrap}>
            <span>Sehir</span>
            <select value={selectedCity} onChange={(event) => setSelectedCity(event.target.value)}>
              <option value="">Sehir sec</option>
              {cityOptions.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </label>

          {hasFeatureFilter && (
            <label className={styles.selectWrap}>
              <span>Salon tipi</span>
              <select
                value={selectedFeature}
                onChange={(event) => setSelectedFeature(event.target.value)}
              >
                <option value="">Ayricalikli salon sec</option>
                {featureOptions.map((feature) => (
                  <option key={feature} value={feature}>{feature}</option>
                ))}
              </select>
            </label>
          )}

          <label className={styles.searchWrap}>
            <span>Salon ara</span>
            <Search size={22} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Salon ara"
            />
          </label>
        </div>

        <div className={styles.tabGroup} aria-label="Sinema siralama secenekleri">
          <button
            type="button"
            className={sortMode === SORT_MODES.NAME ? styles.activeTab : ""}
            onClick={() => setSortMode(SORT_MODES.NAME)}
          >
            Isme gore sirala
          </button>
          <button
            type="button"
            className={sortMode === SORT_MODES.NEARBY ? styles.activeTab : ""}
            onClick={() => setSortMode(SORT_MODES.NEARBY)}
          >
            Yakinimdakiler
          </button>
          <button
            type="button"
            className={sortMode === SORT_MODES.FAVORITES ? styles.activeTab : ""}
            onClick={() => setSortMode(SORT_MODES.FAVORITES)}
          >
            Favoriler
          </button>
        </div>
      </div>

      {!filteredCinemas.length ? (
        <div className={styles.stateBox}>
          <strong>Bu filtreye uygun sinema bulunamadi.</strong>
          <button type="button" onClick={handleResetFilters}>Filtreleri temizle</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredCinemas.map((cinema) => (
            <CinemaCard
              key={cinema.id}
              cinema={cinema}
              isFavorite={favoriteIds.includes(String(cinema.id))}
              mapHref={buildMapHref(cinema)}
              onToggleFavorite={handleFavoriteToggle}
            />
          ))}
        </div>
      )}
    </section>
  );
}