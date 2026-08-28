import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Enable CORS for all incoming requests (crucial for PWABuilder manifest validators)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Explicit routes for PWA Manifest & Service Worker with strict MIME types & CORS
app.get(["/manifest.json", "/manifest.webmanifest"], (_req, res) => {
  res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
});

app.get("/sw.js", (_req, res) => {
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Service-Worker-Allowed", "/");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(process.cwd(), "public", "sw.js"));
});

app.get("/offline.html", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(path.join(process.cwd(), "public", "offline.html"));
});

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Highly available models with resilient fallback
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-2.5-flash",
  "gemini-3.7-flash",
  "gemini-2.5-flash-lite",
];

async function generateWithFallback(
  ai: GoogleGenAI,
  requestConfig: {
    contents: any;
    config: any;
  }
): Promise<string> {
  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const res = await ai.models.generateContent({
        model: modelName,
        contents: requestConfig.contents,
        config: requestConfig.config,
      });
      if (res.text) {
        return res.text;
      }
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini Model Notice] ${modelName} unavailable (${err?.status || err?.code || 'error'}), trying alternative...`);
      // Brief pause before trying the next model in the pool
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  throw lastError || new Error("All Gemini models unavailable");
}

// Deterministic Clinical Triage Fallback for Pet Rabbit Health in Bangladesh
function getClinicalTriageFallback(params: {
  rabbitName?: string;
  symptoms: string;
  duration?: string;
  poopStatus?: string;
  appetite?: string;
  language: string;
}) {
  const { rabbitName = "খরগোশ", symptoms = "", duration = "", poopStatus = "", appetite = "", language = "bn" } = params;
  const lowerText = `${symptoms} ${poopStatus} ${appetite} ${duration}`.toLowerCase();

  // High emergency indicators
  const isEmergency =
    lowerText.includes("no poop") ||
    lowerText.includes("পায়খানা বন্ধ") ||
    lowerText.includes("খাচ্ছে না") ||
    lowerText.includes("not eating") ||
    lowerText.includes("bloat") ||
    lowerText.includes("পেট শক্ত") ||
    lowerText.includes("hunched") ||
    lowerText.includes("কুঁজো") ||
    lowerText.includes("teeth grinding") ||
    lowerText.includes("দাঁত কিড়মিড়") ||
    lowerText.includes("cold ear") ||
    lowerText.includes("কান ঠান্ডা") ||
    lowerText.includes("diarrhea") ||
    lowerText.includes("পাতলা পায়খানা") ||
    lowerText.includes("stasis") ||
    lowerText.includes("১০ ঘন্টা") ||
    lowerText.includes("12 hours") ||
    lowerText.includes("8 hours");

  const isUrgent =
    !isEmergency &&
    (lowerText.includes("small poop") ||
      lowerText.includes("ছোট পায়খানা") ||
      lowerText.includes("eye") ||
      lowerText.includes("চোখ") ||
      lowerText.includes("mite") ||
      lowerText.includes("উঁকুন") ||
      lowerText.includes("খোসপাঁচড়া") ||
      lowerText.includes("sneezing") ||
      lowerText.includes("হাঁচি") ||
      lowerText.includes("snuffle"));

  if (language === "bn") {
    if (isEmergency) {
      return {
        urgency: "EMERGENCY",
        urgencyTitle: "তাত্ক্ষণিক ভেটেরিনারি জরুরি অবস্থা (সম্ভাব্য GI Stasis / পেটে গ্যাস)",
        possibleCauses: [
          "গ্যাস্ট্রোইনটেস্টাইনাল স্ট্যাসিস (GI Stasis - অন্ত্রের চলাচল বন্ধ হওয়া)",
          "পেটে অতিরিক্ত গ্যাস বা ব্লট (Bloat)",
          "দাঁতের অতিরিক্ত বৃদ্ধি (Dental Spurs) যার কারণে তীব্র ব্যথা",
          "তীব্র পানিশূন্যতা বা গরমের কারণে হিট স্ট্রোক",
        ],
        immediateActions: [
          "বিলম্ব না করে নিকটস্থ অভিজ্ঞ ভেটেরিনারি সার্জনের শরণাপন্ন হোন।",
          "খরগোশের কান স্পর্শ করে দেখুন—যদি ঠান্ডা হয়, তোয়ালে বা কুসুম গরম পানির বোতল দিয়ে শরীর উষ্ণ রাখুন।",
          "যদি খরগোশ নিজে না খায় এবং পেট শক্ত না থাকে, তবে অবিলম্বে ক্রাইটিক্যাল কেয়ার বা সিরিঞ্জে কুসুম গরম পানিতে মেশানো ঘাসের পেস্ট খাওয়ানো লাগতে পারে (ভেটের পরামর্শ অনুযায়ী)।",
          "পেটে মৃদু ক্লকওয়াইজ আলতো ম্যাসাজ দিন যদি পেট পাথরের মতো শক্ত না থাকে।",
        ],
        whatToAvoid: [
          "কখনই খরগোশকে কোনো ব্যথানাশক বা মানুষের ওষুধ ভেটের পরামর্শ ছাড়া খাওয়াবেন না।",
          "পেট যদি ড্রামের মতো শক্ত ও ফোলা থাকে (Bloat), তবে জোর করে খাবার (Force feed) খাওয়াবেন না।",
          "কানের ওপর ধরে খরগোশকে কখনই তুলবেন না।",
        ],
        stasisRiskAssessment:
          "খরগোশের পৌষ্টিকতন্ত্র পেটের ব্যাকটেরিয়া ও ক্রমাগত আঁশের ওপর নির্ভরশীল। ৮-১২ ঘণ্টার বেশি পায়খানা ও খাবার বন্ধ থাকা প্রাণঘাতী হতে পারে।",
        bangladeshSpecificAdvice:
          "বাংলাদেশের আবহাওয়ায় আর্দ্রতা ও অতিরিক্ত গরমে খরগোশের পানিশূন্যতা খুব দ্রুত হয়। ঢাকার সেন্ট্রাল ভেটেরিনারি হাসপাতাল বা আপনার জেলার অভিজ্ঞ প্রাণী চিকিৎসকের সাথে ফোনে যোগাযোগ করুন।",
        recommendedVetQuestions: [
          "খরগোশটির কি গাট মটিলিটি ওষুধ (Metoclopramide/Cisapride) এবং ব্যথানাশক (Meloxicam) প্রয়োজন?",
          "সাবকিউটেনিয়াস স্যালাইন দেওয়ার প্রয়োজন আছে কি?",
        ],
        summary: `${rabbitName}-এর জন্য এটি একটি সর্বোচ্চ জরুরি অবস্থা। অবিলম্বে ভেটেরিনারি ডাক্তারের পরামর্শ নিন।`,
      };
    } else if (isUrgent) {
      return {
        urgency: "URGENT",
        urgencyTitle: "আজকের মধ্যেই ডাক্তারের পরামর্শ ও যত্ন প্রয়োজন",
        possibleCauses: [
          "প্রাথমিক গাট স্লো-ডাউন (Mild Motility Drop)",
          "হাঁচি বা শ্বাসনালীর সংক্রমণ (Pasteurella/Snuffles)",
          "দাঁতের সমস্যা বা কানের মাইট ইনফেকশন",
        ],
        immediateActions: [
          "প্রচুর তাজা সবুজ দুর্বা ঘাস / বারমুডা ঘাস বা ওট হে খেতে দিন।",
          "খাবার পানির পাত্র পরিষ্কার রাখুন এবং প্রতিদিনের ড্রপিং সাইজ পর্যবেক্ষণ করুন।",
          "আজকের মধ্যে ভেট অ্যাপয়েন্টমেন্ট শিডিউল করুন।",
        ],
        whatToAvoid: ["মিষ্টি ফল, অতিরিক্ত শস্য বা কমার্শিয়াল কালারফুল প্যাকেট ফিড বন্ধ রাখুন।"],
        stasisRiskAssessment: "হজমে প্রাথমিক ধীরগতি লক্ষ্য করা গেছে, দ্রুত সুষম আঁশ দিলে স্ট্যাসিস প্রতিরোধ সম্ভব।",
        bangladeshSpecificAdvice: "বাংলাদেশে পাওয়া পরিষ্কার দুর্বা ঘাস ভালো করে ধুয়ে শুকিয়ে খেতে দিন। ভেজা ঘাস খাওয়াবেন না।",
        recommendedVetQuestions: ["দাঁত ও মোলার স্পার পরীক্ষা করা হয়েছে কি?", "কোনো অ্যান্টিবায়োটিক ড্রপ প্রয়োজন কি?"],
        summary: `${rabbitName}-এর উপসর্গগুলো নজরদারিতে রাখুন এবং দ্রুত ভেটের পরামর্শ নিশ্চিত করুন।`,
      };
    } else {
      return {
        urgency: "MONITOR",
        urgencyTitle: "নিয়মিত পর্যবেক্ষণ ও সাধারণ পুষ্টি যত্ন",
        possibleCauses: ["সামান্য মানসিক চাপ বা পরিবেশ পরিবর্তন", "খাবারের ধরনে হঠাৎ পরিবর্তন"],
        immediateActions: [
          "৮০% এর বেশি তাজা সবুজ ঘাস নিশ্চিত করুন।",
          "পর্যাপ্ত পরিষ্কার পানি এবং ঠান্ডা ছায়াযুক্ত পরিবেশ দিন।",
          "পরবর্তী ৬ ঘণ্টা পায়খানার পরিমাণ ও আচরণ পর্যবেক্ষণ করুন।",
        ],
        whatToAvoid: ["হঠাৎ খাবার পরিবর্তন করবেন না।"],
        stasisRiskAssessment: "বর্তমানে স্বাভাবিক নজরদারির আওতায় রয়েছে।",
        bangladeshSpecificAdvice: "গরমের দিনে খরগোশের ঘরে ফ্যান বা ঠান্ডা বরফের বোতল তোয়ালে জড়িয়ে রাখুন।",
        recommendedVetQuestions: ["রুটিন স্বাস্থ্য ও ওজন পরীক্ষা কবে করানো উচিত?"],
        summary: `${rabbitName}-কে ভালো ঘাস ও পানি দিয়ে শান্ত পরিবেশে পর্যবেক্ষণ করুন।`,
      };
    }
  } else {
    // English fallback
    if (isEmergency) {
      return {
        urgency: "EMERGENCY",
        urgencyTitle: "Immediate Veterinary Emergency (Potential GI Stasis / Severe Disturbance)",
        possibleCauses: [
          "Gastrointestinal Stasis (GI Stasis - Cessation of digestive motility)",
          "Severe cecal gas / Bloat",
          "Acute pain from dental spurs or internal distress",
        ],
        immediateActions: [
          "Contact an emergency avian/exotic or small animal veterinarian immediately.",
          "Check ear temperature; if cold, gently warm with a soft towel or warm water bottle.",
          "Keep in a quiet, low-stress, dim environment.",
        ],
        whatToAvoid: [
          "Never give human painkillers or unprescribed antibiotics.",
          "Do not force-feed if the abdomen is hard and drum-like (bloat risk).",
        ],
        stasisRiskAssessment: "Lack of gut motility for >8 hours is a critical clinical emergency in rabbits.",
        bangladeshSpecificAdvice: "Reach out to small animal vets in Dhaka or your nearest veterinary hospital immediately.",
        recommendedVetQuestions: [
          "Does my rabbit need gut motility agents (e.g. Metoclopramide) and analgesia?",
          "Is sub-Q fluid therapy indicated?",
        ],
        summary: `Immediate medical attention is required for ${rabbitName}. Please consult a veterinarian without delay.`,
      };
    } else {
      return {
        urgency: "URGENT",
        urgencyTitle: "Urgent Veterinary Assessment Recommended",
        possibleCauses: ["Early digestive slowdown", "Dental spurs", "Respiratory irritation"],
        immediateActions: [
          "Provide fresh Timothy/Bermuda/Oat hay and fresh clean water.",
          "Monitor fecal pellet output and posture hourly.",
          "Consult a veterinarian today.",
        ],
        whatToAvoid: ["Avoid sugary treats and high-starch pellets."],
        stasisRiskAssessment: "Early intervention prevents full GI shut down.",
        bangladeshSpecificAdvice: "Keep in a cool, ventilated area away from direct heat and humid drafts.",
        recommendedVetQuestions: ["Can you examine molars and check for gut sounds?"],
        summary: `Monitor ${rabbitName} closely and arrange a veterinary checkup today.`,
      };
    }
  }
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Rabbit Welfare Society of Bangladesh - Health Tracker" });
});

// AI Rabbit Health Triage & Symptom Assessment
app.post("/api/gemini/triage", async (req, res) => {
  const { rabbitName, age, breed, weight, symptoms, duration, poopStatus, appetite, language } = req.body;

  try {
    const ai = getGeminiClient();

    const systemPrompt = `You are an expert Rabbit Veterinary Triage & Health Specialist for the "Rabbit Welfare Society of Bangladesh" (খরগোশ কল্যাণ সমিতি বাংলাদেশ).
Your duty is to provide scientifically accurate, compassionate, and life-saving guidance for pet rabbits in Bangladesh.
Rabbits are prey animals whose digestive systems (hindgut fermenters) can deteriorate in hours under GI Stasis (Gastrointestinal Stasis).

Key guidelines:
1. Determine Urgency Level: "EMERGENCY" (জরুরি - immediate vet needed within hours), "URGENT" (জরুরি পর্যবেক্ষণ - vet visit today), or "MONITOR" (নজরদারি - mild/observation with home care).
2. If the rabbit has NOT eaten or pooped for >10-12 hours, hunched in pain, grinding teeth loudly, or cold ears, mark it immediately as EMERGENCY (Potential GI Stasis / Bloat / Severe illness).
3. Tailor the advice to Bangladesh conditions (e.g. humid hot climate prevention, Dubba/Bermuda/Oat grass, avoiding local toxic feed, consulting small animal vets in Dhaka/Bangladesh).
4. Provide structured JSON response.

Please answer in ${language === "bn" ? "Bengali (বাংলা) language with English medical terms in brackets if necessary" : "English (with key Bangla terms where helpful)"}.`;

    const userPrompt = `Rabbit Profile:
- Name: ${rabbitName || "Unnamed"}
- Breed: ${breed || "Domestic"}
- Age: ${age || "Adult"}
- Weight: ${weight ? weight + " kg" : "Not specified"}
- Symptoms reported: ${symptoms}
- Duration of symptoms: ${duration || "Unknown"}
- Poop condition: ${poopStatus || "Not specified"}
- Appetite / Water intake: ${appetite || "Not specified"}

Provide a comprehensive triage assessment in valid JSON with this exact schema:
{
  "urgency": "EMERGENCY" | "URGENT" | "MONITOR",
  "urgencyTitle": "Short title describing urgency",
  "possibleCauses": ["cause 1", "cause 2"],
  "immediateActions": ["Action 1", "Action 2", "Action 3"],
  "whatToAvoid": ["Warning 1", "Warning 2"],
  "stasisRiskAssessment": "Detailed analysis of GI stasis and digestive health risk",
  "bangladeshSpecificAdvice": "Advice considering Bangladesh climate/diet/vets",
  "recommendedVetQuestions": ["Question to ask the vet 1", "Question to ask the vet 2"],
  "summary": "Compassionate concluding summary"
}`;

    const responseText = await generateWithFallback(ai, {
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    try {
      const parsedData = JSON.parse(responseText);
      res.json({ success: true, data: parsedData });
    } catch {
      res.json({ success: true, data: { rawText: responseText } });
    }
  } catch (error: any) {
    console.warn("Gemini triage remote call failed, using clinical triage fallback:", error?.message || error);
    // Return high-quality deterministic clinical fallback so the pet owner gets emergency help instantly
    const fallbackData = getClinicalTriageFallback({
      rabbitName,
      symptoms: symptoms || "",
      duration,
      poopStatus,
      appetite,
      language: language || "bn",
    });
    res.json({
      success: true,
      data: fallbackData,
      isFallback: true,
      note: "Generated using RWSB Clinical Triage Guidelines",
    });
  }
});

// AI Rabbit Care & Nutrition Assistant Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { message, rabbitContext, history, language } = req.body;

  try {
    const ai = getGeminiClient();

    const systemPrompt = `You are "BunnyCare AI" (খরগোশ বন্ধু), an intelligent veterinary care guide by the Rabbit Welfare Society of Bangladesh (খরগোশ কল্যাণ সমিতি বাংলাদেশ).
You guide rabbit owners in Bangladesh with practical, veterinary-approved advice on:
- Rabbit nutrition (80%+ hay/grass, proper leafy greens available in BD like coriander/mint/romaine, limited pellets, fresh water)
- Health indicators (poop size/consistency, urine calcium sludge, dental spurs, ear mites, snuffles)
- Weather adaptation in Bangladesh (heat stroke prevention in 35C+ summer, avoiding drafts in winter)
- Litter box training, bunny-proofing, bonded pairs, gentle handling (never pick up by ears or scruff!).
- If an issue seems critical (no eating for >8 hours, liquid diarrhea, bloated hard belly), always urge them to visit an avian/exotic or small animal veterinarian in Bangladesh immediately.

Respond in ${language === "bn" ? "warm, polite, easy-to-understand Bengali (বাংলা)" : "warm, clear English"}. Keep answers structured with bullet points and clear steps.`;

    const chatHistory = Array.isArray(history)
      ? history.map((item: any) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }],
        }))
      : [];

    const rabbitInfo = rabbitContext
      ? `[Current Rabbit Context: Name: ${rabbitContext.name}, Age: ${rabbitContext.age}, Breed: ${rabbitContext.breed}, Weight: ${rabbitContext.weight}kg]\n\n`
      : "";

    const fullPrompt = `${rabbitInfo}User Question: ${message}`;

    const replyText = await generateWithFallback(ai, {
      contents: [...chatHistory, { role: "user", parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    res.json({ success: true, reply: replyText });
  } catch (error: any) {
    console.warn("Gemini chat remote error, providing helpful fallback:", error?.message || error);
    const fallbackReply =
      language === "bn"
        ? `খরগোশের প্রধান খাদ্য ৮০% তাজা ঘাস (যেমন দূর্বা ঘাস বা টিমোথি হে) এবং পর্যাপ্ত পরিষ্কার পানি। খরগোশ যদি ৮-১০ ঘণ্টার বেশি খাওয়া বা পায়খানা বন্ধ রাখে, তবে এটি সম্ভাব্য জিআই স্ট্যাসিস (GI Stasis) এবং জরুরি ভেটেরিনারি চিকিৎসা আবশ্যক।\n\nজরুরি প্রয়োজনে র‌্যাবিট ওয়েলফেয়ার হেল্পলাইনে যোগাযোগ করুন বা আমাদের ভেট ডিরেক্টরি দেখুন।`
        : `A rabbit's diet must consist of 80%+ grass/hay, fresh water, and measured leafy greens. If a rabbit stops eating or pooping for >8 hours, it is a medical emergency (GI Stasis). Please consult our BD Vet Directory or helpline for immediate assistance.`;

    res.json({ success: true, reply: fallbackReply });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Rabbit Welfare BD Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
