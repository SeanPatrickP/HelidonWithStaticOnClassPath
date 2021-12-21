import React, { useState } from "react";

export default function TestProject() {
  const [clickCount, setClickCount] = useState(0);
  const [greeting, setGreeting] = useState("");

  const getMessage = () => {
    setClickCount(clickCount + 1);

    fetch("api/greet", {
      method: "GET",
    })
      .then((response) => (response.ok && response.json()) || Promise.reject())
      .then((response) => {
        if (response && response.message) {
          setGreeting(response.message);
        }
      });
  };

  return (
    <div>
      <button onClick={getMessage}>Click Me To Greet</button>
      <p>{clickCount}</p>
      {greeting && greeting.length && <p>{greeting}</p>}
    </div>
  );
}
