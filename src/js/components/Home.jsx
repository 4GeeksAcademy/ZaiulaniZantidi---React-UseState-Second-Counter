import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

const SecondsCounter = () => {
  
  const [count, setCount] = useState(0); 
  
  const [inputValue, setInputValue] = useState('0'); 
  
  const [isRunning, setIsRunning] = useState(true); 
  
  const [isCountingUp, setIsCountingUp] = useState(true);
  
  const [resetValue, setResetValue] = useState(0);

  
  const [h1Color, setH1Color] = useState('#343a40'); 

  
  const counterIntervalRef = useRef(null);
  const h1GlowIntervalRef = useRef(null);

  const displayMessage = (message, type = 'info') => {
    let messageBox = document.getElementById('messageBox');
    if (!messageBox) {
      messageBox = document.createElement('div');
      messageBox.id = 'messageBox';
      document.body.appendChild(messageBox);
    }
    messageBox.textContent = message;
    messageBox.className = `alert alert-${type} message-box`; 
    messageBox.style.opacity = '1';
    setTimeout(() => {
      messageBox.style.opacity = '0';
    }, 3000); 
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    if (counterIntervalRef.current) {
      clearInterval(counterIntervalRef.current);
      counterIntervalRef.current = null;
    }

    if (isRunning) {
      counterIntervalRef.current = setInterval(() => {
        setCount(prevCount => {
          if (isCountingUp) {
            if (prevCount >= 999999) {
                clearInterval(counterIntervalRef.current);
                counterIntervalRef.current = null;
                setIsRunning(false);
                displayMessage("Counter Reached Maximum Display Limit!", 'warning');
                return 999999;
            }
            return prevCount + 1; 
          } else {
            if (prevCount > 0) {
              return prevCount - 1;
            } else {
              clearInterval(counterIntervalRef.current);
              counterIntervalRef.current = null;
              setIsRunning(false);
              displayMessage("Countdown Complete!", 'success');
              return 0; 
            }
          }
        });
      }, 1000);
    }

    
    return () => {
      if (counterIntervalRef.current) {
        clearInterval(counterIntervalRef.current);
        counterIntervalRef.current = null;
      }
    };
  }, [isRunning, isCountingUp]); 

  
  useEffect(() => {
    if (h1GlowIntervalRef.current) {
      clearInterval(h1GlowIntervalRef.current);
      h1GlowIntervalRef.current = null;
    }

    if (isRunning) {
      h1GlowIntervalRef.current = setInterval(() => {
        setH1Color(getRandomColor());
      }, 200); 
    } else {
      setH1Color('#343a40');
    }

    return () => {
      if (h1GlowIntervalRef.current) {
        clearInterval(h1GlowIntervalRef.current);
        h1GlowIntervalRef.current = null;
      }
    };
  }, [isRunning]); 

  
  const startCounter = () => {
    if (!isRunning) {
      
      if (!isCountingUp && count === 0) {
        displayMessage("Cannot start: Countdown has finished. Please reset or set a new value.", 'danger');
        return;
      }
      setIsRunning(true);
      displayMessage("Counter Started!", 'info');
    }
  };

 
  const stopCounter = () => {
    if (isRunning) {
      clearInterval(counterIntervalRef.current); 
      counterIntervalRef.current = null;
      setIsRunning(false);
      displayMessage("Counter Stopped!", 'warning');
    }
  };

  const resetCounter = () => {
    clearInterval(counterIntervalRef.current); 
    clearInterval(h1GlowIntervalRef.current); 
    counterIntervalRef.current = null;
    h1GlowIntervalRef.current = null;
    setIsRunning(false);
    setCount(resetValue); 
    setH1Color('#343a40'); 
    displayMessage("Counter Reset!", 'info');
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  
  const setNewValue = () => {
    const newValue = parseInt(inputValue, 10);
    
    if (isNaN(newValue) || newValue < 0) {
      displayMessage("Please enter a non-negative number.", 'danger');
      return;
    }

    clearInterval(counterIntervalRef.current); 
    clearInterval(h1GlowIntervalRef.current); 
    counterIntervalRef.current = null;
    h1GlowIntervalRef.current = null;
    setIsRunning(false); 

    setCount(newValue); 
    setResetValue(newValue);

    
    if (newValue <= 0) {
      setIsCountingUp(true);
      setCount(0); 
      setResetValue(0);
      displayMessage(`Counter set to count up from 0!`, 'info');
    } else if (newValue === 1) { 
        setIsCountingUp(true);
        setCount(1);
        setResetValue(1);
        displayMessage(`Counter set to count up from 1!`, 'info');
    }
    else {
      setIsCountingUp(false); 
      displayMessage(`Counter set to countdown from ${newValue} seconds!`, 'info');
    }
    setH1Color('#343a40'); 
  };


  const formatCount = (num) => {
    return String(num).padStart(6, '0');
  };

  const formattedCount = formatCount(count);

  return (
    <div className="seconds-counter-container">

      <h1 style={{ color: h1Color, textShadow: isRunning ? `0 0 10px ${h1Color}, 0 0 20px ${h1Color}` : 'none' }}>
        Seconds Counter {isCountingUp ? 'Incremental Time' : 'Decremental Time'}
      </h1>

      <div className="timer-display-wrapper">
        <svg className="timer-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
        </svg>

        <div className="digit-card-container">
          {formattedCount.split('').map((digit, index) => (
            <div key={index} className="digit-card">
              {digit}
            </div>
          ))}
        </div>
      </div>

      <div className="input-group">
        <input
          type="number"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Set start/countdown value"
          min="0" 
        />
        <button onClick={setNewValue}>Set Value</button>
      </div>

      <div className="control-buttons">
        <button className="start-btn" onClick={startCounter} disabled={isRunning || (!isCountingUp && count === 0)}>
          {isRunning ? 'Running' : (isCountingUp ? 'Start' : (count === resetValue ? 'Start' : 'Resume'))}
        </button>
        <button className="stop-btn" onClick={stopCounter} disabled={!isRunning}>
          Stop
        </button>
        <button className="reset-btn" onClick={resetCounter}>
          Reset
        </button>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SecondsCounter />);

export default SecondsCounter;
