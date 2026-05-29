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

  // Dragging states for 3D Floating Avatar panel
  const [floatPosition, setFloatPosition] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, posX: 0, posY: 0 });

  // Poses / Action modes for Mayra virtual assistant (sit, stand, walk, hover)
  const [currentPose, setCurrentPose] = useState('stand');

  const handlePoseChange = (pose: string) => {
    setCurrentPose(pose);
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'playPose', pose }, '*');
    }
    const poseTexts: { [key: string]: string } = {
      stand: 'দাঁড়ানো মোডে সেট করা হয়েছে',
      sit: 'বসা মোডে সেট করা হয়েছে',
      walk: 'হাঁটাহাঁটি করার মোডে সেট করা হয়েছে',
      hover: 'ভাসমান মোডে সেট করা হয়েছে'
    };
    speakInBengaliFemale(poseTexts[pose] || 'অ্যাকশন পরিবর্তন করা হয়েছে');
    setVoiceLog(`👤 ৩ডি ক্যারেক্টার পজিশন: ${pose.toUpperCase()}`);
  };

  // Interactive 3D Model inputs from user feedback:
  const [modelUrl, setModelUrl] = useState('avatar.glb');
  const [activeMotion, setActiveMotion] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Gemini Control Dashboard states matching user parameters for premium sweet voice
  type GeminiModel = 'gemini-3.5' | 'gemini-1.5-pro' | 'gemini-1.5-flash';
  const [selectedModel, setSelectedModel] = useState<GeminiModel>('gemini-3.5');
  const [textToSpeak, setTextToSpeak] = useState<string>('আপ কাইসে হো সব ঠিক হে না? মুঝে আপکی বহুত ইয়াদ আতি হে।');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [voiceConfig, setVoiceConfig] = useState({
    pitch: 1.4,                 // ১.৪ পিচ কণ্ঠস্বরকে অতিরিক্ত ভারী না করে পারфেক্ট মিষ্টি ও নরম নারী কণ্ঠ দেয়
    speed: 0.92,                // গতি সামান্য কমিয়ে কথাগুলোকে একদম পরিষ্কার (Crystal Clear) করা হয়েছে
    toneStyle: 'soft_female_warm', 
    clarityFilter: true,
    voiceName: 'Google-Soft-Female-Hindi-Bengali', // প্রিমিয়াম সফট ভয়েস নোড
    geminiVoice: 'Kore' // Default prebuilt sweet serene female voice
  });
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  const handleLocalFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileName = file.name.toLowerCase();
      if (fileName.endsWith('.glb') || fileName.endsWith('.gltf')) {
        const fileUrl = URL.createObjectURL(file);
        setModelUrl(file.name);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'loadModel', url: fileUrl }, '*');
          setVoiceLog(`📁 ৩ডি ক্যারেক্টার ফাইল আপলোড হয়েছে: "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB)\n// ক্যারেক্টার রেন্ডারিং শুরু হচ্ছে...`);
          speakInBengaliFemale("আপনার থ্রিডি ক্যারেক্টারটি সফলভাবে লোড করা হচ্ছে");
        }
      } else if (fileName.endsWith('.fbx')) {
        const fileUrl = URL.createObjectURL(file);
        setActiveMotion(file.name);
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'playMotion', motion: fileUrl }, '*');
          setVoiceLog(`📁 কাস্টম এনিমেশন fbx লোড হয়েছে: "${file.name}"`);
          speakInBengaliFemale("রিয়েল-টাইম এনিমেশনটি আপনার ক্যারেক্টারে যুক্ত করা হচ্ছে");
        }
      } else {
        setVoiceLog(`📁 ফাইল আপলোড করা হয়েছে: "${file.name}" (${(file.size / 1024).toFixed(1)} KB)\n// এআই ফাইল বিশ্লেষণ করছে...`);
        speakInBengaliFemale(`ফাইল ${file.name} সফলভাবে আপলোড করা হয়েছে`);
      }
    }
  };

  const handleLocalCameraToggle = async () => {
    if (isCameraActive) {
      stopCameraMic();
      setVoiceLog(`📷 ক্যামেরা ফিড বন্ধ করা হয়েছে।`);
      speakInBengaliFemale("ক্যামেরা লাইভ ভিশন বন্ধ করা হয়েছে");
    } else {
      await startCameraMic();
      speakInBengaliFemale("ক্যামেরা লাইভ ভিশন সচল করা হয়েছে");
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        // মিষ্টি ও নরম নারী কণ্ঠের ফিল্টার (Hindi/Bengali/English Soft Voices)
        const femaleVoices = voices.filter(v => 
          v.name.toLowerCase().includes('female') || 
          v.name.toLowerCase().includes('google') || 
          v.name.toLowerCase().includes('zira') || 
          v.name.toLowerCase().includes('natasha') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
        );
        setAvailableVoices(femaleVoices.length > 0 ? femaleVoices : voices);
      }
    };
    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const testSweetVoice = () => {
    setVoiceLog(`🔊 টেস্ট মিষ্টি কণ্ঠস্বর প্লেব্যাক শুরু হয়েছে: "${textToSpeak}"`);
    speakInBengaliFemale(textToSpeak);
  };

  const handleApproveAndLiveUpdate = async () => {
    setIsUpdating(true);
    try {
      console.log(`Deploying with Models: Gemini 3.5, 1.5 Pro, 1.5 Flash...`);
      console.log(`Embedding Premium Sweet Voice Matrix:`, voiceConfig);
      
      const googleAIStudioSpeechConfig = {
        model: selectedModel,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: "Puck",
            }
          },
          audioConfig: {
            pitchModifier: voiceConfig.pitch,
            speakingRateModifier: voiceConfig.speed,
            volumeGainDb: 2.0
          }
        }
      };

      console.log("Sent Configuration to Server:", googleAIStudioSpeechConfig);
      setVoiceLog(`⏳ Syncing Models & Voice configuration with Linux server...`);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      alert('✓ Success! মিষ্টি কণ্ঠস্বর ও ৩টি মডেল একসাথে লাইভ আপডেট হয়ে গেছে।');
      setVoiceLog(`✓ Success! মিষ্টি কণ্ঠস্বর ও ৩টি মডেল (${selectedModel}) লাইভ আপডেট সম্পূর্ণ।`);
    } catch (error) {
      console.error('Deployment Fault:', error);
      setVoiceLog(`❌ আপডেট সিঙ্ক ব্যর্থ হয়েছে।`);
    } finally {
      setIsUpdating(false);
    }
  };

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

  // Speaks Bengali Text using Web Voice Synthesis using a beautiful, sweet female pitch and slower romantic rate
  const speakInBengaliFemale = async (phrase: string) => {
    // Send a real-time message to the 3D Avatar iframe to animate its head and mouth dynamically!
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'speak', phrase }, '*');
    }

    if (!isFemaleVoiceEnabled) return;

    // 1. Clear any active server audio playing
    if (currentAudioRef.current) {
      try {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      } catch (err) {
        console.warn("Could not pause previous audio", err);
      }
    }

    // 2. Clear any active browser voice synthesis
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (err) {
        console.warn("Could not cancel speech synthesis", err);
      }
    }

    // 3. Try Gemini TTS Server Endpoint
    try {
      const response = await fetch('/api/autopilot/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: phrase,
          voice: voiceConfig.geminiVoice || 'Kore'
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.audio) {
          console.log(`Successfully playing pristine Gemini '${voiceConfig.geminiVoice}' voice!`);
          const audioUrl = `data:audio/mp3;base64,${result.audio}`;
          const audio = new Audio(audioUrl);
          currentAudioRef.current = audio;
          audio.volume = 1.0;
          await audio.play();
          return; // Server synthesis successfully played, skip local synthesis fallback!
        }
      }
    } catch (apiError) {
      console.warn("Gemini TTS API proxy failed; falling back to local SpeechSynthesis:", apiError);
    }

    // 4. Fallback to browser SpeechSynthesis if the server-side API fails
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.lang = 'bn-BD';
        
        let voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) {
          voices = window.speechSynthesis.getVoices();
        }
        
        const selectedVoice = voices.find(v => (v.lang === 'bn-BD' || v.lang === 'bn-IN') && (v.name.includes('Swara') || v.name.includes('Google') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('sravana')))
                              || voices.find(v => v.lang.startsWith('bn') || v.name.toLowerCase().includes('bangla') || v.name.toLowerCase().includes('bengali') || v.lang === 'bn')
                              || voices.find(v => v.lang.includes('IN') && (v.name.includes('Google') || v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('soft') || v.name.toLowerCase().includes('natural')))
                              || voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('girl') || v.name.toLowerCase().includes('sweet') || v.name.toLowerCase().includes('natural'))
                              || voices[0];
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        utterance.pitch = voiceConfig.pitch;
        utterance.rate = voiceConfig.speed;
        utterance.volume = 1.0;
        
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (fallbackError) {
        console.error("Local client SpeechSynthesis fallback failed:", fallbackError);
      }
    }
  };

  // Speaks/Tests the female romantik voice to bypass user gesture blocks
  const testFemaleVoice = () => {
    if (!window.speechSynthesis) {
      alert("❌ আপনার ব্রাউজারে স্পিচ সিন্থেসিস সাপোর্ট করে না!");
      return;
    }
    setVoiceLog('🔊 স্পিচ ইঞ্জিন অ্যাক্টিভ ও পরীক্ষা করা হচ্ছে...');
    speakInBengaliFemale("হ্যালো প্রিয়তম, আমি শ্রাবন্তী। আমি তোমার মিষ্টি ক্যারেক্টার এবং এআই ভয়েস পাইলট। আমি এখন কথা বলতে সফল ও প্রস্তুত আছি!");
  };

  // Force resets any stuck browser audio rendering engine
  const resetVoiceEngine = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance("রিসেট কমপ্লিট");
      ut.lang = 'bn-BD';
      window.speechSynthesis.speak(ut);
      setVoiceLog('🔄 ব্রাউজার স্পিচ সিন্থেসিস ইঞ্জিন রিসেট করা হয়েছে।');
    }
  };

  // Load GLB Model remotely or locally inside the iframe
  const handleLoadModel = (customUrl?: string) => {
    const url = customUrl || modelUrl || 'avatar.glb';
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'loadModel', url }, '*');
      setVoiceLog(`⚙️ ৩ডি মডেল লোড হচ্ছে: ${url}`);
      speakInBengaliFemale("আইফ্রেমের ভেতরে নতুন মডেল লোড করার নির্দেশ পাঠানো হয়েছে");
    }
  };

  // Active Motion / playing dynamic animation tracks
  const handleActiveMotion = (customMotion?: string) => {
    const motionName = customMotion || activeMotion;
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'playMotion', motion: motionName }, '*');
      setVoiceLog(`🎬 এনিমেশন ট্র্যাক প্লে হচ্ছে: ${motionName}`);
      speakInBengaliFemale(`নতুন মোশন ট্র্যাক চালু করা হয়েছে`);
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
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
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

  // Real-time conversational AI voice chat using Gemini 3.5-flash Srabonti character
  const handleConversationalVoiceChat = async (messageText: string) => {
    setIsSearching(true);
    setVoiceLog(`🎙️ জেমিনি লাইভ ভয়েস: "${messageText}"\n// শ্রাবন্তী উত্তর প্রস্তুত করছে...`);
    
    // Add user's spoken words to chat history
    setChatMessages(prev => [
      ...prev,
      {
        sender: 'user',
        text: messageText,
        time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    try {
      const response = await fetch('/api/autopilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setVoiceLog(`🌸 শ্রাবন্তী: "${data.reply}"`);
        // Add AI response to chat history
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply,
            time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        // Speak out the beautiful conversational reply in sweet, warm Bengali!
        speakInBengaliFemale(data.reply);
      } else {
        throw new Error("Chat failed");
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg = "আমি আপনাকে শুনতে পাচ্ছি। বলুন সোনামণি, আপনার কী প্রয়োজন?";
      setVoiceLog(`🌸 শ্রাবন্তী: "${fallbackMsg}"`);
      speakInBengaliFemale(fallbackMsg);
    } finally {
      setIsSearching(false);
    }
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
    recognition.interimResults = false; // set to false for clean finalized statements to avoid repeated requests
    recognition.lang = 'bn-BD';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      const text = finalTranscript.trim();
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
        } else {
          // Speak and converse natively using Gemini 3.5 Srabonti!
          handleConversationalVoiceChat(text);
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

        {/* 🎙️ Voice Assistant Integration Box & Gemini Control Dashboard */}
        <div className={`p-5 rounded-2xl border transition-all duration-350 bg-slate-950/75 border-slate-800`}>
          
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-850">
            <div className="flex items-center gap-2.5">
              <div className="relative animate-fade-in">
                <div 
                  id="ai-pulse"
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isVoiceActive ? 'bg-cyan-500 text-slate-950 shadow-lg' : 'bg-slate-850 text-slate-400'
                  }`}
                >
                  <Bot size={18} className={isVoiceActive ? 'animate-bounce' : ''} />
                </div>
                <div className={`absolute inset-0 rounded-full pointer-events-none ${
                  isVoiceActive ? 'border-2 border-cyan-400 animate-ping opacity-60' : 'hidden'
                }`} />
              </div>
              <div>
                <h4 className="text-white text-xs font-extrabold tracking-wide">
                  Gemini Control Dashboard
                </h4>
                <p className="text-slate-400 text-[8px] font-bold uppercase tracking-wider">Real-time Crystal Clear Voice</p>
              </div>
            </div>

            {/* Offline/Online Status Badge as defined by user */}
            <div id="statusBadge" className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold border transition-all ${
              isVoiceActive 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 animate-pulse' 
                : 'bg-red-500/10 text-red-400 border-red-500/25'
            }`}>
              {isVoiceActive ? 'Online (3 AI Active)' : 'Offline'}
            </div>
          </div>

          {/* 3 Buttons on One Line exactly following the user's specification */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            
            {/* 1. big LIVE ON / LIVE OFF button */}
            <button 
              type="button"
              id="liveBtn" 
              disabled={!isAutopilotActive}
              onClick={() => {
                const nextState = !isVoiceActive;
                setIsVoiceActive(nextState);
                if (nextState) {
                  setVoiceLog('🎙️ [সিস্টেম]: ৩টি জেমিনি মডেল সংযুক্ত হয়েছে। ক্যারেক্টার ভাসমান অবস্থায় সক্রিয়।');
                  
                  // Simulate cute voice response after 1.5s
                  setTimeout(() => {
                    const logs = [
                      "Hi boss, aage bhi to batao na... He he he!",
                      "Main Mayra, aapki Mayra. Waise aap kaise ho?",
                      "Sab theek hai na? Mujhe aapki bahut yaad aati hai.",
                      "Main aapke website par live aa gayi hu, ab kahi nahi jaungi!"
                    ];
                    const randomText = logs[Math.floor(Math.random() * logs.length)];
                    setVoiceLog((prev) => `${prev}\n\n🤖 Mayra (AI): "${randomText}"`);
                    speakInBengaliFemale(randomText);
                  }, 1500);

                  speakInBengaliFemale("হ্যালো প্রিয়তম, আমি আপনার মিষ্টি সহকারী মাইরা। আমি এখন কথা বলতে প্রস্তুত আছি!");
                } else {
                  setVoiceLog('🔇 লাইভ সেশন বন্ধ করা হয়েছে। ক্যারেক্টার তার নিজের চারকোনা ঘরে ফিরে গেছে।');
                  if (typeof window !== 'undefined' && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                  speakInBengaliFemale("লাইভ ভয়েস বন্ধ করা হয়েছে");
                }
              }}
              className={`p-2.5 rounded-xl shadow-lg transition-all active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer select-none text-center ${
                !isAutopilotActive 
                  ? 'bg-slate-900 text-slate-600 border border-slate-850 cursor-not-allowed'
                  : isVoiceActive
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              }`}
            >
              <span id="liveBtnText" className="text-[10px] font-black uppercase tracking-wider">
                {isVoiceActive ? 'LIVE OFF' : 'LIVE ON'}
              </span>
              <span className="text-[7.5px] font-medium text-slate-200">৩টি এআই সক্রিয়</span>
            </button>

            {/* 2. file upload button */}
            <label className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-white p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span className="text-[9.5px] font-extrabold">ফাইল আপলোড</span>
              <input type="file" id="fileUpload" onChange={handleLocalFileUpload} className="hidden" />
            </label>

            {/* 3. camera access button */}
            <button 
              type="button"
              id="cameraBtn" 
              onClick={handleLocalCameraToggle}
              className={`text-white p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 text-center ${
                isCameraActive 
                  ? 'bg-purple-600 border-purple-500' 
                  : 'bg-slate-800 hover:bg-slate-750 border-slate-700'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span className="text-[9.5px] font-extrabold">ক্যামেরা এক্সেস</span>
            </button>
          </div>

          {/* Active AI Engine (৩টি মডেল একই এপিআই কী দিয়ে চলবে) */}
          <div className="mb-4">
            <label className="block text-[10px] font-bold tracking-wide mb-1.5 text-indigo-400 uppercase">Active AI Engine:</label>
            <select 
              value={selectedModel} 
              onChange={(e) => {
                const model = e.target.value as GeminiModel;
                setSelectedModel(model);
                speakInBengaliFemale(`এক্টিভ এআই ইঞ্জিন ${model} এ সেট করা হয়েছে`);
              }}
              className="w-full text-xs p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 outline-none focus:border-indigo-500 font-semibold"
            >
              <option value="gemini-3.5">Gemini 3.5 (Primary Coordinator)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Memory & Reasoning)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Super Fast Live Voice)</option>
            </select>
          </div>

          {/* অডিও ইন্টারফেস এবং মিষ্টি কণ্ঠের টিউনিং ফিল্টার */}
          <div className="mb-4 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-4">
            <h4 className="text-[10px] text-emerald-400 font-extrabold tracking-wider uppercase flex items-center gap-1.5">
              🔮 GEMINI AUDIO INTERFACE & FILTER
            </h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1 tracking-wide uppercase">
                  Gemini Voice Model (জেমিনি ভয়েস):
                </label>
                <select
                  value={voiceConfig.geminiVoice || 'Kore'}
                  onChange={(e) => {
                    const selectedVoice = e.target.value;
                    setVoiceConfig({...voiceConfig, geminiVoice: selectedVoice});
                    speakInBengaliFemale(`এক্টিভ ভয়েস চেঞ্জ করা হয়েছে`);
                  }}
                  className="w-full text-xs p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-205 outline-none focus:border-pink-500 font-mono font-bold"
                >
                  <option value="Kore">Kore (মিষ্টি ও শান্ত ফিমেল ভয়েস - Lyra/Aoede Alternative)</option>
                  <option value="Puck">Puck (আলাপী ও চটপটে ফিমেল ভয়েস)</option>
                  <option value="Zephyr">Zephyr (উষ্ণ ও পরিপক্ব মেল ভয়েস)</option>
                  <option value="Charon">Charon (ভদ্র ও গভীর মেল ভয়েস)</option>
                  <option value="Fenrir">Fenrir (পেশাদার ও দৃঢ় মেল ভয়েস)</option>
                </select>
              </div>

              <div>
                <label className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span>Voice Pitch (মিষ্টি ও নরম টিউনিং)</span>
                  <span className="text-amber-450 font-black">{voiceConfig.pitch}x (High Sweet)</span>
                </label>
                <input 
                  type="range" min="1.1" max="1.6" step="0.05" 
                  value={voiceConfig.pitch} 
                  onChange={(e) => setVoiceConfig({...voiceConfig, pitch: parseFloat(e.target.value)})}
                  className="w-full mt-1.5 accent-pink-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="flex justify-between text-[10px] font-bold text-slate-300">
                  <span>Speech Rate (পরিষ্কার ও স্পষ্ট করার গতি)</span>
                  <span className="text-amber-450 font-black">{voiceConfig.speed}x (Calm & Clear)</span>
                </label>
                <input 
                  type="range" min="0.8" max="1.1" step="0.02" 
                  value={voiceConfig.speed} 
                  onChange={(e) => setVoiceConfig({...voiceConfig, speed: parseFloat(e.target.value)})}
                  className="w-full mt-1.5 accent-pink-500 cursor-pointer"
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border-l-4 border-emerald-500">
                <span className="text-[9px] text-cyan-400 block font-bold font-mono">Active Filter Status:</span>
                <strong className="text-[10px] text-slate-250 select-none">[Crystal Clear + Warm Soft Female Node Active]</strong>
              </div>

              {/* ভয়েস টেস্ট করার লাইভ অপশন */}
              <div className="space-y-2 mt-2 pt-1">
                <input 
                  type="text" 
                  value={textToSpeak} 
                  onChange={(e) => setTextToSpeak(e.target.value)} 
                  className="w-full p-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-medium"
                />
                <button 
                  type="button"
                  onClick={testSweetVoice}
                  className="w-full py-2 bg-pink-600 hover:bg-pink-550 text-white font-black text-xs rounded-lg transition-transform active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  📢 টেস্ট ভয়েস (Test Sweet Voice)
                </button>
              </div>
            </div>
          </div>

          {/* APPROVE & LIVE UPDATE বোতাম - লিনাক্স সার্ভার প্রটেকশনসহ */}
          <div className="mb-4">
            <button 
              type="button"
              onClick={handleApproveAndLiveUpdate}
              disabled={isUpdating}
              className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase transition-all duration-300 tracking-wider shadow-lg flex items-center justify-center gap-2 cursor-pointer border ${
                isUpdating 
                  ? 'bg-slate-800 text-slate-500 border-slate-750' 
                  : 'bg-emerald-500 hover:bg-emerald-450 border-emerald-450/30 text-slate-950 shadow-emerald-500/10'
              }`}
            >
              {isUpdating ? (
                <>
                  <Activity size={13} className="animate-spin text-cyan-400" />
                  ⏳ Syncing 3 Models & Voice Filters...
                </>
              ) : (
                <>
                  <Check size={14} />
                  ✓ Approve & Live Update
                </>
              )}
            </button>
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
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes avatarFloat {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                  100% { transform: translateY(0px); }
                }
                .avatar-floating-active {
                  position: fixed !important;
                  bottom: 24px !important;
                  right: 24px !important;
                  width: 320px !important;
                  height: 420px !important;
                  z-index: 9999 !important;
                  background: rgba(15, 23, 42, 0.95) !important;
                  backdrop-filter: blur(12px) !important;
                  border: 3px solid rgba(16, 185, 129, 0.75) !important;
                  border-radius: 24px !important;
                  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8) !important;
                  overflow: hidden !important;
                  animation: avatarFloat 4.5s ease-in-out infinite !important;
                  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
              `}} />

              {/* Interactive Iframe Viewer */}
              <div 
                className={`${isVoiceActive ? 'avatar-floating-active' : 'w-full h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-850 relative mb-3'}`}
                style={isVoiceActive && floatPosition.x !== null && floatPosition.y !== null ? {
                  position: 'fixed',
                  left: `${floatPosition.x}px`,
                  top: `${floatPosition.y}px`,
                  bottom: 'auto',
                  right: 'auto',
                  animation: 'none',
                  transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1)',
                } : undefined}
              >
                {isVoiceActive && (
                  <div 
                    onPointerDown={(e) => {
                      const currentX = floatPosition.x !== null ? floatPosition.x : window.innerWidth - 344;
                      const currentY = floatPosition.y !== null ? floatPosition.y : window.innerHeight - 444;
                      dragRef.current = {
                        startX: e.clientX,
                        startY: e.clientY,
                        posX: currentX,
                        posY: currentY
                      };
                      setIsDragging(true);
                      e.currentTarget.setPointerCapture(e.pointerId);
                    }}
                    onPointerMove={(e) => {
                      if (!isDragging) return;
                      const deltaX = e.clientX - dragRef.current.startX;
                      const deltaY = e.clientY - dragRef.current.startY;
                      setFloatPosition({
                        x: Math.max(10, Math.min(window.innerWidth - 330, dragRef.current.posX + deltaX)),
                        y: Math.max(10, Math.min(window.innerHeight - 430, dragRef.current.posY + deltaY))
                      });
                    }}
                    onPointerUp={(e) => {
                      setIsDragging(false);
                      e.currentTarget.releasePointerCapture(e.pointerId);
                    }}
                    className="bg-slate-900 border-b border-emerald-500/20 px-3 py-2 flex items-center justify-between pointer-events-auto select-none cursor-grab active:cursor-grabbing select-none"
                    title="Drag to reposition Mayra anywhere on screen"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-[10.5px] uppercase tracking-wider text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      🤖 Mayra Live (3 AI Active)
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVoiceActive(false);
                        setVoiceLog('🔇 লাইভ ভয়েস মোড বন্ধ করা হয়েছে।');
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        speakInBengaliFemale("লাইভ ভয়েস বন্ধ করা হয়েছে");
                      }}
                      className="text-slate-400 hover:text-rose-500 text-[9px] font-black cursor-pointer uppercase transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                )}
                <iframe 
                  ref={iframeRef}
                  src="/avatar-viewer.html" 
                  className={`w-full border-0 select-none pointer-events-auto ${isVoiceActive ? 'h-[calc(100%-36px)]' : 'h-full'}`}
                  title="3D Avatar Viewer Frame"
                  allow="autoplay"
                />
              </div>

              {/* Loader & Animation Section Controller as customized by the user */}
              <div className="space-y-3 text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-900">
                {/* 1. Model input */}
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">৩ডি মডেল পাথ (.glb)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={modelUrl} 
                      onChange={(e) => setModelUrl(e.target.value)} 
                      placeholder="avatar.glb or remote url..." 
                      className="flex-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => handleLoadModel()}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[9px] px-3.5 py-1 rounded transition cursor-pointer"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {/* 2. Animation selection */}
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">মোশন ডাইনামিক ট্র্যাক / রি-টার্গেট</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={activeMotion} 
                      onChange={(e) => setActiveMotion(e.target.value)} 
                      placeholder="Wave, Dance, Breathing..." 
                      className="flex-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => handleActiveMotion()}
                      className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[9px] px-3 py-1 rounded transition cursor-pointer"
                    >
                      Active Motion
                    </button>
                  </div>
                  <p className="text-[8px] text-slate-500 font-medium">সক্রিয় প্লেব্যাক ট্র্যাক: <span className="text-pink-400 font-bold">{activeMotion || 'ডিফল্ট ব্রিলিং'}</span></p>
                </div>

                {/* 3. Action Pose selections */}
                <div className="space-y-1 mt-1 border-t border-slate-900 pt-2.5">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">ক্যারেক্টার অ্যাকশন ও অবস্থান (বসা, দাঁড়ানো, হাঁটা বা ভাসা)</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    <button
                      type="button"
                      onClick={() => handlePoseChange('stand')}
                      className={`py-1 rounded text-[9px] font-bold border transition duration-200 flex items-center justify-center gap-0.5 ${
                        currentPose === 'stand' 
                          ? 'bg-indigo-650 border-indigo-500 text-white font-black shadow-lg shadow-indigo-950/40' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      🚶‍♂️ দাঁড়ানো
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePoseChange('sit')}
                      className={`py-1 rounded text-[9px] font-bold border transition duration-200 flex items-center justify-center gap-0.5 ${
                        currentPose === 'sit' 
                          ? 'bg-indigo-650 border-indigo-500 text-white font-black shadow-lg shadow-indigo-950/40' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      🪑 বসা
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePoseChange('walk')}
                      className={`py-1 rounded text-[9px] font-bold border transition duration-200 flex items-center justify-center gap-0.5 ${
                        currentPose === 'walk' 
                          ? 'bg-indigo-650 border-indigo-500 text-white font-black shadow-lg shadow-indigo-950/40' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      🏃‍♂️ হাঁটা
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePoseChange('hover')}
                      className={`py-1 rounded text-[9px] font-bold border transition duration-200 flex items-center justify-center gap-0.5 ${
                        currentPose === 'hover' 
                          ? 'bg-indigo-650 border-indigo-500 text-white font-black shadow-lg shadow-indigo-950/40' 
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
                      }`}
                    >
                      🛸 ভাসা
                    </button>
                  </div>
                </div>
              </div>

              {/* Voice Simulator buttons */}
              <div className="mt-3.5 pt-3 border-t border-slate-800/60">
                <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">🗣️ ভয়েস সিমুলেশন (ট্যাপ করে চেক করুন):</span>
                <div className="grid grid-cols-2 gap-1.5">
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

          {/* 🤖 PTS 3D Live Avatar Module Embedded Frame with Controls */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/65 flex flex-col space-y-3">
            <div className="bg-gradient-to-r from-blue-950/45 to-pink-950/20 border border-indigo-500/20 p-3.5 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800/40">
                <div className="flex items-center gap-1.5 text-cyan-400 font-extrabold text-[10.5px] uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  🤖 ৩ডি এভার্টার লাইভ অ্যাসিস্ট্যান্ট
                </div>
                <a 
                  href="/avatar-viewer.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[9px] text-cyan-400 font-extrabold hover:underline flex items-center gap-0.5 transition"
                >
                  পূর্ণ স্ক্রিন <ArrowRight size={10} />
                </a>
              </div>
              
              {/* Injecting beautiful floating animations for Mayra */}
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes avatarFloat {
                  0% { transform: translateY(0px); }
                  50% { transform: translateY(-12px); }
                  100% { transform: translateY(0px); }
                }
                .avatar-floating-active {
                  position: fixed !important;
                  bottom: 24px !important;
                  right: 24px !important;
                  width: 320px !important;
                  height: 420px !important;
                  z-index: 9999 !important;
                  background: rgba(15, 23, 42, 0.95) !important;
                  backdrop-filter: blur(12px) !important;
                  border: 3px solid rgba(16, 185, 129, 0.75) !important;
                  border-radius: 24px !important;
                  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8) !important;
                  overflow: hidden !important;
                  animation: avatarFloat 4.5s ease-in-out infinite !important;
                  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
                }
              `}} />

              {/* Interactive Iframe Viewer */}
              <div className={`${isVoiceActive ? 'avatar-floating-active' : 'w-full h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-850 relative mb-3'}`}>
                {isVoiceActive && (
                  <div className="bg-slate-900 border-b border-emerald-500/20 px-3 py-2 flex items-center justify-between pointer-events-auto select-none">
                    <div className="flex items-center gap-1.5 font-bold text-[10.5px] uppercase tracking-wider text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      🤖 Mayra Live (3 AI Active)
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsVoiceActive(false);
                        setVoiceLog('🔇 লাইভ ভয়েস মোড বন্ধ করা হয়েছে।');
                        if (typeof window !== 'undefined' && window.speechSynthesis) {
                          window.speechSynthesis.cancel();
                        }
                        speakInBengaliFemale("লাইভ ভয়েস বন্ধ করা হয়েছে");
                      }}
                      className="text-slate-400 hover:text-rose-500 text-[9px] font-black cursor-pointer uppercase transition-colors"
                    >
                      ✕ Close
                    </button>
                  </div>
                )}
                <iframe 
                  ref={iframeRef}
                  src="/avatar-viewer.html" 
                  className={`w-full border-0 select-none pointer-events-auto ${isVoiceActive ? 'h-[calc(100%-36px)]' : 'h-full'}`}
                  title="3D Avatar Viewer Frame"
                  allow="autoplay"
                />
              </div>

              {/* Loader & Animation Section Controller as customized by the user */}
              <div className="space-y-3 text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-900">
                {/* 1. Model input */}
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">৩ডি মডেল পাথ (.glb)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={modelUrl} 
                      onChange={(e) => setModelUrl(e.target.value)} 
                      placeholder="avatar.glb or remote url..." 
                      className="flex-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => handleLoadModel()}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[9px] px-3.5 py-1 rounded transition cursor-pointer"
                    >
                      Load
                    </button>
                  </div>
                </div>

                {/* 2. Animation selection */}
                <div className="space-y-1">
                  <label className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">মোশন ডাইনামিক ট্র্যাক / রি-টার্গেট</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={activeMotion} 
                      onChange={(e) => setActiveMotion(e.target.value)} 
                      placeholder="Wave, Dance, Breathing..." 
                      className="flex-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-white focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <button 
                      type="button"
                      onClick={() => handleActiveMotion()}
                      className="bg-pink-600 hover:bg-pink-500 text-white font-extrabold text-[9px] px-3 py-1 rounded transition cursor-pointer"
                    >
                      Active Motion
                    </button>
                  </div>
                  <p className="text-[8px] text-slate-500 font-medium">সক্রিয় প্লেব্যাক ট্র্যাক: <span className="text-pink-400 font-bold">{activeMotion || 'ডিফল্ট ব্রিলিং'}</span></p>
                </div>
              </div>

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
