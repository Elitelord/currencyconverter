'use client'
import { useState, useEffect } from "react"; // 1. Import useEffect
import styles from "./page.module.css";
import CurrencyAPI from '@everapi/currencyapi-js';

// Define an interface for the API response for type safety
interface CurrencyApiResponse {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currencyCode: string]: {
      code: string;
      value: number;
    };
  };
}

export default function Home() {
  // Initialize state with null and provide the correct type
  const [info, setInfo] = useState<CurrencyApiResponse | null>(null);

  // 2. Wrap your API call in a useEffect hook
  useEffect(() => {
    // Make sure your .env variable is correctly exposed to the client
    const client = new CurrencyAPI(process.env.NEXT_PUBLIC_API_KEY);

    client.latest({
        base_currency: 'USD',
        currencies: 'EUR'
    }).then((response: CurrencyApiResponse) => {
        // Set the entire response object to state
        console.log("API Response: ", response);
        setInfo(response);
    });
  }, []); // 3. An empty dependency array runs this effect only ONCE

  return (
    <main className={styles.main}>
      {/* 4. Safely access the data after it has loaded */}
      {info?.data?.EUR? (
        <p>
          The latest exchange rate for EUR is: {info.data.EUR.value}
        </p>
      ) : (
        <p>Loading currency data...</p>
      )}
    </main>
  );
}