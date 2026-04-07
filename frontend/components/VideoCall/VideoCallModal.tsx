import { useState, useEffect, useRef } from 'react';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  specialty: string;
}

export default function VideoCallModal({ isOpen, onClose, doctorName, specialty }: VideoCallModalProps) {
  const [peerId, setPeerId] = useState('');
  const [remotePeerId, setRemotePeerId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callSeconds, setCallSeconds] = useState(0);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  const peerRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const mountedRef = useRef(true);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  // Timer
  useEffect(() => {
    if (!isConnected) { setCallSeconds(0); return; }
    const interval = setInterval(() => setCallSeconds(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isConnected]);

  // Init Peer + local camera
  useEffect(() => {
    if (!isOpen) return;
    mountedRef.current = true;

    const code = 'NX-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    // Start local camera first
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (!mountedRef.current) { stream.getTracks().forEach(t => t.stop()); return; }
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraReady(true);
      })
      .catch(() => {
        if (mountedRef.current) setError('Camera access denied. Please allow camera & mic permissions in your browser.');
      });

    // Dynamic import PeerJS (avoids SSR issues)
    import('peerjs').then(({ default: Peer }) => {
      if (!mountedRef.current) return;

      const peer = new Peer(code, { debug: 0 });
      peerRef.current = peer;

      peer.on('open', (id: string) => {
        if (mountedRef.current) setPeerId(id);
      });

      peer.on('error', (err: any) => {
        console.warn('Peer error:', err.type);
        if (err.type === 'unavailable-id') {
          const retry = 'NX-' + Math.random().toString(36).substring(2, 8).toUpperCase();
          const p2 = new Peer(retry, { debug: 0 });
          peerRef.current = p2;
          p2.on('open', (id: string) => { if (mountedRef.current) setPeerId(id); });
          p2.on('call', handleIncoming);
        }
      });

      peer.on('call', handleIncoming);
    }).catch(err => {
      console.error('Failed to load PeerJS:', err);
    });

    return () => {
      mountedRef.current = false;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // Attach stream to video element when ref becomes available
  useEffect(() => {
    const attachLocalStream = () => {
      if (localVideoRef.current && localStreamRef.current) {
        localVideoRef.current.srcObject = localStreamRef.current;
      }
    };

    attachLocalStream();
    
    // Fallback interval to handle cases where ref might be set later
    const interval = setInterval(() => {
      if (localVideoRef.current && localStreamRef.current && !localVideoRef.current.srcObject) {
        attachLocalStream();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [cameraReady]);

  const handleIncoming = (incomingCall: any) => {
    callRef.current = incomingCall;
    if (localStreamRef.current) {
      incomingCall.answer(localStreamRef.current);
    }
    incomingCall.on('stream', (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      if (mountedRef.current) { setIsConnected(true); setIsConnecting(false); }
    });
    incomingCall.on('close', () => { if (mountedRef.current) setIsConnected(false); });
  };

  const callPeer = () => {
    if (!remotePeerId.trim() || !peerRef.current || !localStreamRef.current) {
      setError('Make sure your camera is active and enter a valid Room Code.');
      return;
    }
    setIsConnecting(true);
    setError('');

    const outgoingCall = peerRef.current.call(remotePeerId.trim(), localStreamRef.current);
    callRef.current = outgoingCall;

    outgoingCall.on('stream', (remoteStream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
      if (mountedRef.current) { setIsConnected(true); setIsConnecting(false); }
    });

    outgoingCall.on('close', () => { if (mountedRef.current) setIsConnected(false); });
    outgoingCall.on('error', () => {
      if (mountedRef.current) {
        setError('Failed to connect. Check the Room Code and try again.');
        setIsConnecting(false);
      }
    });

    setTimeout(() => { if (mountedRef.current && !isConnected) setIsConnecting(false); }, 15000);
  };

  const cleanup = () => {
    if (callRef.current) { try { callRef.current.close(); } catch(e) {} }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (peerRef.current) { try { peerRef.current.destroy(); } catch(e) {} peerRef.current = null; }
    setIsConnected(false);
    setIsConnecting(false);
    setPeerId('');
    setRemotePeerId('');
    setCallSeconds(0);
    setError('');
    setMicOn(true);
    setCamOn(true);
    setCameraReady(false);
  };

  const handleClose = () => {
    mountedRef.current = false;
    cleanup();
    onClose();
  };

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(t => { t.enabled = !t.enabled; });
    }
    setMicOn(!micOn);
  };

  const toggleCam = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(t => { t.enabled = !t.enabled; });
    }
    setCamOn(!camOn);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(peerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {isConnected && (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <span className={`text-sm font-bold uppercase tracking-wider ${isConnected ? 'text-red-400' : 'text-slate-400'}`}>
            {isConnected ? 'Live Call' : 'Telemedicine — Waiting'}
          </span>
          {isConnected && (
            <span className="text-emerald-400 text-sm font-mono ml-2 bg-emerald-500/10 px-2 py-0.5 rounded">{formatTime(callSeconds)}</span>
          )}
        </div>
        <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative bg-slate-900 rounded-2xl overflow-hidden border border-white/5">
          {isConnected ? (
            <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-slate-800 border-2 border-primary-500/30 mx-auto mb-6 flex items-center justify-center overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorName}&backgroundColor=transparent`} alt="" className="w-28 h-28" />
                </div>
                <p className="text-white font-bold text-2xl mb-1">{doctorName}</p>
                <p className="text-primary-400 text-sm mb-4">{specialty}</p>
                {isConnecting ? (
                  <div className="flex items-center justify-center gap-2 text-primary-400">
                    <span className="w-5 h-5 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin"></span>
                    <span className="text-sm">Connecting...</span>
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">Share your Room Code or enter theirs to connect</p>
                )}
              </div>
            </div>
          )}

          {/* Local video (PiP) */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-800 rounded-xl border-2 border-primary-500/30 overflow-hidden shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <video ref={localVideoRef} autoPlay muted playsInline className={`w-full h-full object-cover ${!camOn ? 'hidden' : ''}`} />
            {!camOn && (
              <div className="w-full h-full flex items-center justify-center bg-slate-900">
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-500/20 border border-primary-500/20 mx-auto flex items-center justify-center text-white font-bold mb-1">You</div>
                  <p className="text-[10px] text-slate-400 mt-1">Camera off</p>
                </div>
              </div>
            )}
            {!cameraReady && camOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <span className="w-6 h-6 border-2 border-primary-400/30 border-t-primary-400 rounded-full animate-spin"></span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] text-white font-medium">You</div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0 overflow-y-auto">
          {/* Room Code */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Your Room Code</h3>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-widest text-center select-all">
                {peerId || <span className="w-4 h-4 border-2 border-slate-500/30 border-t-slate-400 rounded-full animate-spin inline-block"></span>}
              </div>
              <button onClick={copyCode} disabled={!peerId} className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${copied ? 'bg-emerald-600 text-white' : 'bg-primary-600 hover:bg-primary-500 text-white disabled:bg-slate-700 disabled:text-slate-500'}`}>
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">Share this code with the other person to join your call.</p>
          </div>

          {/* Connect */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Join Someone Else</h3>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={remotePeerId}
                onChange={e => setRemotePeerId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && callPeer()}
                placeholder="Enter Room Code..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-primary-500 transition-colors font-mono"
              />
              <button onClick={callPeer} disabled={!remotePeerId.trim() || isConnecting}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-3 rounded-xl font-semibold text-sm transition-all">
                {isConnecting ? '...' : 'Call'}
              </button>
            </div>
            {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          </div>

          {/* Connection Status */}
          <div className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Status</h3>
            <div className="flex items-center gap-3">
              <span className={`flex h-3 w-3 relative`}>
                {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : cameraReady ? 'bg-amber-500' : 'bg-slate-500'}`}></span>
              </span>
              <span className={`font-semibold text-sm ${isConnected ? 'text-emerald-400' : cameraReady ? 'text-amber-400' : 'text-slate-400'}`}>
                {isConnected ? 'Connected — P2P Encrypted' : cameraReady ? 'Camera ready — waiting for peer' : 'Initializing camera...'}
              </span>
            </div>
          </div>

          {/* Instructions */}
          {!isConnected && (
            <div className="glass-card rounded-2xl p-5 border-primary-500/10 bg-primary-500/5">
              <h3 className="text-sm font-bold text-primary-400 mb-2">How to connect:</h3>
              <ol className="text-xs text-slate-400 space-y-1.5 list-decimal list-inside">
                <li>Share your <span className="text-primary-400 font-semibold">Room Code</span> with the other person</li>
                <li>Or enter <span className="text-primary-400 font-semibold">their Room Code</span> and click Call</li>
                <li>Both cameras & mics activate automatically</li>
                <li>Connection is <span className="text-emerald-400 font-semibold">end-to-end encrypted</span></li>
              </ol>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex justify-center gap-4 p-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <button onClick={toggleMic} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${micOn ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-red-500/20 border-red-500/30'}`} title={micOn ? 'Mute' : 'Unmute'}>
          {micOn ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          )}
        </button>
        <button onClick={toggleCam} className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${camOn ? 'bg-white/10 border-white/10 hover:bg-white/20' : 'bg-red-500/20 border-red-500/30'}`} title={camOn ? 'Turn off camera' : 'Turn on camera'}>
          {camOn ? (
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          ) : (
            <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
          )}
        </button>
        <button onClick={handleClose} className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]" title="End Call">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" /></svg>
        </button>
      </div>
    </div>
  );
}
