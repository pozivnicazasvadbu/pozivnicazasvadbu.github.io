/* eslint-disable no-unused-vars */
import { useState, useRef,useEffect } from "react";
import "./App.css";
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import intro from './assets/intro.mp3'
import { collection, setDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUVH2wdT0BETqzmGrJlDOcJi6AIiTsbB4",
  authDomain: "pozivnica-vm.firebaseapp.com",
  projectId: "pozivnica-vm",
  storageBucket: "pozivnica-vm.appspot.com",
  messagingSenderId: "669091824222",
  appId: "1:669091824222:web:51dd66ff076e745aefeacf",
  measurementId: "G-DB0Q3H25JK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  
  const [name, setName] = useState("");

  const [number, setNumber] = useState(0);
  const [attending, setAttending] = useState(false);
  const [guests, setGuests] = useState([]);
  const [visible, setVisible] = useState(false);

  const gosti = [
    { value: 0, text: "Само ја" },
    { value: 1, text: "+1" },
    { value: 2, text: "+2" },
    { value: 3, text: "+3" },
    { value: 4, text: "+4" },
    { value: 5, text: "+5" },
  ];

  const handleSubmit = async () => {
    if (attending) {

      let plus = number > 0 ? number : null
      const documentId = `${name} +${plus}`;
      const guestDocRef = doc(collection(db, "gosti"), documentId);
      const allGuests = [name, ...guests];
      try {
        const docRef = await setDoc(guestDocRef, {
          name,
          number,
          guests: allGuests,
        });
        console.log("Document written with ID: ", docRef);
        alert("ХВАЛА НА ВАШОЈ ПОТВРДИ. ВИДИМО СЕ 30. ЈУНА");
        setAttending(false);
        setGuests("");
        setName("");
        setNumber(0);
      } catch (e) {
        console.error("Error adding document: ", e);
        alert("ГРЕШКА, МОЛИМО ПОКУШАЈТЕ ОПЕТ");
      }
    }
  };

  const openMapa = () => {
    const url = "https://maps.app.goo.gl/rrsJMMFSgBBWg7sT6";
    window.open(url, "_blank").catch((err) => {
      console.error("Ne može se otvoriti mapa:", err);
    });
  };

  return (
    <>
      <div className="container">
        <div className="title"></div>
        <div className="date"></div>
        <div className="restoran">
          <div className="mapa" onClick={openMapa}></div>
        </div>
        <div className="formWrapper">
          <h1 className="formTitle">Потврда доласка</h1>

          <p></p>

          <div className="form">
            <label className="label">ИМЕ и ПРЕЗИМЕ *</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label className="label">ПОТВРЂУЈЕМ ДОЛАЗАК *</label>
            <a className="radioWrapper" onClick={() => setAttending(true)}>
              {attending ? (
                <i className="fa-lg fa-solid fa-square-check radio"></i>
              ) : (
                <i className=" fa-lg fa-solid fa-square radio"></i>
              )}
              <label className="labelradio">Долазим</label>
            </a>
            <a className="radioWrapper mb" onClick={() => setAttending(false)}>
              {!attending ? (
                <i className=" fa-lg fa-solid fa-square-check radio"></i>
              ) : (
                <i className="fa-lg fa-solid fa-square radio"></i>
              )}

              <label className="labelradio">Не долазим</label>
            </a>
            <label className="label">БРОЈ ГОСТИЈУ КОЈИ ДОЛАЗЕ СА МНОМ *</label>
            <div className="inputnumber" onClick={() => setVisible(!visible)}>
              {visible && (
                <div className="listWrapper">
                  {gosti.map((gost) => (
                    <button
                      key={gost.value}
                      className="listItem"
                      onClick={() => {
                        setNumber(gost.value);
                        setVisible(false);
                      }}
                    >
                      {gost.text}
                    </button>
                  ))}
                </div>
              )}
              {number > 0 ? `+${number}` : "Само ја"}
            </div>
            <div className="optionText">
              Изабери из падајућег менија одговарајућу опцију
            </div>
            <label className="labelGosti">
              ИМЕ И ПРЕЗИМЕ ГОСТИЈУ КОЈИ ДОЛАЗЕ СА МНОМ *
            </label>
            <textarea
              name="postContent"
              rows={4}
              cols={40}
              className="input"
              value={guests ? guests?.join("\n") : ''}
              onChange={(e) => {
                const lines = e.target.value.split("\n");
                setGuests(lines);
              }}
            />
          </div>
          <button className="submitWrapper" onClick={handleSubmit}>
            <span className="submit">ПОТВРДИ</span>
          </button>
        </div>
        <div className="molbaWrapper">
          <p className="molba">
            Молимо Вас да потврдите Ваше присуство попуњавањем обрасца или да
            нам се јавите до <br></br>15. јуна 2024.<br></br> Ваши, Весна и
            Милан.
          </p>
        </div>
      </div>
      <div className="footer">
        <p className="footerText">Породице Ераковић и Ракић</p>
      </div>
    </>
  );
}

export default App;
