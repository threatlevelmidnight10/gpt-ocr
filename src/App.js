import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';


function Whiteboard() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [screenshotURL, setScreenshotURL] = useState(null);

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { clientX, clientY } = event;

    context.beginPath();
    context.moveTo(clientX, clientY);
    setIsDrawing(true);
  }

  function handleMouseMove(event) {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const { clientX, clientY } = event;

    if (isDrawing) {
      context.lineTo(clientX, clientY);
      context.stroke();
    }
  }

  function handleMouseUp(event) {
    setIsDrawing(false);
  }

  function handleClearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  async function handleTakeScreenshot() {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL('image/png');
    const blob = await fetch(dataURL).then((res) => res.blob());

    const data = new FormData();
    data.append('image', blob);

    //console.log(data);

    const options = {
      method: 'POST',
      url: 'https://ocr-extract-text.p.rapidapi.com/ocr',
      headers: {
        'X-RapidAPI-Key': '6d7f2b786fmsh98e7acf745ac918p1e1987jsn9fafd8b44c38',
        'X-RapidAPI-Host': 'ocr-extract-text.p.rapidapi.com'
      },
      data: data
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    setScreenshotURL(dataURL);
    // POST CALL with dataURL
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        width={500}
        height={500}
        style={{ border: '1px solid black' }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '500px',
          height: '500px',
          border: '1px solid black',
          overflow: 'hidden',
        }}
      >
        {screenshotURL && (
          <img
            src={screenshotURL}
            alt="Screenshot"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        )}
      </div>
      <button onClick={handleClearCanvas}>Clear</button>
      <Button onClick={async () => {await handleTakeScreenshot();} } Take Screenshot />
    </div>
  );
}

export default Whiteboard;