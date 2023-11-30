// pages/index.tsx
"use client"
import React, { useEffect, useState } from 'react';

// Creating a usestate which will have our information needed
const Home = () => {
  const [message, setMessage] = useState<{resEth:String, resGas:String }>({resEth:'', resGas:'' });
  
  // connects to the websocket with the correct port
  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3001');

    // opens socket
    socket.onopen = () => {
      console.log('Connected to server');
    };

    // grabs the correct data and puts it into a json when connection occurs in this case
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessage(message);
      console.log(message);
    };

    socket.onclose = () => {
      console.log('Disconnected from server');
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  // simple styling to display the data, the positioning and box/background colours done in css
  return (
    <div className = "centered-box">
      <h2>Ether Stats</h2>
      <div className = "centered">
        <h3>Gas Price (GEWI): {message.resGas}</h3>
        <h3>Ether Price (USD): {message.resEth}</h3>
      </div>
    </div>
  );
};

export default Home;
