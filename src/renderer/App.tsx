import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useSound from 'use-sound';
import './App.css';
import { useOrderSignalR } from './helpers/hooks/useOrderSignalR';

import sound from './assets/notification.mp3';

const Hello = () => {
  const { connectToHub } = useOrderSignalR();
  const [establishmentGuid, setEstablishmentGuid] = useState('');
  const [play] = useSound(sound);

  const testPlay = () => {
    play();
  };

  const showNotification = () => {
    window.electron.ipcRenderer.sendMessage('notification:show', [
      'Notificação teste',
    ]);
  };

  const connect = () => {
    connectToHub(
      establishmentGuid,
      (guid, type) => {
        showNotification();
        play();
      },
      () => {
        toast.success('Conectado', {
          position: 'top-left',
        });
      }
    );
  };
  return (
    <div className="container">
      <div className="inputContainer">
        <input
          type="text"
          value={establishmentGuid}
          onChange={(e) => setEstablishmentGuid(e.target.value)}
        />
        <button type="button" onClick={connect}>
          Connect
        </button>
      </div>
      <button type="button" onClick={testPlay}>
        Test Audio
      </button>
      <button type="button" onClick={showNotification}>
        Test Notification
      </button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
