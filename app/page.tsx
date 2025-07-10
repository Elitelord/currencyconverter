'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Dashboard from "./Dashboard";
import { useState } from "react";
import CurrencyAPI from '@everapi/currencyapi-js';
export default function Home() {
  // const data = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_4LVjUfRQv74JmUVqmoP2QZ8P7aAqurvHQAMC3QdW&currencies=EUR%2CUSD%2CCAD',{ cache: 'force-cache' }).then((res) =>
  //   res.json()
  // )
  const client = new CurrencyAPI(process.env.api_key)
  const [info,setInfo]=useState("");
client.latest({
    base_currency: 'USD',
    currencies: 'EUR'
}).then((response: string) => {
    console.log(response)
    setInfo(response);
});
  return (
    <main className={styles.main}>
      <p>{info[1]}</p>
      
    </main>
  );
}
