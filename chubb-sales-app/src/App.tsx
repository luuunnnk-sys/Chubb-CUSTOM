import { useState, useEffect } from 'react';
import './index.css';
import type { Prospect, Action, CalendarEvent } from './types/types';
import { getProspects, getActions, getEvents, saveProspects, addProspect, updateProspect, deleteProspect, calculateScore, generateId } from './utils/storage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProspectList from './components/ProspectList';
import ProspectDetail from './components/ProspectDetail';
import Planning from './components/Planning';
import NewProspectModal from './components/NewProspectModal';

type View = 'dashboard' | 'prospects' | 'planning';

function App() {
  const [view, setView] = useState<View>('dashboard');
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  // Charger les données au démarrage
  useEffect(() => {
    setProspects(getProspects());
    setActions(getActions());
    setEvents(getEvents());
  }, []);

  // Calculer et sauvegarder les scores
  useEffect(() => {
    const updated = prospects.map(p => ({
      ...p,
      score: calculateScore(p)
    }));
    if (JSON.stringify(updated) !== JSON.stringify(prospects)) {
      saveProspects(updated);
    }
  }, [prospects]);

  const handleAddProspect = (prospect: Omit<Prospect, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => {
    const newProspect: Prospect = {
      ...prospect,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      score: 0,
    };
    newProspect.score = calculateScore(newProspect);
    addProspect(newProspect);
    setProspects([...prospects, newProspect]);
    setShowNewModal(false);
  };

  const handleUpdateProspect = (id: string, updates: Partial<Prospect>) => {
    updateProspect(id, updates);
    setProspects(getProspects());
    if (selectedProspect?.id === id) {
      setSelectedProspect({ ...selectedProspect, ...updates });
    }
  };

  const handleDeleteProspect = (id: string) => {
    if (window.confirm('Supprimer ce prospect ?')) {
      deleteProspect(id);
      setProspects(getProspects());
      if (selectedProspect?.id === id) {
        setSelectedProspect(null);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentView={view}
        onChangeView={(v) => {
          setView(v);
          setSelectedProspect(null);
        }}
        onNewProspect={() => setShowNewModal(true)}
      />

      {/* Contenu principal */}
      <main className="flex-1 overflow-hidden">
        {view === 'dashboard' && (
          <Dashboard
            prospects={prospects}
            actions={actions}
            onSelectProspect={(p) => {
              setSelectedProspect(p);
              setView('prospects');
            }}
          />
        )}

        {view === 'prospects' && !selectedProspect && (
          <ProspectList
            prospects={prospects}
            onSelectProspect={setSelectedProspect}
            onNewProspect={() => setShowNewModal(true)}
          />
        )}

        {view === 'prospects' && selectedProspect && (
          <ProspectDetail
            prospect={selectedProspect}
            actions={actions.filter(a => a.prospectId === selectedProspect.id)}
            onBack={() => setSelectedProspect(null)}
            onUpdate={(updates) => handleUpdateProspect(selectedProspect.id, updates)}
            onDelete={() => handleDeleteProspect(selectedProspect.id)}
            onAddAction={(action) => {
              setActions([...actions, action]);
            }}
          />
        )}

        {view === 'planning' && (
          <Planning
            events={events}
            prospects={prospects}
            onAddEvent={(event) => setEvents([...events, event])}
          />
        )}
      </main>

      {/* Modal nouveau prospect */}
      {showNewModal && (
        <NewProspectModal
          onClose={() => setShowNewModal(false)}
          onSave={handleAddProspect}
        />
      )}
    </div>
  );
}

export default App;
