import React, { useState } from 'react';
import './App.css';
import GenerateQuizTab from './tabs/GenerateQuizTab';
import HistoryTab from './tabs/HistoryTab';

function App() {
  const [activeTab, setActiveTab] = useState('generate');

  const TabButton = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`tab-button ${activeTab === id ? 'active' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Wikipedia Quiz Generator</h1>
      </header>

      <main className="app-main">
        <nav className="app-nav">
          <TabButton id="generate" label="Generate Quiz" />
          <TabButton id="history" label="History" />
        </nav>
        
        <div className="tab-content">
          {activeTab === 'generate' && <GenerateQuizTab />}
          {activeTab === 'history' && <HistoryTab />}
        </div>
      </main>
    </div>
  );
}

export default App;