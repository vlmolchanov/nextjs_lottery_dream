import Head from "next/head";
import Image from "next/image";
import Header from "../components/header";
import Lottery from "../components/lottery";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Lottery Dream" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Lottery />
    </div>
  );
}
