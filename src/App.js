import React, { useState } from 'react';
import './App.css';

function App() {
  const [handValues, setHandValues] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState('');

  const handleClick = async (position) => {
    setSelectedPosition(position);
    try {
      // const response = await fetch(`http://localhost:3000/hand-values?position=${position}`);
      const response = await fetch(`/hand-values?position=${position}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);  // Add this line

      setHandValues(data);
    } catch (error) {
      console.log('Fetch failed:', error);
    }
  };

// Function to get the color class based on the percentage
const getColorClass = (percentage) => {
  const percent = parseFloat(percentage);
  if (percent >= 0.76) return 'green';
  if (percent >= 0.51) return 'palegreen';
  if (percent >= 0.26) return 'yellow';
  if (percent >= 0.01) return 'orange';
  if (percent === 0.0) return 'red';
  return '';
};

  return (
    <div className="display">
      <h1>Starting Hand Ranges for PLO</h1>
      <div className="button-container">
        <button onClick={() => handleClick('BTN')}>BTN</button>
        <button onClick={() => handleClick('SB')}>SB</button>  
        <button onClick={() => handleClick('BB')}>BB</button>
        <button onClick={() => handleClick('LJ')}>LJ</button>
        <button onClick={() => handleClick('HJ')}>HJ</button>
        <button onClick={() => handleClick('CO')}>CO</button>
      </div>
      <br></br>
      {selectedPosition && <h2>Position: {selectedPosition}</h2>}
      <ul>
        {handValues.map((group, index) => (
          <li key={index}>
            <details className="details">
              <summary className={getColorClass(group.percentage)}>Open: {group.percentage * 100}%</summary>
              <ul>
                {group.hands.map((hand, index) => (
                  <li key={index}>
                    <span className="range-description-bold">Range: {hand.range}, </span>
                    <span className="range-description">Description: {hand.description}</span>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
