import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { OpeningScreen } from './components/OpeningScreen';
import { HomeScreen } from './components/HomeScreen';
import { MemoryCarousel } from './components/MemoryCarousel';
import { LetterScreen } from './components/LetterScreen';
import { WishScreen } from './components/WishScreen';
import { FinalScreen } from './components/FinalScreen';
import { EndingScreen } from './components/EndingScreen';
import { MusicToggle } from './components/MusicToggle';
import { birthdayContent } from './data/birthdayContent';
import type { Screen } from './types';

const STORAGE_KEY = 'caca-birthday-v1';

interface PersistedState {
  introOpened: boolean;
  wishCompleted: boolean;
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch {
    // ignore
  }
  return { introOpened: false, wishCompleted: false };
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export default function App() {
  const [persisted, setPersisted] = useState<PersistedState>(loadState);
  const [screen, setScreen] = useState<Screen>(
    persisted.introOpened ? 'home' : 'opening'
  );
  // Track which screens have been visited this session
  const [visited, setVisited] = useState<Set<Screen>>(new Set());

  const markVisited = useCallback((s: Screen) => {
    setVisited(prev => new Set([...prev, s]));
  }, []);

  // Sync persisted state to localStorage whenever it changes
  useEffect(() => {
    saveState(persisted);
  }, [persisted]);

  const handleEnter = useCallback(() => {
    setPersisted(p => ({ ...p, introOpened: true }));
    setScreen('home');
  }, []);

  const handleNavigate = useCallback((s: Screen) => {
    markVisited(s);
    setScreen(s);
  }, [markVisited]);

  const handleWishComplete = useCallback(() => {
    setPersisted(p => ({ ...p, wishCompleted: true }));
  }, []);

  const handleReplay = useCallback(() => {
    setPersisted({ introOpened: false, wishCompleted: false });
    setVisited(new Set());
    setScreen('opening');
  }, []);

  return (
    <div className="app-shell">
      <div className="app-frame">
        {/* Persistent music toggle — renders only when audio file exists */}
        <MusicToggle
          src={birthdayContent.music.src}
          defaultEnabled={birthdayContent.music.defaultEnabled}
        />

        {/* Screen transitions */}
        <AnimatePresence mode="wait">
          {screen === 'opening' && (
            <OpeningScreen key="opening" onEnter={handleEnter} />
          )}

          {screen === 'home' && (
            <HomeScreen
              key="home"
              onNavigate={handleNavigate}
              wishCompleted={persisted.wishCompleted}
              visited={visited}
            />
          )}

          {screen === 'memories' && (
            <MemoryCarousel
              key="memories"
              onBack={() => setScreen('home')}
            />
          )}

          {screen === 'letter' && (
            <LetterScreen
              key="letter"
              onBack={() => setScreen('home')}
            />
          )}

          {screen === 'wish' && (
            <WishScreen
              key="wish"
              onBack={() => setScreen('home')}
              onComplete={handleWishComplete}
              wishCompleted={persisted.wishCompleted}
            />
          )}

          {screen === 'final' && (
            <FinalScreen
              key="final"
              onContinue={() => setScreen('ending')}
            />
          )}

          {screen === 'ending' && (
            <EndingScreen
              key="ending"
              onReplay={handleReplay}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

