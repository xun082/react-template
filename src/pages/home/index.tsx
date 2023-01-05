import React from "react";
import { Link } from "react-router-dom";

import styles from "./style.module.scss";

const Home: React.FC = () => {
  const handle = async () => {
    const result = await Promise.reject("error");
    console.log(result);
  };

  return (
    <div className={styles.root}>
      <h1 onClick={handle}>Home</h1>
      <Link to={"/title"}>go</Link>
    </div>
  );
};

export default Home;
