import React from "react";
import style from "./main.module.css";

function Card1({ header, para, images }) {
  return (
    <div className={style.card}>
      <div className={style.card1}>
        <img src={images}></img>
      </div>
      <div className={style.card2}>
        <div style={{ fontSize: "20px" }}>{header}</div>
        <br></br>
        <div>{para}</div>
      </div>
    </div>
  );
}

export default Card1;
