import React from "react";
import { Link } from "react-router-dom";

import styles from "./style.module.scss";

const Home: React.FC = () => {
  return (
    <div className={styles.root}>
      <h1>Home</h1>
      <Link to={"/title"}>go</Link>
    </div>
  );
};

export default Home;
