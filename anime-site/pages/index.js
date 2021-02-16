import Head from "next/head";
import styles from "../styles/Home.module.css";
import { gql, useQuery } from "@apollo/client";
import Nav from "@/components/Nav";

export const ALL_ANIME_QUERY = gql`
  query {
    getAnimes {
      animes {
        title
        description
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(ALL_ANIME_QUERY);
  return (
    <>
      <Nav />
    </>
  );
}
