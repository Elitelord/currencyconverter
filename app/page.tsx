import Image from "next/image";
import styles from "./page.module.css";
import Dashboard from "./Dashboard";

export default async function Home() {
  const data = await fetch('https://api.currencyapi.com/v3/latest?apikey=cur_live_4LVjUfRQv74JmUVqmoP2QZ8P7aAqurvHQAMC3QdW&currencies=EUR%2CUSD%2CCAD',{ cache: 'force-cache' }).then((res) =>
    res.json()
  )
  
  return (
    <main className={styles.main}>
      <p>{data[0]}</p>
      
    </main>
  );
}
