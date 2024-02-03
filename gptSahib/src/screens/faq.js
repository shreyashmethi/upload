import React, { useState } from "react";
import style from "./main.module.css";
function Faq({ Faq }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${style.faqe} ${open ?  "" : style.open}`}
      onClick={() => {
        setOpen(!open);
      }}
    >
      <div className={style.ques}>
        {Faq.ques}
        <div className={style.qimg}>
          <img
            src={open ? "images/uparr.png" : "images/down.png"}
            onClick={() => {
              setOpen(!open);
            }}
          ></img>
        </div>
      </div>
      {open ? <div className={style.ans}> {Faq.ans} </div> : <></>}
    </div>
  );
}

export default Faq;
