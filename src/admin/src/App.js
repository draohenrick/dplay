import { useEffect, useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000'); // backend deve expor WebSocket
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard WhatsApp Dplay</h1>
      <ul>
        {messages.map((m, i) => <li key={i}>{m.from}: {m.body}</li>)}
      </ul>
    </div>
  );
}

export default App;
