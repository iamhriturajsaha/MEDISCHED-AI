# 🏥MediSched AI
MediSched AI is an advanced, end-to-end healthcare orchestration portal designed to bridge operational overhead thresholds seamlessly. By merging intuitive administrative control panels with real-time backend automation, MediSched AI optimizes patient workflow protocols, streamlines clinical outbound communication pipelines and integrates localized data streams effectively.

🌐 **Live Demo** → https://medisched-rwzr.onrender.com

## 🌌 Quick Glance
<p align="center">
  <img src="Images/1.png" alt="1" width="1000"/><br>
  <img src="Images/2.png" alt="2" width="1000"/><br>
  <img src="Images/3.png" alt="3" width="1000"/><br>
  <img src="Images/4.png" alt="4" width="1000"/><br>
  <img src="Images/5.png" alt="5" width="1000"/><br>
  <img src="Images/6.png" alt="6" width="1000"/><br>
  <img src="Images/7.png" alt="7" width="1000"/><br>
  <img src="Images/8.png" alt="8" width="1000"/><br>
  <img src="Images/9.png" alt="9" width="1000"/><br>
  <img src="Images/10.png" alt="10" width="1000"/><br>
  <img src="Images/11.png" alt="11" width="1000"/><br>
  <img src="Images/12.png" alt="12" width="1000"/><br>
  <img src="Images/13.png" alt="13" width="1000"/><br>
  <img src="Images/14.png" alt="14" width="1000"/><br>
</p>

## 🌟 Key Subsystems & Features
### 📊 1. Intelligent Dashboard & Telemetry
* **Real-Time Synchronization -** Powered by secure WebSockets to stream active queue updates and resource thresholds dynamically.
* **Comprehensive Metrics -** Tracks appointment statistics, success rates, utilization percentages and total active outbound calls using beautiful, responsive Recharts visualizations.

### 📞 2. Automated Calling Outpost
* **Smart Outbound Routing -** Connects administrative teams with patients instantly via the integrated Twilio API subsystem.
* **Simulation Engine -** Includes a modular fallback simulation routing parameter that allows robust development testing without burning live credits.
* **OpenAI Whisper Integration -** Prepared to transcribe outgoing/incoming call metrics and process advanced diagnostic routing efficiently.

### 📅 3. High-Fidelity Calendar & Queue Manager
* **Shift Scheduling -** Allows rapid booking, modification and conflict assessments for complex medical procedure mappings.
* **Live Backlog Persistence -** Maintains an automated retry configuration mapping against critical medication reviews, vaccine deployments and general lab referrals.

## 🛠️ The Technology Stack
| Layer | Technology Used | Purpose |
|---|---|---|
| **Frontend UI** | Next.js 16 (React 19) | Component-driven dynamic interfaces |
| **Visuals & Motion**| Framer Motion / Lucide | Premium interactive aesthetics & micro-animations |
| **Backend API** | FastAPI (Python) | High-throughput concurrent endpoint routing |
| **Database Engine** | SQLAlchemy & SQLite | Relational table mapping & structured state persistence |
| **Third-Party Nodes**| Twilio Client SDK | Automated VoIP infrastructure integration |

## 💻 Installation & Setup Guide
### Phase A - Backend Infrastructure Setup
1. Ensure you have Python 3.10 or higher installed securely.
2. Navigate into the backend environment -
   ```bash
   cd backend
   ```
3. Create a `.env` file in both the Root directory and the Backend directory -
     ```env
     OPENAI_API_KEY=your_key_here
     TWILIO_ACCOUNT_SID=your_sid_here
     TWILIO_AUTH_TOKEN=your_token_here
     TWILIO_PHONE_NUMBER=your_phone_here
     TWILIO_MODE=real
     ```
4. Install the Python dependencies -
   ```bash
   pip install -r requirements.txt
   ```
5. Spin up the internal routing node:
   ```bash
   python main.py
   ```

### Phase B - Frontend Deployment
1. Open an isolated command line mapped to the root workspace directory.
2. Install the Next architecture configurations safely -
   ```bash
   npm install
   ```
3. Run the local clinical instance:
   ```bash
   npm run dev
   ```

### Phase C - Deployment on Render
**1. Setup Postgres Database (Optional but Recommended)**
- On the Render Dashboard, create a New PostgreSQL database.
- Name it (e.g., `medisched-db`), choose your region and select the Free tier.
- Once created, copy the Internal Database URL from the Connections section.

**2. Deploy Backend (FastAPI)**
- Create a New Web Service and connect your GitHub repository.
- Name it `medisched-backend`.
- **CRITICAL -** Set the Root Directory to `Backend`.
- Add Environment Variables -
  - `OPENAI_API_KEY`
  - `TWILIO_ACCOUNT_SID`
  - `TWILIO_AUTH_TOKEN`
  - `TWILIO_PHONE_NUMBER`
  - `TWILIO_MODE`
  - `DATABASE_URL` - Set this to your Internal Database URL.
- Deploy and copy the resulting backend URL.

**3. Deploy Frontend**
- Create another New Web Service connected to the same repository.
- Name it `medisched`.
- Leave the Root Directory entirely blank.
- Set Environment to `Docker`.
- Add Environment Variable -
  - `NEXT_PUBLIC_API_URL` - Set this to your copied backend URL.
- Deploy.

## 🧠 Architectural Challenges Overcome
* **Asynchronous WebSocket Pipelines -** Guaranteeing minimal UI redraw flickering while processing large relational data calculations efficiently across the active SQLAlchemy bindings.
* **Fallback Simulation Paradigms -** Structuring clean interceptor nodes that cleanly split live production protocols from simulated development scripts gracefully.

## 🗺️ Future Roadmap Milestones
- **Multi-Channel Alerts -** SMS & WhatsApp automated diagnostic delivery thresholds.
- **Predictive Models -** Machine Learning algorithms capable of forecasting patient no-show risk factors securely.
