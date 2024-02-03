import React from "react";
import style from "./main.module.css";

function PricingCard({ card }) {
  const list = [];
  return (
    <div className={style.pcard}>
      <div className={style.cardHead} style={{ background: card.color }}>
        {card.head}
      </div>
      <div className={style.points}>
        {card.points.map((val) => {
          return (
            <div className={style.cardel}>
              <img src={card.path}></img>
              <div> {val} </div>
            </div>
          );
        })}
      </div>
      <div className={style.cardPrice}>
        <span>{card.price[0]}</span>
        <br></br>
        {card.price[1]}
      </div>
      <button className={style.priceBtn}>Select</button>
    </div>
  );
}

export default PricingCard;
