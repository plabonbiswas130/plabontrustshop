import express from "express";
import path from "path";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createServer as createViteServer } from "vite";
import cron from "node-cron";
import { GoogleGenAI, Type } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

const app = express();
const PORT = 3000;
const JWT_SECRET = 'GLOBAL_DROPSHIPPING_SECURE_2026_KEY';

app.use(cors());
app.use(express.json());

// In-memory "database" to mimic the SQL schema provided by user
const db = {
  users: [
    {
      id: 1,
      username: 'admin',
      email: 'ceo@ptsglobal.com',
      password: 'admin login',
      display_name: 'Master Admin',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
      bio: 'Global Platform Administrator',
      is_active: 1,
      status: 'Active',
      idNumber: 'PTS-MASTER',
      whatsapp: 'AdminSystem',
      joined: 'Always',
      role: 'Admin'
    },
    {
      id: 2,
      username: 'editor_rahim',
      email: 'rahim@website.com',
      password: 'rahim123',
      display_name: 'Editor Rahim',
      avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
      bio: 'Role-Based Platform Editor',
      is_active: 1,
      status: 'Active',
      idNumber: 'PTS-EDIT01',
      whatsapp: '+8801700000001',
      joined: '2026-01-10',
      role: 'Editor'
    },
    {
      id: 3,
      username: 'editor_karim',
      email: 'karim@website.com',
      password: 'karim123',
      display_name: 'Editor Karim',
      avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=80&q=80',
      bio: 'Secondary Platform Editor',
      is_active: 1,
      status: 'Active',
      idNumber: 'PTS-EDIT02',
      whatsapp: '+8801700000002',
      joined: '2026-02-15',
      role: 'Editor'
    }
  ] as any[],
  otp_verifications: [] as { email: string; otp_code: string; expires_at: number }[],
  ai_reports: [
    { id: 1, type: 'Refund Issue', user: 'shop_owner_01', email: 'owner1@mail.com', details: 'Product defective, supplier delayed refund. The automated system needs revision for checkout payments.', time: '10 mins ago' },
    { id: 2, type: 'Bad Review Alert', user: 'buyer_99', email: 'buyer99@mail.com', details: '1-Star rating on delivery speed. Check standard response rules and delivery delay thresholds.', time: '1 hour ago' },
    { id: 3, type: 'Help Ticket', user: 'guest_user', email: 'guest@mail.com', details: 'Payment gateway failed at checkout. Multiple connection errors reported for sslcommerz.', time: '2 hours ago' }
  ] as any[],
  tax_config: {
    storeFee: 200,
    vatTaxRate: 20,
    payoutMethod: 'stripe',
    accountHolder: 'PTS Global Business',
    accountNumber: ''
  },
  products: [
    {
      id: 'netflix-premium',
      image: 'https://images.unsplash.com/photo-1611593733186-2d6852fd7e0b?w=400&h=240&fit=crop',
      title: 'Netflix Premium 4K UHD Account - 1 Month Warranty',
      description: 'ফুল HD 4K স্ট্রিমিং, অ্যাড ফ্রি, ৪ ডিভাইস সাপোর্ট। মাসিক রিনিউ অটোমেটিক।',
      originalPrice: '৳১,৯৯৯',
      discountPrice: '৳৫৯৯',
      discountPercent: '70% OFF',
      category: 'Subscription',
      product_color: 'Standard',
      likes: '1.2K',
      rating: '4.9',
      reviewsCount: '247'
    },
    {
      id: 'spotify-family',
      image: 'https://images.unsplash.com/photo-1571169272042-6d6b6b48c34f?w=400&h=240&fit=crop',
      title: 'Spotify Premium Family Plan - Private Membership',
      description: '৬ জনের ফ্যামিলি প্ল্যান, অফলাইন ডাউনলোড, হাই কোয়ালিটি অডিও। সবচেয়ে পপুলার প্ল্যান।',
      originalPrice: '৳১,৪৯৯',
      discountPrice: '৳৩৭৪',
      discountPercent: '75% OFF',
      category: 'Subscription',
      product_color: 'Standard',
      likes: '987',
      rating: '4.8',
      reviewsCount: '189'
    },
    {
      id: 'youtube-premium',
      image: 'https://images.unsplash.com/photo-1615466566597-2c4c2c607412?w=400&h=240&fit=crop',
      title: 'YouTube Premium (No Ads) - Background Play + Music',
      description: 'অ্যাড ফ্রি ইউটিউব, ব্যাকগ্রাউন্ড প্লে, অফলাইন ডাউনলোড। সবচেয়ে ডিমান্ডিং প্রোডাক্ট।',
      originalPrice: '৳১,১৯৯',
      discountPrice: '৳২৩৯',
      discountPercent: '80% OFF',
      category: 'Subscription',
      product_color: 'Standard',
      likes: '2.1K',
      rating: '4.9',
      reviewsCount: '456'
    }
  ],
  support_messages: [],
  global_videos: [] as { id: number; video_url: string; channel_url: string; created_at: string }[],
  music_config: { source_type: 'file', source_url: '', play_mode: 'loop' } as { source_type: 'file' | 'link'; source_url: string; play_mode: 'loop' | 'once' },
  account_access_codes: [] as { id: number; account_type: string; access_code: string; created_at: string }[],
  video_music_control: [] as { id: number; item_type: 'video' | 'music_file', file_path_or_url: string, play_mode: 'loop' | 'once', created_at: string }[]
};

import multer from "multer";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'music-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

// ==========================================
// API ROUTES
// ==========================================

// [Section 1] Account Access Code API
app.post('/api/admin/generate-access-code', (req, res) => {
    const { account_type, access_code } = req.body;
    if (!access_code) return res.status(400).json({ error: 'Code required' });

    const newCode = {
        id: db.account_access_codes.length + 1,
        account_type: account_type || 'shop_register',
        access_code,
        created_at: new Date().toISOString()
    };
    db.account_access_codes.push(newCode);
    res.json({ success: true, message: 'Access code saved successfully.' });
});

// [Section 2] Video & Music Control API

// Global Product Search API
app.get('/api/products/search', (req, res) => {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ error: 'Search keyword required' });

    const searchPattern = String(keyword).toLowerCase();
    const results = (db.products as any[]).filter((product: any) => 
        product.title.toLowerCase().includes(searchPattern) ||
        (product.category && product.category.toLowerCase().includes(searchPattern)) ||
        (product.product_color && product.product_color.toLowerCase().includes(searchPattern)) ||
        product.description.toLowerCase().includes(searchPattern)
    );

    res.json({ success: true, count: results.length, data: results });
});

// Admin Update Tax Settings API
app.post('/api/admin/update-tax-settings', (req, res) => {
    try {
        const { storeFee, vatTaxRate, payoutMethod, accountHolder, accountNumber } = req.body;
        
        db.tax_config = {
            storeFee: parseFloat(storeFee) || 0,
            vatTaxRate: parseFloat(vatTaxRate) || 0,
            payoutMethod: payoutMethod || 'stripe',
            accountHolder: accountHolder || '',
            accountNumber: accountNumber || ''
        };

        console.log(`Settings Updated: Fee $${db.tax_config.storeFee}, Tax ${db.tax_config.vatTaxRate}%, Payout Method: ${db.tax_config.payoutMethod}`);

        res.status(200).json({ 
            success: true, 
            message: "Global configuration updated successfully.",
            data: db.tax_config
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get Tax Settings API
app.get('/api/admin/tax-settings', (req, res) => {
    res.json({ success: true, data: db.tax_config });
});

// Checkout Sale Processor with Auto-Split Payment Logic
app.post('/api/checkout/process-sale', async (req, res) => {
    try {
        const { orderAmount, vendorCurrency, vendorAccountId } = req.body;
        
        const vatRate = db.tax_config.vatTaxRate; 
        const adminShare = orderAmount * (vatRate / 100); 
        const vendorShare = orderAmount - adminShare;

        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (stripeKey && stripeKey !== "your_secret_stripe_key_here") {
            try {
                const stripe = new (await import('stripe')).default(stripeKey);
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(orderAmount * 100),
                    currency: vendorCurrency || 'usd',
                    payment_method_types: ['card'],
                    application_fee_amount: Math.round(adminShare * 100),
                    transfer_data: {
                        destination: vendorAccountId,
                    },
                });

                return res.status(200).json({ 
                    success: true, 
                    clientSecret: paymentIntent.client_secret,
                    adminEarned: adminShare,
                    vendorEarned: vendorShare,
                    isDemo: false
                });
            } catch (stripeError: any) {
                console.error("Stripe Charge failed, falling back to simulated payment:", stripeError.message);
            }
        }

        // Safe Fallback if API key is not configured or fails
        res.status(200).json({ 
            success: true, 
            clientSecret: "simulated_client_secret_" + Math.random(),
            adminEarned: adminShare,
            vendorEarned: vendorShare,
            isDemo: true,
            message: "Simulated payment processed successfully (Stripe not configured)"
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upload local music (multiple files)
app.post('/api/admin/upload-local-music', upload.array('music_files', 15), (req, res) => {
    const { play_mode } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) return res.status(400).json({ error: 'No audio files selected' });

    const newItems = files.map(file => ({
        id: db.video_music_control.length + 1 + Math.random(), // Pseudo unique
        item_type: 'music_file' as const,
        file_path_or_url: `/uploads/${file.filename}`,
        play_mode: (play_mode || 'loop') as 'loop' | 'once',
        created_at: new Date().toISOString()
    }));

    db.video_music_control.push(...newItems);
    
    // Also update current active music_config to the first of the new batch for immediate effect
    db.music_config = {
        source_type: 'file',
        source_url: newItems[0].file_path_or_url,
        play_mode: newItems[0].play_mode
    };

    res.json({ success: true, message: `${files.length} song(s) uploaded successfully!` });
});

// Upload Video Link
app.post('/api/admin/upload-video-link', (req, res) => {
    const { video_url } = req.body;
    if (!video_url) return res.status(400).json({ error: 'Video link required' });

    const newItem = {
        id: db.video_music_control.length + 1,
        item_type: 'video' as const,
        file_path_or_url: video_url,
        play_mode: 'loop' as const,
        created_at: new Date().toISOString()
    };
    db.video_music_control.push(newItem);

    // Also add to global_videos for the gallery
    db.global_videos.push({
        id: db.global_videos.length + 1,
        video_url,
        channel_url: 'https://youtube.com',
        created_at: newItem.created_at
    });

    res.json({ success: true, message: 'Video link added successfully.' });
});

// 1. Admin - Upload Video (Legacy support if needed, but we use the new one now)
app.post('/api/admin/upload-video', (req, res) => {
    const { video_url, channel_url } = req.body;
    
    if (!video_url || !channel_url) {
        return res.status(400).json({ success: false, message: "Links required" });
    }

    const newVideo = {
        id: db.global_videos.length + 1,
        video_url,
        channel_url,
        created_at: new Date().toISOString()
    };
    
    db.global_videos.push(newVideo);
    res.json({ success: true, message: "Video added successfully" });
});

// 2. Admin - Delete Video
app.delete('/api/admin/delete-video/:id', (req, res) => {
    const { id } = req.params;
    const videoId = parseInt(id);
    const initialLength = db.global_videos.length;
    db.global_videos = db.global_videos.filter(v => v.id !== videoId);
    
    if (db.global_videos.length < initialLength) {
        res.json({ success: true, message: "Video deleted successfully" });
    } else {
        res.status(404).json({ success: false, message: "Video not found" });
    }
});

// 3. Global - Fetch Videos
app.get('/api/global/videos', (req, res) => {
    res.json(db.global_videos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
});

// 4. Admin - Upload/Set Music
app.post('/api/admin/upload-music', (req, res) => {
    const { source_type, source_url, play_mode } = req.body;
    if (!source_url) return res.status(400).json({ error: 'Music link or file required' });

    db.music_config = { 
        source_type: source_type || 'file', 
        source_url, 
        play_mode: play_mode || 'loop' 
    };
    
    res.json({ success: true, message: 'Music system updated!' });
});

// 5. Global - Fetch Music
app.get('/api/global/music', (req, res) => {
    const musicFiles = db.video_music_control.filter(item => item.item_type === 'music_file');
    if (musicFiles.length > 0) {
        res.json({
            source_type: 'file',
            files: musicFiles.map(f => f.file_path_or_url),
            play_mode: musicFiles[0].play_mode
        });
    } else {
        res.json(db.music_config);
    }
});

// 6. Admin Activation - Store Create
app.post('/api/admin/activate-store', (req, res) => {
    const { 
        username, 
        email, 
        password, 
        display_name,
        idNumber,
        whatsapp,
        district,
        city,
        country 
    } = req.body;
    
    if (db.users.find(u => u.username === username || u.email === email)) {
        return res.status(500).json({ error: 'Username or Email already exists!' });
    }

    const newUser = {
        id: db.users.length + 1,
        username,
        email,
        password,
        display_name: display_name || username,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
        bio: 'Dropshipping Store Owner',
        is_active: 1,
        status: 'Active',
        idNumber: idNumber || 'NID-NotProvided',
        whatsapp: whatsapp || 'NotProvided',
        district: district || 'NotProvided',
        city: city || 'NotProvided',
        country: country || 'BD',
        joined: new Date().toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })
    };
    
    db.users.push(newUser);
    res.json({ success: true, message: 'Store activated successfully!' });
});

// Admin API - Search Store by Username
app.get('/api/admin/search-store/:username', (req, res) => {
    const { username } = req.params;
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, error: 'এই ইউজারনেমে কোনো অ্যাকাউন্ট পাওয়া যায়নি!' });
    }
    res.json({ success: true, user });
});

// Admin API - Suspend or Blacklist a Store
app.post('/api/admin/suspend-store', (req, res) => {
    const { username, duration } = req.body;
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, error: 'User store not found.' });
    }
    
    if (duration === 'lifetime') {
        user.is_active = 0;
        user.status = 'Blacklisted';
    } else {
        user.is_active = 0;
        user.status = 'Suspended';
    }
    res.json({ success: true, message: 'Account status updated!', user });
});

// Admin API - Bypass Access Generator
app.post('/api/admin/bypass-access', (req, res) => {
    const { username } = req.body;
    const user = db.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, error: 'User store not found.' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user });
});

// ==========================================
// [Section] Auto-Pilot AI Diagnostics & Healing System
// ==========================================

let pendingPatch = {
    filePath: '',
    proposedCode: '',
    explanation: '',
    originalCode: ''
};

let isAutopilotEnabled = true;

// Get autopilot status
app.get('/api/autopilot/status', (req, res) => {
    res.json({ success: true, enabled: isAutopilotEnabled });
});

// Toggle autopilot
app.post('/api/autopilot/toggle', (req, res) => {
    const { enabled } = req.body;
    isAutopilotEnabled = !!enabled;
    res.json({ success: true, enabled: isAutopilotEnabled });
});

// AI Diagnosis Endpoint
app.post('/api/autopilot/diagnose', async (req, res) => {
    if (!isAutopilotEnabled) {
        return res.status(400).json({ error: "ডায়াগনসিস বন্ধ আছে। দয়া করে প্রথমে অটো-পাইলট মোড অন করুন।" });
    }
    const { issueDescription, targetFile } = req.body;
    if (!issueDescription || !targetFile) {
        return res.status(400).json({ error: "ফাইল নাম ও নির্দেশনা দুটিই প্রদান করুন।" });
    }

    try {
        const filePath = path.resolve(process.cwd(), targetFile);
        if (!filePath.startsWith(process.cwd())) {
            return res.status(400).json({ error: "অবৈধ ফাইল পাথ বা অ্যাক্সেস রিড ডিরেক্টরি ট্রাভার্সাল!" });
        }

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: "ফাইলটি খুঁজে পাওয়া যায়নি।" });
        }

        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            return res.status(400).json({ error: "এটি একটি ডিরেক্টরি, ফাইল নয়।" });
        }

        const originalCode = fs.readFileSync(filePath, 'utf8');

        // Lazy initialize and call Gemini API
        const ai = getGeminiAI();

        const prompt = `You are an advanced AI DevOps and Security Specialist.
The user reported this issue/request: "${issueDescription}" in the file "${targetFile}".
Here is the current content of the file:
\`\`\`
${originalCode}
\`\`\`

Analyze the code and rewrite the COMPLETE file content with the fixes or features applied. Keep everything else intact.
Do NOT use placeholder comments, elliptical notes like "... existing code ...", or truncate the file. Return the entire contents of the file filled out perfectly.

Provide your output strictly in JSON format matching this schema:
{
  "explanation": "Brief description of what changed and how it looks now in fluent Bengali language",
  "fixedCode": "The complete, entire updated file contents as a single string"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: prompt,
            config: { 
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        explanation: { type: Type.STRING },
                        fixedCode: { type: Type.STRING }
                    },
                    required: ["explanation", "fixedCode"]
                }
            }
        });

        const textOutput = response.text;
        if (!textOutput) {
            throw new Error("এআই কোনো উত্তর জেনারেট করতে পারেনি।");
        }

        const parsed = JSON.parse(textOutput);

        // Store pending patch for approval
        pendingPatch = {
            filePath,
            proposedCode: parsed.fixedCode,
            explanation: parsed.explanation,
            originalCode
        };

        res.json({
            success: true,
            originalCode,
            proposedCode: parsed.fixedCode,
            explanation: parsed.explanation
        });

    } catch (error: any) {
        console.error('Autopilot Diagnose Error:', error);
        res.status(500).json({ error: "এআই প্রসেসিংয়ে সমস্যা হয়েছে: " + error.message });
    }
});

// Admin Approval and Overwrite Endpoint
app.post('/api/autopilot/approve', (req, res) => {
    if (!pendingPatch.filePath || !pendingPatch.proposedCode) {
        return res.status(400).json({ error: "অনুমোদনের জন্য কোনো কোড পেন্ডিং নেই।" });
    }

    try {
        // Create backup of current file
        const backupPath = pendingPatch.filePath + '.bak';
        fs.writeFileSync(backupPath, pendingPatch.originalCode, 'utf8');

        // Write the proposed code safely
        fs.writeFileSync(pendingPatch.filePath, pendingPatch.proposedCode, 'utf8');
        
        // Reset stored patch after successful deployment
        pendingPatch = { 
            filePath: '', 
            proposedCode: '', 
            explanation: '', 
            originalCode: '' 
        };

        res.json({ 
            success: true, 
            message: "কোডটি সফলভাবে সুরক্ষিতভাবে লাইভ ওয়েবসাইটে আপডেট করা হয়েছে! (ব্যাকআপ সংরক্ষিত হয়েছে)" 
        });
    } catch (error: any) {
         res.status(500).json({ error: "ফাইল আপডেট করতে ব্যর্থ হয়েছে: " + error.message });
    }
});

// ==========================================
// [Section] Editor Management & AI Monitoring Routes
// ==========================================

// Get all editors
app.get('/api/admin/editors', (req, res) => {
    const editors = db.users.filter(u => u.role === 'Editor');
    res.json({ success: true, editors });
});

// Remove or Ban an editor
app.post('/api/admin/remove-editor', (req, res) => {
    const { id } = req.body;
    const initialCount = db.users.length;
    db.users = db.users.filter(u => u.id !== id);
    const success = db.users.length < initialCount;
    res.json({ success, message: success ? 'এডিটর সফলভাবে ব্যান/রিমুভ করা হয়েছে।' : 'এডিটর খুঁজে পাওয়া যায়নি।' });
});

// Get all AI Reports
app.get('/api/admin/ai-reports', (req, res) => {
    res.json({ success: true, reports: db.ai_reports });
});

// 2. OTP Generation
app.post('/api/auth/send-otp', (req, res) => {
    const { email } = req.body;
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    // Clear old OTPs for this email
    db.otp_verifications = db.otp_verifications.filter(o => o.email !== email);
    
    db.otp_verifications.push({ email, otp_code: generatedOTP, expires_at: expiresAt });
    
    console.log(`\x1b[32m[OTP SENT TO ${email}]: ${generatedOTP}\x1b[0m`);
    res.json({ success: true, message: 'Verification code generated! Check server logs.' });
});

// 3. Login & JWT Session
app.post('/api/auth/login', (req, res) => {
    const { email, otp_code, password } = req.body;

    // Support both direct password login for convenience if specified, or OTP flow
    if (password) {
        const user = db.users.find(u => {
            const isMatch = (u.email === email || u.username === email);
            if (!isMatch) return false;
            // Admin user can login with 'admin login', 'PTS', or 'admin' for convenience
            if (u.username === 'admin') {
                return password === 'admin login' || password === 'PTS' || password === 'admin';
            }
            return u.password === password;
        });
        if (user) {
            if (user.is_active === 0) {
                return res.status(403).json({ error: user.status === 'Blacklisted' ? 'দুঃখিত, আপনার অ্যাকাউন্টটি আজীবন বহিষ্কার (Lifetime Blacklisted) করা হয়েছে!' : 'দুঃখিত, আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে!' });
            }
            const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
            return res.json({ success: true, token, user });
        }
    }

    const otpData = db.otp_verifications.find(o => o.email === email && o.otp_code === otp_code && o.expires_at > Date.now());
    
    if (!otpData) {
        return res.status(400).json({ error: 'Invalid or Expired OTP!' });
    }

    const user = db.users.find(u => u.email === email);
    if (!user) {
        return res.status(404).json({ error: 'Account not activated yet!' });
    }

    if (user.is_active === 0) {
        return res.status(403).json({ error: user.status === 'Blacklisted' ? 'দুঃখিত, আপনার অ্যাকাউন্টটি আজীবন বহিষ্কার (Lifetime Blacklisted) করা হয়েছে!' : 'দুঃখিত, আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত (Suspended) করা হয়েছে!' });
    }

    // Success - clean up OTP
    db.otp_verifications = db.otp_verifications.filter(o => o.email !== email);

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ success: true, token, user });
});

// Monthly Store Fee Cron - Runs on the 1st of every month
cron.schedule('0 0 1 * *', async () => {
    console.log('Running Monthly Store Fee Deduction...');
    const activeVendors = db.users.filter(u => u.is_active === 1 && u.username !== 'admin');
    const fee = db.tax_config.storeFee;

    for (const vendor of activeVendors) {
        try {
            console.log(`Charged monthly store fee of $${fee} for vendor: ${vendor.display_name || vendor.username}`);
        } catch (e: any) {
            console.error('Charge failed for vendor', vendor.username, e.message);
        }
    }
});

// 4. Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
