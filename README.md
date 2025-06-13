# AI Job Coach – Din Personliga Karriärassistent

Detta projekt är en AI-baserad webbapplikation designad för att hjälpa arbetssökande att effektivisera sin ansökningsprocess. Applikationen genererar skräddarsydda personliga brev baserat på användarens CV och en specifik jobbannons, samt erbjuder en AI-driven coach-funktion för att få råd och insikter kring ansökningsdokumenten.

Projektet är utvecklat som en del av delkurs 3, med fokus på integration av OpenAI:s Assistants API och ett användarvänligt gränssnitt.

---

## Innehållsförteckning

1.  [Projektbeskrivning](#projektbeskrivning)
2.  [Funktioner](#funktioner)
3.  [Tekniker](#tekniker)
4.  [Installation och Körning](#installation-och-körning)
    * [Förutsättningar](#förutsättningar)
    * [Backend-installation](#backend-installation)
    * [Frontend-installation](#frontend-installation)
    * [Starta applikationen](#starta-applikationen)
5.  [Användning](#användning)
6.  [Projektstruktur](#projektstruktur)
7.  [Utveckling och Reflektion](#utveckling-och-reflektion)
8.  [Framtida Förbättringar](#framtida-förbättringar)
9.  [Licens](#licens)

---

## 1. Projektbeskrivning

AI Job Coach syftar till att lösa problemet med tidskrävande och generisk jobbsökning. Genom att utnyttja kraften i OpenAI:s generativa AI kan användare snabbt få fram anpassade personliga brev och därefter interagera med en AI-coach för att finslipa sina ansökningshandlingar. Detta skapar ett interaktivt och effektivt flöde som hjälper användare att sticka ut i sin ansökan.

Applikationen tillhandahåller två huvudsakliga funktioner:
* **Generering av Personligt Brev:** Skapar ett unikt brev baserat på inskickat CV och jobbannons.
* **AI Coach:** En interaktiv chattfunktion där användaren kan ställa frågor och få råd om sitt CV, den specifika jobbannonsen och det genererade personliga brevet.

---

## 2. Funktioner

* **Uppladdning av Dokument:** Enkel uppladdning av CV (som text) och jobbannons (som text).
* **Automatiserad Brevgenerering:** Genererar ett anpassat personligt brev som matchar kvalifikationer i CV:t med krav i jobbannonsen.
* **Interaktiv AI Coach:**
    * Användare kan ställa frågor om sina uppladdade dokument och det genererade brevet.
    * AI-coachen använder OpenAI Assistants API:s "File Search" (Retrieval) för att analysera de uppladdade dokumenten dynamiskt och ge kontextuella svar.
    * Minneshantering sker automatiskt via Assistants API:s trådar (Threads), vilket möjliggör en flytande konversation.
* **Användarvänligt Gränssnitt:** En ren och responsiv chattbaserad UI byggd med React, som guidar användaren genom processen.
* **Felhantering:** Robusta felmeddelanden för att informera användaren om eventuella problem.

---

## 3. Tekniker

* **Frontend:**
    * **React:** För att bygga det interaktiva användargränssnittet.
    * **React Router DOM:** För navigering mellan sidor.
    * **Context API:** För att hantera applikationsstatus (CV-text, jobbannons-text, personligt brev-text) över komponenter.
    * **Tailwind CSS (eller liknande/din CSS-metodik):** För snabb och effektiv styling.
* **Backend:**
    * **Node.js & Express.js:** För att bygga REST API:et som hanterar kommunikation mellan frontend och OpenAI.
    * **OpenAI SDK (`openai` npm-paketet):** Huvudsakligen för att interagera med:
        * **OpenAI Assistants API:** För den interaktiva AI Coach-funktionen, inklusive "File Search" (Retrieval) för dokumentanalys och automatisk minneshantering via Threads.
        * **(Valfritt/Om tillämpligt) OpenAI Chat Completions API:** Används för den initiala brevgenereringen (om den inte flyttas till Assistants API).
    * **`dotenv`:** För att hantera miljövariabler (som OpenAI API-nyckeln).
    * **`cors`:** För att hantera Cross-Origin Resource Sharing.
    * **`fs/promises` & `path`:** För filsystemsåtgärder (hantering av temporära filer för Assistants API).
* **Övrigt:**
    * **Git & GitHub:** För versionshantering och projektleverans.

---

## 4. Installation och Körning

Följ dessa steg för att få igång applikationen lokalt.

### Förutsättningar

* [Node.js](https://nodejs.org/en/) (v18.x eller senare rekommenderas)
* [npm](https://www.npmjs.com/) (Node Package Manager)
* [OpenAI API-nyckel](https://platform.openai.com/account/api-keys)
    * Se till att din OpenAI-organisation har tillgång till Assistants API (och Retrieval/File Search-funktionaliteten).
    * Vissa modeller (som `gpt-4.1-nano` om den är i beta/preview) kan kräva särskild åtkomst.

### Backend-installation

1.  **Klona repot:**
    ```bash
    git clone [https://github.com/DittAnvändarnamn/DittRepoNamn.git](https://github.com/DittAnvändarnamn/DittRepoNamn.git)
    cd DittRepoNamn
    ```
2.  **Navigera till backend-mappen:**
    ```bash
    cd backend
    ```
3.  **Skapa en `.env`-fil:**
    Skapa en fil med namnet `.env` i `backend`-mappen och lägg till din OpenAI API-nyckel:
    ```
    OPENAI_API_KEY=ditt_openai_api_nyckel_här
    ```
4.  **Installera beroenden:**
    ```bash
    npm install
    ```

### Frontend-installation

1.  **Navigera till frontend-mappen:**
    ```bash
    cd ../frontend
    ```
2.  **Skapa en `.env`-fil:**
    Skapa en fil med namnet `.env` i `frontend`-mappen och lägg till din backend-URL:
    ```
    REACT_APP_BACKEND_URL=http://localhost:5000
    ```
3.  **Installera beroenden:**
    ```bash
    npm install
    ```

### Starta applikationen

1.  **Starta Backend-servern:**
    Öppna en terminal, navigera till `backend`-mappen och kör:
    ```bash
    npm start
    ```
    Vid första körningen kommer backend att försöka skapa en ny OpenAI Assistant om ingen befintlig ID hittas. Assistant ID sparas i `backend/assistant_id.txt`. Kontrollera konsolen för bekräftelse.
2.  **Starta Frontend-servern:**
    Öppna en *ny* terminal, navigera till `frontend`-mappen och kör:
    ```bash
    npm start
    ```
    Applikationen kommer nu att vara tillgänglig i din webbläsare, vanligtvis på `http://localhost:3000`.

---

## 5. Användning

1.  **Ladda upp Dokument:** På startsidan, klistra in eller ladda upp texten från ditt CV och jobbannonsen i de avsedda fälten.
2.  **Generera Personligt Brev:** Klicka på "Generera Brev". AI:n kommer att skapa ett utkast baserat på dina dokument.
3.  **Fråga AI Coach:** Efter att brevet har genererats, kommer en knapp för "Fråga AI Coach" att dyka upp. Klicka på den för att navigera till chattgränssnittet.
4.  **Interagera med Coachen:** Ställ frågor om ditt CV, jobbannonsen, det genererade brevet eller allmänna karriärråd. AI:n kommer att använda dokumenten som kontext för sina svar.

---

## 6. Projektstruktur
```
├── backend/
│   ├── controllers/         # Logik för API-endpoints (ai.controller.js)
│   ├── routes/              # Definition av API-rutter (aiRoutes.js)
│   ├── config/              # OpenAI API-konfiguration (openai.js)
│   ├── utils/               # Hjälpfunktioner, t.ex. assistantSetup.js
│   ├── .env                 # Miljövariabler för backend (t.ex. OpenAI API Key)
│   ├── package.json
│   └── server.js            # Express server startpunkt
│
├── frontend/
│   ├── public/              # Statiska tillgångar (index.html, bilder)
│   ├── src/
│   │   ├── components/      # Återanvändbara UI-komponenter (t.ex. TypingIndicator)
│   │   ├── context/         # React Context för global state (AppContext.jsx)
│   │   ├── pages/           # Sidkomponenter (UploadPage, GenerateLetterPage, AskAiCoachPage)
│   │   ├── utils/           # Frontend-hjälpfunktioner (api.js)
│   │   ├── assets/          # Bilder och ikoner
│   │   ├── App.js           # Huvudkomponent, routerkonfiguration
│   │   └── index.js         # Applikationens ingångspunkt
│   │   └── index.css/App.css # Globala stilar
│   ├── .env                 # Miljövariabler för frontend (t.ex. Backend URL)
│   └── package.json
│
├── .gitignore               # Filer att ignorera i Git
├── README.md                # Denna fil
└── assistant_id.txt         # (Genereras automatiskt av backend vid första körningen)
```
---

## 7. Utveckling och Reflektion

Under utvecklingen av AI Job Coach har fokus legat på att demonstrera integrationen av OpenAI:s Assistants API för att skapa en intelligent och kontextmedveten AI-coach.

**Val av Tekniker:**
* **OpenAI Assistants API:** Valdes specifikt för att uppfylla kraven i delkurs 3. Dess inbyggda minneshantering (Threads) och förmåga att integrera verktyg som "File Search" (Retrieval) var avgörande. Detta förenklade minneshanteringen av konversationen avsevärt jämfört med att manuellt hantera chatt-historik. Retrieval-verktyget är perfekt för att låta AI:n "läsa" användarens uppladdade dokument dynamiskt.
* **React & Context API:** Valdes för att skapa ett dynamiskt och reaktivt användargränssnitt, samt för att effektivt dela status (CV, jobbannons, brev) mellan olika delar av applikationen.
* **Node.js/Express.js:** Ett robust val för att hantera API-anrop och serverlogik.

**Gränssnittsdesign:**
Gränssnittet är designat för att vara intuitivt och steg-för-steg. Från uppladdning till brevgenerering och sedan till AI-coachningen, guidas användaren genom ett logiskt flöde. Chatt-interfacet för AI Coachen bidrar till en naturlig och engagerande användarupplevelse.

**Felhantering:**
Grundläggande felhantering har implementerats på både frontend och backend för att fånga upp och presentera felmeddelanden på ett användarvänligt sätt. Detta inkluderar hantering av saknade indata, API-fel från OpenAI och problem med serverkommunikation.

**Utmaningar:**
* **Initial förståelse av Assistants API:** Att skifta från det enklare Chat Completions API till det mer stateful Assistants API krävde en djupare förståelse för koncept som Assistants, Threads, Messages och Runs, samt asynkron polling för att hämta svar.
* **Filhantering med Assistants API:** Att korrekt ladda upp dokument som filer till OpenAI och associera dem med trådar för Retrieval-användning var en ny aspekt. Att hantera temporära filer på servern för detta syfte var en praktisk utmaning.
* **Minneshantering:** Även om Assistants API hanterar minnet, krävdes noggrann planering för att koppla en användarsession på frontend till en specifik tråd på backend, särskilt utan en fullfjädrad autentisering/sessionshantering. Den nuvarande lösningen med `userId` i `localStorage` är en fungerande förenkling för en PoC.

**Reflektion i relation till LangChain:**
I detta projekt har huvudfokus lagts på att direkt integrera OpenAI Assistants API för dess inbyggda state- och verktygshantering (särskilt File Search). LangChain är ett kraftfullt ramverk för att bygga avancerade LLM-applikationer och kunde absolut ha använts för att orkestrera anropen till Assistants API, eller för att hantera mer komplexa agenter eller tool-use scenarios.

* **Varför inte mer LangChain nu?** För att tydligt demonstrera kärnfunktionaliteten i Assistants API, som är ett direkt krav i uppgiften. Assistants API erbjuder redan mycket av den "agentic behavior" och minneshantering som LangChain underlättar.
* **Hur LangChain skulle kunna integrerats:**
    * **LangChain Agents:** Skulle kunna användas för att bygga mer komplexa beslutsflöden för AI-coachen, t.ex. om den ska besvara en fråga direkt, eller om den behöver hämta information från en extern källa (om fler "verktyg" skulle läggas till utöver filanalys).
    * **LangChain Chains/LCEL:** För att strukturera och koppla ihop olika steg i processen (t.ex. att en kedja först analyserar CV:t, sedan jobbannonsen, och sedan genererar brevet med specifika instruktioner).
    * **LangChain Memory:** Om vi *inte* hade använt Assistants API, skulle LangChain's Memory-moduler varit avgörande för att implementera konversationsminnet i AI Coachen.

För att uppnå VG-kriteriet kring LangChain, skulle nästa steg vara att ersätta de direkta OpenAI API-anropen med LangChain-abstraktioner som interagerar med Assistants API, eller att implementera ytterligare verktyg/agenter via LangChain.

---

## 8. Framtida Förbättringar

* **Mer robust filhantering:** Implementera en lösning som undviker att ladda upp samma dokument flera gånger per användarsession till OpenAI för att optimera kostnader och prestanda.
* **Persistens för trådar och filer:** Lagra `threadId` och `fileId`:n i en databas för att kunna återuppta konversationer och återanvända uppladdade filer över tid och sessioner.
* **Avancerad AI Coach-funktionalitet:** Lägga till fler "verktyg" till AI-coachen via Assistants API (t.ex. webbsökning, kalenderbokning, eller specifik formatgenerering).
* **Användarautentisering:** Implementera ett inloggningssystem för att koppla trådar och dokument till specifika användare.
* **Feedback-system:** Möjlighet för användare att ge feedback på genererade brev och AI-råd.
* **Redigeringsfunktion för brev:** Ett interaktivt fält där användaren direkt kan redigera det genererade brevet.
* **Support för andra dokumentformat:** Möjlighet att ladda upp .pdf, .docx istället för enbart text (kräver då parsning i backend).

---

## 9. Licens

Detta projekt är licensierat under [MIT License](https://opensource.org/licenses/MIT).
