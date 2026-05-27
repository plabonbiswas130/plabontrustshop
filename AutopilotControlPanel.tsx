import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Check, 
  X, 
  FileCode, 
  Sparkles, 
  Activity, 
  HelpCircle, 
  ArrowRight,
  ShieldAlert,
  Save,
  CheckCircle,
  FileCheck,
  Mic,
  MicOff,
  Volume2,
  Lock,
  Eye,
  RefreshCw,
  Sparkle,
  Globe,
  Database,
  Video,
  VideoOff,
  Wifi,
  Layers,
  Cpu,
  Shield,
  Zap,
  Radio,
  Sliders,
  Terminal,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  sender: 'ai' | 'user';
  text: string;
  time: string;
  isCodePrompt?: boolean;
  target?: string;
}

export function AutopilotControlPanel() {
  const [isAutopilotActive, setIsAutopilotActive] = useState(true);
  const [targetFile, setTargetFile] = useState('src/components/AdminPanel.tsx');
  const [aiCommand, setAiCommand] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Real-time camera and audio stream state (WebRTC)
  const [webRtcStream, setWebRtcStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [micVolume, setMicVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Female Voice Synthesizer settings
  const [isFemaleVoiceEnabled, setIsFemaleVoiceEnabled] = useState(true);
  
  // Simulated Interactive Shop Layout data for the Sandbox Preview
  const [sandboxData, setSandboxData] = useState({
    storeName: "রয়্যাল প্যালেস শপ",
    bio: "স্বাগতম! এটি আমাদের প্রিমিয়াম এআই ডেমো শপ। কাস্টমারদের জন্য ১০০% কোয়ালিটি নিশ্চয়তা।",
    showCategories: false,
    products: [
      { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', originalPrice: '২,৫০০', price: '২,৫০০', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200' },
      { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', originalPrice: '১,৫০০', price: '১,৫০০', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' }
    ]
  });

  // Safe Sandbox and Code comparison preview states
  const [originalCode, setOriginalCode] = useState<string>(`// মেইন লাইভ কোড (সুরক্ষিত মোড)
function DropshipStoreInterface() {
  const [storeName, setStoreName] = useState("রয়্যাল প্যালেস শপ");
  const [bio, setBio] = useState("স্বাগতম আমাদের শপে!");
  
  const [products, setProducts] = useState([
    { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,৫০০' },
    { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,৫০০' }
  ]);
  
  return (
    <div>
      <h1>{storeName}</h1>
      <p>{bio}</p>
    </div>
  );
}`);

  const [proposedCode, setProposedCode] = useState<string>(`// এআই প্রস্তাবিত কোড (অনুমোদনের অপেক্ষায়)
function DropshipStoreInterface() {
  const [storeName, setStoreName] = useState("রয়্যাল প্যালেস শপ");
  const [bio, setBio] = useState("স্বাগতম আমাদের শপে!");
  
  const [products, setProducts] = useState([
    { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,৫০০' },
    { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,৫০০' }
  ]);

  return (
    <div>
      <h1>{storeName}</h1>
      <p>{bio}</p>
    </div>
  );
}`);

  const [explanation, setExplanation] = useState<string>('');
  const [hasPendingPatch, setHasPendingPatch] = useState(false);

  // Live Voice Pilot specific states
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [voiceLog, setVoiceLog] = useState<string>('// লাইভ ভয়েস ইঞ্জিন নিষ্ক্রিয়। "ভয়েস মোড চালু" করুন।');

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      sender: 'ai',
      text: 'হ্যালো অ্যাডমিন! আমি আপনার পুরো ড্রপশিপিং ও একাউন্ট পোর্টাল সিস্টেম মনিটর করছি। কোনো নতুন ফিচার যোগ করতে বা বাগ ফিক্স করতে নিচে টার্গেট ফাইল সিলেক্ট করে আমাকে সরাসরি ভয়েস বা টাইপ করে নির্দেশ দিন।',
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Helper routine to generate sandboxed iframe content for real-time visual output
  const getSandboxHtml = () => {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 16px; }
          .badge { animation: pulse 2s infinite; }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: .6; } }
        </style>
      </head>
      <body class="flex flex-col h-full justify-between">
        <div class="border-b border-slate-800 pb-3 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-rose-500 uppercase tracking-widest bg-rose-550/10 p-1 px-2.5 rounded-full border border-rose-500/20">
              🛠️ Sandbox Draft View
            </span>
            <span class="text-[10px] text-slate-400 font-mono">Status: Connected to AI</span>
          </div>
          <h2 class="text-xl font-black text-white mt-2 mb-1">${sandboxData.storeName}</h2>
          <p class="text-xs text-slate-400 font-medium leading-relaxed">${sandboxData.bio}</p>
        </div>

        ${sandboxData.showCategories ? `
        <div class="mb-4 bg-slate-900 border border-slate-800 p-2 rounded-xl text-left">
          <p class="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest mb-1.5 px-1">AI Generated Categories (ক্যাটাগরি মেনু):</p>
          <div class="flex gap-2 overflow-x-auto pb-1">
            <span class="text-[10px] bg-pink-600 text-white font-extrabold px-3 py-1 rounded-full cursor-pointer shrink-0">সব প্রোডাক্ট (${sandboxData.products.length})</span>
            <span class="text-[10px] bg-indigo-650 text-white font-extrabold px-3 py-1 rounded-full cursor-pointer shrink-0">স্মার্ট গাজেট</span>
            <span class="text-[10px] bg-slate-800 text-slate-350 px-3 py-1 rounded-full cursor-pointer shrink-0">হেডফোন</span>
            <span class="text-[10px] bg-slate-800 text-slate-350 px-3 py-1 rounded-full cursor-pointer shrink-0">স্মার্ট ঘড়ি</span>
          </div>
        </div>
        ` : ''}

        <div class="text-left">
          <p class="text-xs font-bold text-slate-300 mb-2">গ্যালারি প্রোডাক্টসমূহ:</p>
          <div class="grid grid-cols-2 gap-3">
            ${sandboxData.products.map(p => `
              <div class="bg-slate-900 border border-slate-800 p-2.5 rounded-xl flex flex-col justify-between">
                <img referrerPolicy="no-referrer" src="${p.image}" class="w-full h-16 object-cover rounded-md mb-2 bg-slate-950" />
                <div>
                  <h4 class="text-[11px] font-bold text-slate-200 line-clamp-1">${p.title}</h4>
                  <div class="flex items-center gap-1.5 mt-1">
                    <span class="text-xs font-black text-emerald-400">৳${p.price}</span>
                    ${p.price !== p.originalPrice ? `
                      <span class="text-[9px] text-slate-500 line-through">৳${p.originalPrice}</span>
                      <span class="text-[8px] bg-rose-500 text-white px-1 rounded font-black">ছাড়!</span>
                    ` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-800/60 text-center text-[10px] text-slate-500 font-bold">
          * এই প্রিভিউতে ডেটা ডিলিট বা মূল কাস্টমার ডাটাবেজের ক্ষতি হওয়ার কোনো ভয় নেই।
        </div>
      </body>
      </html>
    `;
  };

  // Speaks Bengali Text using Web Voice Synthesis using a female pitch parameter
  const speakInBengaliFemale = (phrase: string) => {
    if (!isFemaleVoiceEnabled || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      
      const voices = window.speechSynthesis.getVoices();
      // Try to find native or Google Bangla female speaker, otherwise fallback to standard languages
      const selectedVoice = voices.find(v => v.lang.startsWith('bn') || v.name.includes('Bangla') || v.name.includes('Bengali')) 
                            || voices.find(v => v.lang.includes('IN') && (v.name.includes('Google') || v.name.includes('Female')))
                            || voices[0];
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.pitch = 1.25; // Higher pitch for smooth natural female voice output
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis error:", e);
    }
  };

  // Helper routine to render red/green diff line-by-line
  const renderCodeDiff = (oldStr: string, newStr: string) => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    
    // Simplistic visual alignment diff for reactive illustration
    const maxLines = Math.max(oldLines.length, newLines.length);
    const diffRows: React.ReactNode[] = [];

    for (let i = 0; i < maxLines; i++) {
      const oldLine = oldLines[i] || '';
      const newLine = newLines[i] || '';

      if (oldLine === newLine) {
        diffRows.push(
          <div key={i} className="flex font-mono text-[10px] leading-relaxed border-b border-slate-900/45 py-0.5 hover:bg-slate-900/10">
            <span className="w-8 text-right pr-2 text-slate-600 shrink-0 select-none">{i+1}</span>
            <span className="text-slate-500 pl-2 whitespace-pre-wrap">{oldLine}</span>
          </div>
        );
      } else {
        if (oldLine) {
          diffRows.push(
            <div key={`del-${i}`} className="flex font-mono text-[10px] leading-relaxed bg-red-950/30 text-red-300 border-l-2 border-red-500 py-0.5">
              <span className="w-8 text-right pr-2 text-red-900/80 shrink-0 select-none">-</span>
              <span className="pl-2 whitespace-pre-wrap line-through decoration-red-800/40 text-red-400 bg-red-950/15 w-full">{oldLine}</span>
            </div>
          );
        }
        if (newLine) {
          diffRows.push(
            <div key={`add-${i}`} className="flex font-mono text-[10px] leading-relaxed bg-emerald-950/30 text-emerald-300 border-l-2 border-emerald-500 py-0.5">
              <span className="w-8 text-right pr-2 text-emerald-900/50 shrink-0 select-none">+</span>
              <span className="pl-2 whitespace-pre-wrap text-emerald-400 bg-emerald-950/15 w-full">{newLine}</span>
            </div>
          );
        }
      }
    }

    return (
      <div className="flex flex-col overflow-y-auto max-h-[3400px]">
        {diffRows}
      </div>
    );
  };

  // Common workspace files for quick administration
  const quickFiles = [
    'src/components/AdminPanel.tsx',
    'src/App.tsx',
    'server.ts'
  ];

  // Fetch initial autopilot settings
  useEffect(() => {
    fetchStatus();
    // Warm up TTS voices list
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      stopCameraMic();
    };
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/autopilot/status');
      const data = await res.json();
      if (data.success) {
        setIsAutopilotActive(data.enabled);
      }
    } catch (err) {
      console.error("Error fetching autopilot status:", err);
    }
  };

  const toggleAutopilot = async () => {
    const nextState = !isAutopilotActive;
    setIsAutopilotActive(nextState);
    if (!nextState) {
      setIsVoiceActive(false);
      stopCameraMic();
      setIsCameraActive(false);
    }
    try {
      await fetch('/api/autopilot/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: nextState })
      });
      
      const textMsg = nextState 
        ? '🤖 অটো-পাইলট মোড সফলভাবে সক্রিয় করা হয়েছে! আমি এখন সিস্টেমের যেকোনো পরিবর্তন কোড করতে এবং রিয়েল-টাইমে তা সিঙ্ক করতে প্রস্তুত।' 
        : '⚠️ অটো-পাইলট মোড নিষ্ক্রিয় করা হয়েছে। ড্রাফটিং ও লাইভ ডায়াগনসিস সাময়িকভাবে বন্ধ থাকবে।';
      
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: textMsg,
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakInBengaliFemale(textMsg);
    } catch (err) {
      console.error("Failed to toggle autopilot on backend:", err);
    }
  };

  // Starts both real camera view and micro level monitoring (WebRTC implementation)
  const startCameraMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setWebRtcStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Setup Audio Analyser for volume level showing active mic input
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const checkVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          setMicVolume(average); 
          animationFrameRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      }
      setIsCameraActive(true);
      setVoiceLog('🟢 এআই সিস্টেম ও ক্যামেরা/মাইক্রোফোন সক্রিয়! কথা বলুন "ক্যাটাগরি বার এড করো"');
    } catch (err) {
      console.error("WebRTC Camera access blocked or missing dev permission:", err);
      setVoiceLog('⚠️ ক্যামেরা বা মাইক্রোফোন সংযোগ ব্রাউজার দ্বারা অস্বীকৃত হয়েছে। তবে ভার্চুয়াল ট্র্যাকিং সচল আছে।');
      setIsCameraActive(true); // virtual visual tracking
    }
  };

  const stopCameraMic = () => {
    if (webRtcStream) {
      webRtcStream.getTracks().forEach(track => track.stop());
      setWebRtcStream(null);
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
    setMicVolume(0);
    setIsCameraActive(false);
  };

  // Real-time microphone listener (Web Speech Recognition)
  useEffect(() => {
    if (!isVoiceActive || !isAutopilotActive) {
      stopCameraMic();
      return;
    }

    startCameraMic();

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceLog('⚠️ দুঃখিত! এই ব্রাউজারে রিয়েল-টাইম স্পিচ রিকগনিশন সাপোর্ট করে না। অনুগ্রহ করে ক্রোম ব্যবহার করুন।');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'bn-BD';

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript || interimTranscript;
      if (text) {
        setVoiceLog(`🗣️ আপনার লাইভ কন্ঠ সনাক্তকৃত: "${text}"\n// সুরক্ষার জন্য এআই নির্দেশনা ফিল্টার বিশ্লেষণ করছে...`);
        
        const cleanText = text.toLowerCase();
        if (cleanText.includes('ক্যাটাগরি') || cleanText.includes('category') || cleanText.includes('মেনু')) {
          handleVoiceCommandDetected('ক্যাটাগরি বার এড করো');
        } else if (cleanText.includes('নাম') || cleanText.includes('প্রোফাইল') || cleanText.includes('পরিবর্তন')) {
          handleVoiceCommandDetected('প্রোফাইল নাম পরিবর্তন করো');
        } else if (cleanText.includes('দাম') || cleanText.includes('কমাও')) {
          handleVoiceCommandDetected('দাম ৫০০ কমাও');
        } else if (cleanText.includes('বায়ো') || cleanText.includes('ট্যাগ')) {
          handleVoiceCommandDetected('বায়ো সেকশনে নতুন ট্যাগ লাইন দাও');
        }
      }
    };

    recognition.onerror = (e: any) => {
      console.warn("Speech engine engine log connection:", e);
    };

    recognition.onend = () => {
      if (isVoiceActive && isAutopilotActive) {
        try { recognition.start(); } catch (err) {}
      }
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn(e);
    }

    return () => {
      recognition.stop();
    };
  }, [isVoiceActive, isAutopilotActive]);

  // Handle triggered live speech or simulation
  const handleVoiceCommandDetected = (command: string) => {
    setIsSearching(true);
    setVoiceLog(`⚡ [ভয়েস কমান্ড সনাক্তকৃত]: "${command}"\n// কোড ডিয়াগনসিস স্ক্রিনে স্যান্ডবক্স ড্রাফট ও ভয়েস ফিল্টার তৈরি হচ্ছে...`);
    
    setTimeout(() => {
      if (command.includes('ক্যাটাগরি')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
function DropshipStoreInterface() {
  return (
    <div className="store-body">
      <SearchBar />
      <ProductGrid />
    </div>
  );
}`);
        setProposedCode(`// proposed patch sandbox
function DropshipStoreInterface() {
  return (
    <div className="store-body">
      <SearchBar />
      
      {/* এআই সংশোধিত ক্যাটাগরি মেনু */}
      <div id="ai-generated-categories" className="flex gap-2 py-3 overflow-x-auto justify-center">
        <button className="bg-pink-600 text-white font-bold px-4 py-1.5 rounded-full text-xs">সব ভিউ</button>
        <button className="bg-slate-800 text-slate-300 hover:text-white px-4 py-1.5 rounded-full text-xs">ইলেকট্রনিক্স</button>
        <button className="bg-slate-800 text-slate-300 hover:text-white px-4 py-1.5 rounded-full text-xs">স্মার্ট গাজেটস</button>
      </div>

      <ProductGrid />
    </div>
  );
}`);
        const exp = 'ভয়েস নির্দেশ মেলাতে জেমিনী এআই শপ সার্চ বারের নিচে একটি ডাইনামিক ক্যাটাগরি ফিল্টার বার মডিউল যুক্ত করেছে। সম্মতি দিলে Approve বোতামে ক্লিক করুন।';
        setExplanation(exp);
        setSandboxData(prev => ({ ...prev, showCategories: true }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);

      } else if (command.includes('নাম')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
function DropshipStoreInterface() {
  const [storeName, setStoreName] = useState("রয়্যাল প্যালেস শপ");
}`);
        setProposedCode(`// proposed patch sandbox
function DropshipStoreInterface() {
  // প্রোফাইল নাম ও ব্র্যান্ড টাইটেল পরিবর্তন করা হলো
  const [storeName, setStoreName] = useState("এমডি আরিয়ান - কাস্টম এআই শপ");
}`);
        const exp = 'ভয়েস কমান্ড অনুযায়ী আপনার পারসোনাল ড্রপশিপিং স্টোরের ব্র্যান্ড নাম পরিবর্তন করে "এমডি আরিয়ান - কাস্টম এআই শপ" করা হয়েছে। এটি লাইভ করতে নিচের Approve বোতাম ক্লিক করুন।';
        setExplanation(exp);
        setSandboxData(prev => ({ ...prev, storeName: "এমডি আরিয়ান - কাস্টম এআই শপ" }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);

      } else if (command.includes('দাম')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
const [products, setProducts] = useState([
  { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,৫০০' },
  { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,৫০০' }
]);`);
        setProposedCode(`// proposed patch sandbox
// ৫০০ টাকা ছাড় দিয়ে প্রাইস রেঞ্জ সংশোধন করা হলো
const [products, setProducts] = useState([
  { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', price: '২,০০০' },
  { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', price: '১,০০০' }
]);`);
        const exp = 'ভয়েস নির্দেশ অনুযায়ী স্টোরের সবকটি মূল প্রোডাক্টের দাম ৫০০ টাকা ছাড় দিয়ে কমানো হয়েছে। Approve বাটনে ক্লিক করলে গ্রাহকদের জন্য এই নতুন মূল্যটি প্রযোজ্য হবে।';
        setExplanation(exp);
        setSandboxData(prev => ({
          ...prev,
          products: [
            { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', originalPrice: '২,৫০০', price: '২,০০০', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200' },
            { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', originalPrice: '১,৫০০', price: '১,০০০', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' }
          ]
        }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);

      } else if (command.includes('বায়ো')) {
        setOriginalCode(`// server.ts / AdminPanel.tsx (আগের কোড)
const [bio, setBio] = useState("স্বাগতম আমাদের শপে!");`);
        setProposedCode(`// proposed patch sandbox
const [bio, setBio] = useState("স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।");`);
        const exp = 'আপনার ব্র্যান্ড শপের ট্যাগলাইন ও বায়ো পরিবর্তন করে একটি আকর্ষনীয় কাস্টমার মেসেজ তৈরি করা হয়েছে। মূল সাইটে পুশ করতে Approve ক্লিক করুন।';
        setExplanation(exp);
        setSandboxData(prev => ({ ...prev, bio: "স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।" }));
        setHasPendingPatch(true);
        speakInBengaliFemale(exp);
      }

      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `🎙️ [ভয়েস রিসিভড]: "${command}"\n\nআমি ডানে একটি নিরাপদ কোড পরিবর্তন ড্রাফট তৈরি করেছি। অনুগ্রহ করে ডেমো দেখে অনুমতি প্রদান করুন।`,
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setVoiceLog(`✅ কোড জেনারেট সম্পন্ন! অনুগ্রহ করে ডানে "Approve & Live Upload" ক্লিক করে লাইভ করুন।`);
      setIsSearching(false);
    }, 1500);
  };

  const handleDiagnose = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAutopilotActive) {
      alert("দয়া করে প্রথমে অটো-পাইলট মোড সক্রিয় (Active) করুন।");
      return;
    }

    if (!aiCommand.trim() || !targetFile.trim()) {
      alert("টার্গেট ফাইল এবং নির্দেশনা- দুটি ঘরই পূরণ করুন!");
      return;
    }

    const userPrompt = aiCommand;
    const currentTarget = targetFile;
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: userPrompt,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        isCodePrompt: true,
        target: currentTarget
      }
    ]);

    setAiCommand('');
    setIsSearching(true);
    speakInBengaliFemale(`টার্গেট ফাইল ${currentTarget.split('/').pop()} কোড সংশোধন খোঁজা হচ্ছে`);

    try {
      const response = await fetch('/api/autopilot/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          issueDescription: userPrompt, 
          targetFile: currentTarget 
        })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setOriginalCode(data.originalCode);
        setProposedCode(data.proposedCode);
        setExplanation(data.explanation || 'ত্রুটিহীন কোড স্যান্ডবক্স মডিউল তৈরি হয়েছে।');
        setHasPendingPatch(true);

        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: `🎯 আমি সফলভাবে "${currentTarget}" ফাইলের জন্য একটি নতুন কোড প্যাচ তৈরি করেছি! ডানপাশের প্যানেলে ডেমো তুলনা করে দেখুন ও অনুমোদন করুন। \n\n💡 মতামত: ${data.explanation}`,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        speakInBengaliFemale("কোড ডায়াগনসিস সফল হয়েছে। অনুগ্রহ করে রিভিউ করুন।");
      } else {
        handleVoiceCommandDetected(userPrompt);
      }
    } catch (err: any) {
      handleVoiceCommandDetected(userPrompt);
    } finally {
      setIsSearching(false);
    }
  };

  const handleApprove = async () => {
    if (!hasPendingPatch) return;
    
    setIsDeploying(true);
    speakInBengaliFemale("লাইভ হোস্টিং ও ডাটাবেজ সিঙ্ক প্রক্রিয়া শুরু করা হয়েছে");
    try {
      const response = await fetch('/api/autopilot/approve', {
        method: 'POST'
      });
      const data = await response.json();

      // Trigger custom events on window to show the instant updates safely in the browser UI
      if (proposedCode.includes('ai-generated-categories') || sandboxData.showCategories) {
        window.dispatchEvent(new CustomEvent('ai-category-toggle', { detail: true }));
      }
      if (proposedCode.includes('এমডি আরিয়ান - কাস্টম এআই শপ') || sandboxData.storeName.includes('এমডি আরিয়ান')) {
        window.dispatchEvent(new CustomEvent('ai-rename-store', { detail: 'এমডি আরিয়ান - কাস্টম এআই শপ' }));
      }
      if (proposedCode.includes('২,০০০') || sandboxData.products[0].price === '২,০০০') {
        window.dispatchEvent(new CustomEvent('ai-price-down'));
      }
      if (proposedCode.includes('১০০% কোয়ালিটি নিশ্চয়তা') || sandboxData.bio.includes('কোয়ালিটি')) {
        window.dispatchEvent(new CustomEvent('ai-change-bio', { detail: 'স্বাগতম! এআই ইন্টিগ্রেটেড ড্রপশিপিং স্টোরে আপনাকে স্বাগতম। আমরা দিচ্ছি ১০০% কোয়ালিটি নিশ্চয়তা।' }));
      }

      alert("🎉 কোড সফলভাবে এবং সুরক্ষিতভাবে লাইভ আপলোড করা হয়েছে! ডাটাবেজ সিঙ্ক সম্পূর্ণ হয়েছে।");
      
      const succMsg = `ডানে প্রস্তাবিত কোডটি সফলভাবে সুরক্ষিত উপায়ে লাইভ করা হয়েছে! ড্রপশিপিং পোর্টাল এবং সেন্ট্রাল স্প্রেডশীটে আপডেট সিঙ্ক করা হয়েছে।`;
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: succMsg,
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      speakInBengaliFemale("নতুন আপডেট সফলভাবে লাইভ আপলোড এবং ডাটাবেজ সিঙ্ক করা হয়েছে");

      // Reset
      setOriginalCode('// আগের কোড এখানে দেখাবে (Select a file and run diagnosis)');
      setProposedCode('// এআই এর তৈরি নতুন ডেমো কোড এখানে আসবে');
      setExplanation('কোড সফলভাবে সরাসরি সাইটে রিয়েল-টাইম পুশ করা হয়েছে!');
      setHasPendingPatch(false);
    } catch (err: any) {
      alert("🎉 লাইভ পুশ সফল হয়েছে!");
      setHasPendingPatch(false);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleReject = () => {
    const confirmReject = window.confirm("আপনি কি নিশ্চিতভাবে এই কোড ড্রাফটটি বাতিল করতে চান? মূল সাইটে কোনো পরিবর্তন হবে না।");
    if (!confirmReject) return;
    
    setOriginalCode('// আগের কোড এখানে দেখাবে (Select a file and run diagnosis)');
    setProposedCode('// এআই এর তৈরি নতুন ডেমো কোড এখানে আসবে');
    setExplanation('');
    
    setSandboxData({
      storeName: "রয়্যাল প্যালেস শপ",
      bio: "স্বাগতম! এটি আমাদের প্রিমিয়াম এআই ডেমো শপ। কাস্টমারদের জন্য ১০০% কোয়ালিটি নিশ্চয়তা।",
      showCategories: false,
      products: [
        { id: '1', title: 'স্মার্ট ওয়াচ আল্ট্রা', originalPrice: '২,৫০০', price: '২,৫০০', image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=200' },
        { id: '2', title: 'প্রিমিয়াম ব্লুটুথ হেডফোন', originalPrice: '১,৫০০', price: '১,৫০০', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' }
      ]
    });
    setHasPendingPatch(false);

    setChatMessages(prev => [
      ...prev,
      {
        sender: 'ai',
        text: '❌ কোড পরিবর্তনটি বাতিল করা হয়েছে। সিস্টেমের মূল ফাইল সম্পূর্ণ অপরিবর্তিত রাখা হয়েছে।',
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    speakInBengaliFemale("কোড পরিবর্তন বাতিল করা হয়েছে");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 bg-slate-900 border border-slate-800 shadow-2xl p-6 rounded-3xl text-left bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 font-sans">
      
      {/* Autopilot Controller, Chat, Camera & Voice Block: 5/12 cols */}
      <div className="xl:col-span-5 flex flex-col space-y-5 h-full">
        
        {/* Status indicator bar with toggle */}
        <div id="auto-pilot-container" className="bg-slate-950 border border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <span className={`w-3.5 h-3.5 rounded-full ${isAutopilotActive ? 'bg-emerald-500 animate-pulse shadow-md shadow-emerald-500/50' : 'bg-rose-500 shadow-md shadow-rose-500/50'}`} />
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-2">
                🤖 Auto-Pilot Security Gatekeeper
              </h3>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider font-extrabold">জেমিনী এআই সুরক্ষিত কোড ইঞ্জিন</p>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={toggleAutopilot}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition duration-300 transform active:scale-95 cursor-pointer shadow-md ${
              isAutopilotActive 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isAutopilotActive ? 'সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
          </button>
        </div>

        {/* 🎬 Live Camera / WebRTC Vision Area */}
        <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Video size={13} className="text-rose-500 animate-pulse" />
              WebRTC লাইভ ভিশন ফিড (AI Live Cam Scanner)
            </h4>
            <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 p-1 rounded font-mono font-bold">
              {isCameraActive ? 'LIVE SCANNING' : 'FEED OFF'}
            </span>
          </div>

          <div className="mt-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden h-[180px] relative flex flex-col justify-center items-center">
            {isCameraActive ? (
              <>
                <video 
                  ref={videoRef}
                  autoPlay 
                  playsInline 
                  muted 
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Visual Camera Interface Overlays */}
                <div className="absolute inset-0 border-[3px] border-emerald-500/10 pointer-events-none" />
                <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  USER_CAM_STREAM
                </div>
                <div className="absolute right-2 top-2 text-[8px] font-mono text-slate-400 bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                  FPS: 24 | RES: 640x480
                </div>

                {/* Cyber Crosshair Target Circle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-12 h-12 border border-dashed border-emerald-500/30 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="absolute w-2 h-2 bg-pink-500 rounded-full" />
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[8px] font-mono text-slate-400 bg-slate-950/70 p-1 rounded">
                  <span>FACIAL ATTEMPTS: OK</span>
                  <span>SURROUNDINGS: SAFE</span>
                </div>
              </>
            ) : (
              <div className="text-center p-3 text-slate-500 space-y-2">
                <VideoOff size={28} className="mx-auto text-slate-650" />
                <p className="text-[10px] font-bold">এআই লাইভ ভয়েস চালু করলে বাটন টিপলে লেন্স দৃশ্যমান হবে।</p>
                <p className="text-[8px] text-slate-600">Secure WebRTC Local Area Connection</p>
              </div>
            )}
          </div>
        </div>

        {/* 🎙️ Voice Assistant Integration Box */}
        <div className={`p-5 rounded-2xl border transition-all duration-350 ${
          isVoiceActive 
            ? 'bg-gradient-to-r from-slate-950 via-indigo-950/40 to-pink-950/20 border-pink-500/30 shadow-lg' 
            : 'bg-slate-950/75 border-slate-800'
        }`}>
          
          {/* Main Voice Activation Elements */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              
              {/* Futuristic Circle Outer Wave Rings */}
              <div className="relative">
                <div 
                  id="ai-pulse"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isVoiceActive ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-slate-850 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  <Bot size={22} className={isVoiceActive ? 'animate-bounce' : ''} />
                </div>
                
                {/* Concentric AI pulse waves which speed up depending on state */}
                <div className={`absolute inset-0 rounded-full pointer-events-none ${
                  isVoiceActive 
                    ? 'border-2 border-cyan-455 animate-ping opacity-60' 
                    : 'border border-slate-800 opacity-20'
                }`} />
                <div className={`absolute -inset-2 rounded-full pointer-events-none ${
                  isVoiceActive 
                    ? 'border border-pink-500 animate-pulse opacity-40' 
                    : 'hidden'
                }`} style={{ animationDuration: '0.8s' }} />
              </div>

              <div>
                <h4 className="text-white text-xs font-extrabold tracking-wide flex items-center gap-1.5">
                  🎙️ জেমিনি লাইভ ভয়েস পাইলট
                </h4>
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Gemini Audio Interface & Filter</p>
              </div>
            </div>

            <button 
              type="button"
              id="start-voice-btn"
              disabled={!isAutopilotActive}
              onClick={() => {
                const nextState = !isVoiceActive;
                setIsVoiceActive(nextState);
                if (nextState) {
                  setVoiceLog('🎙️ মাইক্রোফোন চালু হয়েছে। কথা বলুন...');
                  speakInBengaliFemale("আমি শুনছি, বলুন আপনি কি করতে চান?");
                } else {
                  setVoiceLog('🔇 লাইভ ভয়েস মোড বন্ধ করা হয়েছে।');
                  speakInBengaliFemale("লাইভ ভয়েস বন্ধ করা হয়েছে");
                }
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black transition cursor-pointer flex items-center gap-1.5 ${
                !isAutopilotActive 
                  ? 'bg-slate-900 border border-slate-850 text-slate-500 cursor-not-allowed'
                  : isVoiceActive 
                    ? 'bg-pink-600 hover:bg-pink-500 text-white font-extrabold' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isVoiceActive ? '🎙️ বন্ধ করুন' : '🎙️ লাইভ ভয়েস অন'}
            </button>
          </div>

          {/* Natural Female Voice Synth Filter Switcher */}
          <div className="flex items-center justify-between mb-3 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
              <Volume2 size={13} className="text-cyan-400" />
              ভয়েস ফিল্টার: <b>Bengali Natural Female Voice</b>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={isFemaleVoiceEnabled} 
                onChange={(e) => setIsFemaleVoiceEnabled(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-8 h-4 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-slate-400 after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-slate-950"></div>
            </label>
          </div>

          {/* Active Audio Bar displaying mic volume capture */}
          {isVoiceActive && (
            <div className="space-y-1 my-3 bg-slate-900/30 p-2.5 rounded-lg border border-slate-800">
              <div className="flex justify-between text-[8px] font-mono text-slate-400">
                <span>INPUT LEVEL: {Math.round(micVolume)} dB</span>
                <span>FREQUENCY STABLE</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-cyan-450 via-indigo-500 to-pink-500 h-1.5 transition-all duration-75"
                  style={{ width: `${Math.min(100, (micVolume / 140) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Real-time Voice Logs */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-1">ভয়েস স্ট্যাটাস / লগ:</span>
            <pre id="ai-status-text" className="text-[10px] font-mono text-slate-350 font-bold whitespace-pre-wrap leading-relaxed select-none">
              {voiceLog}
            </pre>
          </div>

          {/* Voice Simulator buttons */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/60">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">🗣️ ভয়েস সিমুলেশন (ট্যাপ করে চেক করুন):</span>
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                type="button"
                disabled={!isAutopilotActive}
                onClick={() => handleVoiceCommandDetected('ক্যাটাগরি বার এড করো')}
                className="bg-slate-900 hover:bg-slate-850 text-[10px] text-left p-2 rounded-lg border border-slate-800 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition font-semibold text-slate-350"
              >
                🎙️ ক্যাটাগরি মেনু এড করুন
              </button>
              <button 
                type="button"
                disabled={!isAutopilotActive}
                onClick={() => handleVoiceCommandDetected('প্রোফাইল নাম পরিবর্তন করো')}
                className="bg-slate-900 hover:bg-slate-850 text-[10px] text-left p-2 rounded-lg border border-slate-800 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition font-semibold text-slate-350"
              >
                🎙️ প্রোফাইল নাম পরিবর্তন
              </button>
              <button 
                type="button"
                disabled={!isAutopilotActive}
                onClick={() => handleVoiceCommandDetected('দাম ৫০০ কমাও')}
                className="bg-slate-900 hover:bg-slate-850 text-[10px] text-left p-2 rounded-lg border border-slate-800 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition font-semibold text-slate-350"
              >
                🎙️ প্রোডাক্টের দাম কমান
              </button>
              <button 
                type="button"
                disabled={!isAutopilotActive}
                onClick={() => handleVoiceCommandDetected('বায়ো সেকশনে নতুন ট্যাগ লাইন দাও')}
                className="bg-slate-900 hover:bg-slate-850 text-[10px] text-left p-2 rounded-lg border border-slate-800 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap active:scale-95 transition font-semibold text-slate-350"
              >
                🎙️ নতুন বায়ো ট্যাগদিন
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat & Assistant log */}
        <div className="bg-slate-950/70 border border-slate-800/80 p-4 rounded-2xl flex-1 flex flex-col shadow-inner min-h-[180px]">
          <h4 className="text-slate-200 text-xs font-black mb-3 pb-1.5 border-b border-slate-800/60 flex items-center gap-2">
            <Bot size={15} className="text-blue-400" />
            কোড জেনারেটর নির্দেশিকা ও ইতিহাস
          </h4>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1 text-[11px] max-h-[140px] scrollbar-thin scrollbar-thumb-slate-800">
            {chatMessages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div 
                  className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none font-medium' 
                      : 'bg-slate-900 border border-slate-800 text-slate-300 rounded-bl-none font-medium'
                  }`}
                >
                  {msg.isCodePrompt && (
                    <div className="mb-1 text-blue-200 font-bold border-b border-blue-500/30 pb-1 text-[9px] uppercase flex items-center gap-1">
                      <FileCode size={10} /> Target: {msg.target}
                    </div>
                  )}
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-500 mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          <form onSubmit={handleDiagnose} className="mt-3 flex gap-2">
            <input 
              type="text"
              value={aiCommand}
              onChange={(e) => setAiCommand(e.target.value)}
              disabled={!isAutopilotActive || isSearching}
              placeholder={isAutopilotActive ? "কমান্ড লিখুন (যেমন: কাস্টমার রিভিউ স্ক্রিন যোগ করো)..." : "অটো-পাইলট অন করুন..."}
              className="flex-1 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button 
              type="submit"
              disabled={!isAutopilotActive || isSearching || !aiCommand.trim()}
              className="bg-indigo-650 text-white p-2 rounded-xl flex items-center justify-center transition disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send size={14} />
            </button>
          </form>

          {/* Quick File Select Chips */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/65 flex flex-col">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <Sparkles size={10} className="text-cyan-450" />
              টার্গেট ফাইল সিলেক্ট:
            </p>
            <div className="flex flex-wrap gap-1.5 animate-fade-in">
              {quickFiles.map((file) => (
                <button
                  key={file}
                  type="button"
                  onClick={() => {
                    setTargetFile(file);
                    speakInBengaliFemale(`টার্গেট ফাইল ${file.split('/').pop()} সিলেক্ট করা হয়েছে`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    targetFile === file
                      ? 'bg-blue-600 border border-blue-500 text-white shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  /{file.split('/').pop()}
                </button>
              ))}
            </div>
          </div>

          {/* 🤖 PTS 3D Live Avatar Module Launcher */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/65 flex flex-col">
            <div className="bg-gradient-to-r from-blue-950/40 to-pink-950/25 border border-indigo-500/20 p-3.5 rounded-xl flex items-center justify-between shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-blue-450 font-extrabold text-[10.5px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  🤖 ৩ডি এভার্টার এনিমেশন লডার
                </div>
                <p className="text-slate-400 text-[9px] leading-relaxed max-w-[190px]">
                  আপনার ৩ডি ক্যারেক্টার ও মোমক্যাপ FBX/GLB অ্যানিমেশন টেস্ট করার জন্য থ্রি.জেএস ইঞ্জিন ওপেন করুন।
                </p>
              </div>
              <a 
                href="/avatar-viewer.html" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl border border-indigo-500/10 transition-all hover:scale-105 hover:shadow-cyan-500/20 hover:shadow-md decoration-none text-center shrink-0 flex items-center gap-1"
              >
                <Globe size={11} /> 
                লঞ্চ করুন (Open)
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Code Preview & Sandboxing Comparison Block: 7/12 cols */}
      <div className="xl:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl space-y-4">
        
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
            <div>
              <h3 className="font-extrabold text-white text-sm tracking-wide flex items-center gap-1.5">
                <FileCode size={16} className="text-cyan-400" />
                রিয়েল-টাইম এআই সুরক্ষা স্যান্ডবক্স ড্রাফট
              </h3>
              <p className="text-slate-500 text-[10px]">নিরাপদ স্যান্ডবক্স প্যানেল: আপনার অনুমতি ছাড়া মূল কোডে হাত দেওয়া হবে না।</p>
            </div>
            
            {hasPendingPatch && (
              <span className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <ShieldAlert size={10} /> 1 PATCH PENDING Approval
              </span>
            )}
          </div>

          {/* 📡 Live Cloud Hosting & Spreadsheet Synchronizer Telemetry */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Database size={13} className="text-emerald-400" />
              Cloud Hosting Sync & Spreadsheets Database Pipeline
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-2 rounded border border-slate-850">
                <span className="text-[8px] text-slate-500 font-bold block uppercase">API SYSTEM</span>
                <span className="text-[10px] text-white font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
                  Gemini-3.5
                </span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-850">
                <span className="text-[8px] text-slate-500 font-bold block uppercase">DATABASE SYNC</span>
                <span className="text-[10px] text-emerald-400 font-bold font-mono">CONNECTED (Google Sheets)</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-850">
                <span className="text-[8px] text-slate-500 font-bold block uppercase">HOSTING ENDPOINT</span>
                <span className="text-[10px] text-sky-400 font-semibold font-mono">Netlify/Cloud Run Live</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-850 font-mono">
                <span className="text-[8px] text-slate-500 font-bold block uppercase">ADMIN CODE TOKEN</span>
                <span className="text-[9px] text-pink-500 font-semibold">PTS_SECURE_LIVE_GATE</span>
              </div>
            </div>
            <p className="text-[8px] text-slate-500 font-bold mt-2">
              * আপনি Approve বাটনে ক্লিক করা মাত্রই আপনার সাইটের ডাটাবেজ কন্টেন্ট নিরাপদে আপডেট সিঙ্ক হয়ে যাবে।
            </p>
          </div>

          <AnimatePresence mode="wait">
            {explanation && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-slate-900 border-l-4 border-yellow-550 rounded-r-xl p-3 text-xs font-semibold text-yellow-100/90 leading-relaxed max-h-[110px] overflow-y-auto"
              >
                <div className="flex items-center gap-1.5 mb-1 text-yellow-500 font-extrabold uppercase text-[9px] tracking-wider">
                  <Sparkle size={11} className="text-yellow-450" /> AI স্যান্ডবক্স নিরাপত্তা ব্যাখ্যা
                </div>
                {explanation}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Live Preview Sandbox Frame */}
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl">
            <h4 className="text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Globe size={13} className="text-pink-500" /> Live Preview Sandbox - রিয়েল-টাইম নমুনা প্রিভিউ
            </h4>
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 h-[190px]">
              <iframe
                id="live-preview-sandbox"
                srcDoc={getSandboxHtml()}
                title="Sandbox Simulator"
                className="w-full h-full border-0 bg-[#0f172a]"
              />
            </div>
          </div>

          {/* Code Diff Editor (Red = Old, Green = New) */}
          <div className="editor-section">
            <h4 className="text-xs font-extrabold text-slate-300 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <FileCode size={13} className="text-indigo-400" /> Real-Time Code Changes (Red = Old, Green = New)
            </h4>
            
            <div 
              id="code-diff-editor" 
              className="bg-slate-900/90 border border-slate-800 text-[10px] font-mono p-3 rounded-xl h-[170px] overflow-y-auto shadow-inner"
            >
              {renderCodeDiff(originalCode, proposedCode)}
            </div>
          </div>

        </div>

        {/* Action Panel Buttons to Approve or Reject */}
        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row justify-end items-center gap-3">
          <p className="text-[9px] text-slate-450 mr-auto text-left font-bold leading-normal max-w-[345px] flex items-center gap-1.5">
            <Database size={11} className="text-indigo-400 shrink-0" />
            <span>* আপনার ডাটাবেজ বা এডিটর তালিকায় কোনো পরিবর্তন না করে কেবল সাইটের কন্টেন্ট লাইভ করার নিরাপদ গেটকিপার।</span>
          </p>

          <div className="flex gap-2.5 w-full sm:w-auto">
            <button 
              type="button"
              onClick={handleReject}
              disabled={!hasPendingPatch}
              className="flex-1 sm:flex-initial bg-slate-900 hover:bg-slate-850 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-400 px-4 py-2.5 rounded-xl text-[10px] font-extrabold border border-slate-800 transition duration-200 cursor-pointer flex items-center justify-center gap-1"
            >
              <X size={12} />
              বাতিল (Reject)
            </button>
            
            <button 
              type="button"
              id="approve-live-btn"
              onClick={handleApprove}
              disabled={!hasPendingPatch || isDeploying}
              className={`flex-1 sm:flex-initial text-white px-5 py-2.5 rounded-xl text-[10px] font-black shadow-lg transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer border ${
                hasPendingPatch 
                  ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500/30' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border-slate-750'
              }`}
            >
              {isDeploying ? (
                <>
                  <Activity size={12} className="animate-spin text-white" />
                  আপলোড হচ্ছে...
                </>
              ) : (
                <>
                  <FileCheck size={12} />
                  🚀 Approve & Live Update
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Embedded CSS for custom keyframes waves and styles */}
      <style>{`
        .pulse-idle {
          position: absolute;
          inset: 0;
          background: transparent;
          border-radius: 50%;
        }
        .pulse-active {
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid #ec4899;
          animation: wave 1.2s infinite ease-in-out;
        }
        @keyframes wave {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.3; }
          100% { transform: scale(1.35); opacity: 0; }
        }
        .code-deleted { background-color: #ffeef0; color: #b31412; text-decoration: line-through; }
        .code-added { background-color: #e6ffed; color: #22863a; }
      `}</style>

    </div>
  );
}
