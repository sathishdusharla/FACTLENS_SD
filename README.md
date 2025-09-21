# FACTLENS – AI Misinformation Radar  
_An AI-powered web application to detect, explain, and prevent the spread of misinformation in real-time._  

[![Hackathon](https://img.shields.io/badge/GenAI%20Exchange-Hackathon-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)]()
[![Powered by Google Cloud](https://img.shields.io/badge/Google%20Cloud-Powered-orange)]()
[![Team](https://img.shields.io/badge/Team-Strategic%20Designers-purple)]()

---

## 📌 Overview  
Misinformation spreads rapidly across digital platforms, shaping opinions and undermining trust. Most tools simply **flag content** without explaining *why* it’s false.  

**FACTLENS** goes further:  
- Detects suspicious claims in real time  
- Provides transparent explanations with credible evidence  
- Assigns trust scores to sources and authors  
- Engages users with gamification and a community-driven fact wall  

Built for the **GenAI Exchange Hackathon** by **Strategic Designers**, FACTLENS is more than a fact-checker — it’s a platform for **digital literacy and truth empowerment**.  

---

## 🏛️ Architecture Diagram  
Check out the full system architecture for FACTLENS here:  
[FACTLENS System Architecture](https://sathishdusharla.github.io/FACTLENS_ARCHETECTURE/) :contentReference[oaicite:0]{index=0}

This diagram shows frontend components (Dashboard, Fact Wall, Leaderboard, Auth, etc.), backend/cloud services (Cloud Functions, Firebase Auth, Firestore, BigQuery, external APIs), and how data & control flow across all parts. :contentReference[oaicite:1]{index=1}

---

## 🎥 Demo Video  
[Watch the project video here](#) *(replace `#` with your YouTube link)*  

---

## 🚀 Features  

### 🔎 AI-Powered Content Analyzer  
- Paste or import text from articles, feeds, or chats  
- NLP-based claim extraction (NER, regex, keyword spotting)  
- Verification using external APIs like Google Fact Check, Knowledge Graph, Trusted News APIs  
- Verdicts per claim: ✅ Verified | ⚠️ Needs Context | ❌ Likely False  

### 💡 Explain-Why Module  
- Transparent reasoning behind why content is flagged  
- Links to fact-check articles, data, and reports  
- Optional visuals (charts, graphs) for clarity  

### 🧭 Source Trust Scores  
- Baseline and dynamically updated credibility scores for authors/sources  
- Displayed inline alongside content  

### 📊 Personalized Dashboard  
- Shows user points, badges, rank, and weekly activity  
- Visual charts for contribution tracking  

### 🌍 Community Fact Wall  
- Authenticated user submissions of claims & evidence  
- Peer review, AI moderation, reputation scores  
- Public display with contributor attribution  

### 🏆 Leaderboard & Gamification  
- Points for quality contributions (claim submissions, verifications, etc.)  
- Badges for milestones like “Truth Seeker,” “Investigator,” etc.  
- Leaderboard to show top contributors  

### 🎨 UI/UX & Design Theme  
- Immersive underwater metaphor/theme (“Deep Dive Into Facts”)  
- Responsive design across desktop, tablet, and mobile  

---

## 🏗️ Technical Architecture  

**Frontend**  
- Responsive web app using React / Next.js  

**Backend / Cloud Infrastructure**  
- API Gateway via Google Cloud Functions  
- Firebase Authentication (Google Sign-In)  
- Firestore for user profiles, community fact-wall submissions, gamification data  
- BigQuery for source trust scores and analytics  
- Cloud Storage for media, assets, badges  

**External APIs & AI Components**  
- Gemini API for deep content analysis  
- Google Fact Check Tools API, Knowledge Graph API, and Trusted News APIs for verification  
- AI moderation for spam / low-quality content  

**Analytics & Visualisation**  
- Google Data Studio for dashboards and usage metrics  

---

## 📅 MVP Development Plan  

**Day 1**  
- Setup Google Cloud & Firebase project + enable required APIs  
- Build core claim extraction (using NLP + regex)  
- Implement backend endpoints for Fact Check API queries  
- Frontend inline highlighting with credibility badges  

**Day 2**  
- Add Explain-Why popup panels with links to fact-check sources  
- Integrate Firebase Auth for user accounts  
- Gamification: points + badges  
- Dashboard + Leaderboard basic implementation  

---

## 📈 Success Metrics  

- Claim detection precision ≥ 70% in the MVP  
- Number of badges earned & leaderboard activity  
- User feedback on clarity and utility of explanations  
- Volume & quality of verified community submissions  

---

## ⚠️ Risks & Mitigation  

| Risk | Mitigation Strategy |
|---|---|
| Misclassification of content | Use multiple verification sources + human moderation review |
| API rate limits | Caching results & batching requests |
| Loss of user trust | Full transparency with explanations + display contributor logs |
| Privacy concerns | Anonymized data collection + opt-out options |

---

## 👥 Team  

**Strategic Designers** – Participants of GenAI Exchange Hackathon  

- Design / UX  
- AI / NLP Engineering  
- Backend / Cloud Infrastructure  
- Data Integration & Analytics  

---

## 📜 License  

This project is licensed under the **MIT License**.  

---

## 🙌 Acknowledgments  

- Google Cloud, Firebase & related APIs for infrastructure  
- GenAI Exchange Hackathon for this opportunity  
- All community fact-checkers who add value  

---

> FACTLENS – A tool not just to flag misinformation, but to **explain, debunk, and empower critical thinking.**

