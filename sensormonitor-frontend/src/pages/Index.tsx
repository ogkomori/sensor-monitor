import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Play, StopCircle, Trash2 } from 'lucide-react';

async function postSimulation(action: 'start' | 'stop') {
  const url = `http://localhost:8080/simulation/${action}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Failed to ' + action + ' simulation');
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

const Index = () => {
  const [simState, setSimState] = useState<'idle' | 'loading' | 'started' | 'stopping' | 'stopped'>('idle');
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [clearing, setClearing] = useState(false);
  useEffect(() => {
    async function fetchSimStatus() {
      try {
        const res = await fetch('http://localhost:8080/simulation/started');
        if (!res.ok) throw new Error('Failed to fetch simulation status');
        const started = await res.json();
        setSimState(started ? 'started' : 'stopped');
      } catch (err) {
        setSimState('idle');
      }
    }
    fetchSimStatus();
  }, []);
  const { toast } = useToast();

  const handleStartSimulation = async () => {
    setSimState('loading');
    const success = await postSimulation('start');
    if (!success) {
      toast({
        title: 'Backend Not Connected',
        description: 'Could not start simulation. Please check your backend connection.',
        variant: 'destructive',
      });
    }
    setSimState(success ? 'started' : 'idle');
  };

  const handleStopSimulation = async () => {
    setSimState('stopping');
    const success = await postSimulation('stop');
    setSimState(success ? 'stopped' : 'started');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to your Sensor Monitor!</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
        Select a sensor from the sidebar to view its overview, alerts, or history. This dashboard helps you monitor your IoT sensors in real time.
      </p>
      <div className="flex gap-4 mb-8">
        <button
          className={`px-6 py-2 rounded-lg font-semibold shadow flex items-center gap-2 transition
            ${simState === 'idle' || simState === 'stopped' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
            ${simState === 'loading' ? 'bg-green-600 text-white' : ''}
            ${simState === 'started' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
            ${simState === 'stopping' ? 'bg-red-600 text-white' : ''}
          `}
          onClick={
            simState === 'idle' || simState === 'stopped'
              ? handleStartSimulation
              : simState === 'started'
              ? handleStopSimulation
              : undefined
          }
          disabled={simState === 'loading' || simState === 'stopping'}
        >
          {simState === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Starting...
            </>
          ) : simState === 'started' ? (
            <>
              <StopCircle className="h-5 w-5 mr-2" />
              Stop Simulation
            </>
          ) : simState === 'stopping' ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Stopping...
            </>
          ) : simState === 'stopped' ? (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Simulation
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start Simulation
            </>
          )}
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold shadow flex items-center gap-2 transition bg-red-600 hover:bg-red-700 text-white`}
          onClick={() => setShowClearDialog(true)}
          disabled={clearing}
        >
          {clearing ? (
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            ) : (
            <Trash2 className="h-5 w-5 mr-2" />
          )}
          Clear Data
        </button>
      </div>
      {showClearDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px]">
            <h3 className="text-lg font-bold mb-4 text-center text-red-700">Are you sure you want to clear all sensor data?</h3>
            <div className="flex gap-4 justify-center">
              <button
                className="px-6 py-2 rounded-lg font-semibold bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  setClearing(true);
                  try {
                    const res = await fetch('http://localhost:8080/simulation/clear-data', { method: 'DELETE' });
                    if (!res.ok) throw new Error('Failed to clear data');
                    toast({ title: 'Data Cleared', description: 'All sensor data has been cleared.', variant: 'destructive' });
                  } catch (err) {
                    toast({ title: 'Error', description: 'Failed to clear data.', variant: 'destructive' });
                  }
                  setClearing(false);
                  setShowClearDialog(false);
                }}
                disabled={clearing}
              >
                Clear
              </button>
              <button
                className="px-6 py-2 rounded-lg font-semibold bg-muted text-black border"
                onClick={() => setShowClearDialog(false)}
                disabled={clearing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-4">
        <a
          href="https://www.linkedin.com/in/oghenetega-komori/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.599 2.001 3.599 4.599v5.597z"/></svg>
          LinkedIn
        </a>
        <a
          href="https://github.com/ogkomori/sensor-monitor"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-2 rounded-lg bg-gray-800 text-white font-semibold shadow hover:bg-gray-900 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.61-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.218.694.825.576 4.765-1.585 8.199-6.082 8.199-11.385 0-6.627-5.373-12-12-12z"/></svg>
          GitHub
        </a>
      </div>
    </div>
  );
};

export default Index;
