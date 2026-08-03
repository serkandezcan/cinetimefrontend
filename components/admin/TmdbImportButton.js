"use client";

import { useState } from "react";

export default function TmdbImportButton() {
    const [isImporting, setIsImporting] = useState(false);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleImport() {
        setIsImporting(true);
        setResult(null);
        setErrorMessage("");

        try {
            const res = await fetch("/api/admin/import-tmdb", { method: "POST" });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Ice aktarma basarisiz.");
            }

            setResult(data);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsImporting(false);
        }
    }

    return (
        <div>
            <button
                type="button"
                className="ct-button ct-button-primary"
                onClick={handleImport}
                disabled={isImporting}
            >
                {isImporting ? "Ice aktariliyor..." : "TMDB'den Ice Aktar"}
            </button>

            {errorMessage && <p role="alert">{errorMessage}</p>}

            {result && (
                <div>
                    <p>{result.created.length} film eklendi.</p>
                    {result.failed.length > 0 && (
                        <details>
                            <summary>{result.failed.length} film eklenemedi</summary>
                            <ul>
                                {result.failed.map((failedMovie) => (
                                    <li key={failedMovie.title}>
                                        {failedMovie.title}: {failedMovie.reason}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    )}
                </div>
            )}
        </div>
    );
}