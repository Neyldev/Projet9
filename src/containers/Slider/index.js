import { useEffect, useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef(null);

  const byDateDesc = data?.focus.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const nextCard = () => {
    if (!isPaused) {

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(
        () => setIndex(index < byDateDesc.length - 1 ? index + 1 : 0), 5000
        // () => setIndex(index < byDateDesc.length ? index + 1 : 0), 5000 avant
      );
    }
  };

  const PressEspace = (event) => {
    if (event.key === " ") {
      event.preventDefault();
      setIsPaused(!isPaused);

      if (!isPaused) {
        nextCard();
      }

      if (isPaused && timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  useEffect(() => {
    nextCard();
    window.addEventListener("keydown", PressEspace);

    return () => {
      window.removeEventListener("keydown", PressEspace);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, isPaused, byDateDesc]);

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <>
          <div
            key={event.title}
            className={`SlideCard SlideCard--${index === idx ? "display" : "hide"
              }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((_, radioIdx) => (
                <input
                  key={`${event.id}`}
                  type="radio"
                  name="radio-button"
                  // checked={idx === radioIdx} avant
                  checked={index === radioIdx}
                />
              ))}
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Slider;
