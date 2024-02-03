  import React, { useEffect, useState } from "react";
import style from "./chat.module.css";
import {
  addHistory,
  createHistory,
  fetchHistory,
  getResp,
  getUserByObjectId,
} from "../services/firebase";

function ChatPage() {
  const [inputValue, setInputValue] = useState("");
  const [ans, setAns] = useState(null);
  const [error, setError] = useState(null);
  const [user, Setuser] = useState({});
  const [menu, setMenu] = useState(true);
  const [newChat, setNewChat] = useState(null);
  const [sidebarHis, setSideBar] = useState([]);
  const [currId, setCurr] = useState(null);
  const [history, setHistory] = useState([]);
  const [isMenuOpen, setMenuOpen] = useState(null);

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      const updatedHistory = [...history, { query: inputValue, ans: "" }];
      setHistory(updatedHistory);
      setInputValue("");
      getResp({ query: inputValue, setAns: setAns, setError: setError });
    }
  };

  useEffect(() => {
    const id = localStorage.getItem("id");
    if (id != null && id != "")
      getUserByObjectId({
        setUser: Setuser,
        objectId: id,
        setSideBar: setSideBar,
      });
    const chatid = localStorage.getItem("currId");
    if (chatid != null && chatid != "") {
      setCurr(chatid);
    } else {
      setNew();
    }
  }, []);

  useEffect(() => {
    if (currId != null) {
      localStorage.setItem("currId", currId);
    }
  }, [currId]);

  useEffect(() => {
    if (ans != null) {
      const updatedHistory = [...history]; // Create a copy of the current history state
      const lastEntryIndex = updatedHistory.length - 1;
      const val = updatedHistory[lastEntryIndex];
      val.ans = ans;
      updatedHistory[lastEntryIndex] = val;
      setHistory(updatedHistory);

      if (currId == null) {
        createHistory({
          uid: user.objectId,
          data: updatedHistory, // Use the updatedHistory here
          setCurrId: setCurr,
          setNewChat: setNewChat,
        });
        // fetchHistory({ userId: user.objectId, setSideBar: setSideBar });
      } else {
        addHistory({
          userId: user.objectId,
          uid: currId,
          data: updatedHistory,
        });
      }

      setAns(null);
    }
  });

  useEffect(() => {}, [history, sidebarHis]);

  const setNew = () => {
    if (currId != null) var a = 1;

    fetchHistory({ userId: user.objectId, setSideBar: setSideBar });
    localStorage.removeItem("currId");
    setCurr(null);
    setHistory([]);
  };
  const updateCurr = () => {
    if (currId != null) {
      var v = sidebarHis.find((x) => x.uid == currId);
      if (v != null && v.data != null) setHistory(v.data);
      else setHistory([]);
    } else {
      setHistory([]);
    }
  };

  return (
    <div className={style.main}>
      {menu ? (
        <div
          className={style.menubtn}
          onClick={() => {
            setMenu(!menu);
          }}
        >
          <img src="images/menu.png"></img>{" "}
        </div>
      ) : (
        <div className={`${style.menu} ${isMenuOpen ? style.menuClose : style.menuOpen}`}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {" "}
            <div
              className={style.close}
              onClick={() => {
                setMenu(!menu);
              }}
            >
              <img src="images/new.png"></img>{" "}
            </div>
            <div className={style.new} onClick={() => setNew()}>
              {" "}
              <img src="images/new.png"></img>
              New question
            </div>
          </div>

          {
            Array.isArray(sidebarHis) && sidebarHis.length > 0 ? (
              <div className={style.his}>
                {sidebarHis.map((ele, index) => (
                  <div
                    className={style.prev}
                    onClick={() => {
                      fetchHistory({
                        userId: user.objectId,
                        setSideBar: setSideBar,
                      });
                      setCurr(ele.uid);
                      updateCurr();
                    }}
                    key={ele.uid}
                    style={
                      ele.uid == currId
                        ? { border: "1px solid white", padding: "4px 7px" }
                        : { padding: "4px 7px" }
                    }
                  >
                    <img src="images/msg.png" alt="message"></img>
                    Chat {index}
                  </div>
                ))}
              </div>
            ) : null // Alternatively, you can use null instead of <></> for the else condition
          }

          <div className={style.bottom}>
            <div className={style.ul}></div>
            <div className={style.prof}>
              <img src="images/ac.png"></img>
              {user.name}
            </div>

            <div
              className={style.prof}
              onClick={() => {
                window.location = "/#pricing";
              }}
            >
              <img src="images/upgrade.png" style={{ height: "15px" }}></img>
              Upgrade Account
            </div>
          </div>
        </div>
      )}

      <div className={style.chatSec}>
        <div className={style.v1}>
          {" "}
          {history == [] || history == null || history.length == 0 ? (
            <div className={style.empty}>
              <div className={style.emptHeader}>GPT SAHIB</div>
              <div className={style.emptyIns}>
                {" "}
                <img src="images/ins.png"></img> <br></br>
                Instructions
              </div>
              <div className={style.emptyEle}>
                Feel free to ask questions related to Sikh History or seek
                guidance on Mental Health concerns.{" "}
              </div>
              <div className={style.emptyEle}>
                For example, if you're experiencing negative thoughts or a lack
                of self-confidence, the chatbot can provide answers and support
                based on teachings from the Guru Granth Sahib Ji.{" "}
              </div>
              <div className={style.emptyEle}>
                Use clear and concise language to help the chatbot understand
                your query more accurately and provide a relevant response.
              </div>
              <div className={style.emptyEle}>
                Avoid asking general or unrelated questions and remember to use
                appropriate language and a respectful tone.
              </div>
              <div className={style.emptyEle}>
                Limit personal and sensitive information: To ensure your privacy
                and safety
              </div>
            </div>
          ) : (
            <div className={style.chats}>
              {history.map((val, id) => {
                return (
                  <div className={style.qele} key={id}>
                    <div className={style.query}>
                      {" "}
                      <img src="images/acc.png"></img> {val.query}{" "}
                    </div>

                    <div className={style.ans}>
                      {" "}
                      <img src="images/logo.png"></img> {val.ans}
                    </div>
                    <div className={style.hr}></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={style.cinput}>
          <input
            placeholder="Send a message"
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key == "Enter") {
                handleSendMessage();
              }
            }}
          ></input>
          <img src="images/sent.png" onClick={handleSendMessage}></img>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
