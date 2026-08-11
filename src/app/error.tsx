"use client";

import { useEffect } from "react";
import ApiErrorState from "@/components/ApiErrorState";
import styles from "./error.module.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

/**
 * Catches unexpected render/runtime errors in this segment.
 * Distinct from ApiErrorState used for handled TMDB failures inside page try/catch.
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.page}>
      <ApiErrorState
        title="Something went wrong"
        message={
          error.message ||
          "An unexpected error occurred while rendering this page."
        }
      />
      <button type="button" className={styles.retry} onClick={reset}>
        Try again
      </button>
    </div>
  );
}
