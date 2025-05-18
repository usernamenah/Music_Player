import MusicPlayer from './components/MusicPlayer';
import React, { useState } from 'react';
import './App.css';
import LocalMusicPlayer from './components/LocalMusicPlayer';

function App() {
  const [activeTab, setActiveTab] = useState('downloads');
  return (
    <div>
      <div className="tabs">
      <div className="tab-buttons">
        <button
          className={activeTab === 'downloads' ? 'active' : ''}
          onClick={() => setActiveTab('downloads')}
        >
          Downloads
        </button>
        <button
          className={activeTab === 'youtubelink' ? 'active' : ''}
          onClick={() => setActiveTab('youtubelink')}
        >
          YouTube_Link
        </button>
      </div>

      <div className={`tab-content ${activeTab === 'downloads' ? 'active' : ''}`}>
        <LocalMusicPlayer />
      </div>

      <div className={`tab-content ${activeTab === 'youtubelink' ? 'active' : ''}`}>
        {/* Add your YouTube Link content here */}
        <MusicPlayer />
      </div>
    </div>
      
      
    </div>
  );
}
export default App;