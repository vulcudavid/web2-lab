# Registrul de Decizii de Arhitectură (ADR)

## ADR-001: Alegerea stivei tehnologice pentru Portalul de Practică (P14)

- **Data**: 2026-11-06
- **Status**: approved
- **Autor**: Agent AI & David Vulcu

### 1. Context și Cerințe
Proiectul **P14 (Portal de practică: matching studenți-firme)** reprezintă o platformă universitară complexă ce necesită:
- Gestionarea a 4 roluri de utilizatori: Studenți, Tutori Firmă, Coordonatori Practică (Facultate), Administratori.
- Algoritm avansat de alocare stabilă bazat pe **Gale-Shapley** (respectare capacități, liste ordonate de preferințe bilaterale) și suport pentru **realocare minimală** la excepții umane (refuz student, retragere ofertă).
- Programare sloturi interviuri și notificări.
- Generare și gestiune convenții de practică în format PDF (date precompletate, flux de semnare/upload scan).
- Jurnal de pontaj săptămânal (ore lucrate, validare tutore) și fișă de evaluare finală.
- Dashboard-uri administrative cu statistici în timp real și exporturi.

### 2. Opțiuni Luate în Considerare

1. **Next.js (App Router, TypeScript) + PostgreSQL + Prisma ORM + Tailwind CSS**
   - *Avantaje*:
     - **Full-stack TypeScript**: Type-safety end-to-end între baza de date (Prisma), logica de backend (Server Actions / Route Handlers) și interfața utilizator (React Server Components).
     - **Arhitectură unificată**: Un singur repo și proces de build, eliminând discrepanțele dintre frontend și API separat.
     - **Execuție server-side sigură**: Algoritmul de matching Gale-Shapley și generarea PDF rulează nativ pe server în TypeScript, beneficiind de tranzacții ACID cu PostgreSQL.
     - **UI rapid și modern**: Tailwind CSS cu suport modular pentru componente accesibile și responsive.
   - *Dezavantaje*: Curba de învățare pentru React Server Components (gestionată facil prin structurarea clară a componentelor).

2. **Node.js / Express (REST API) + React (Vite SPA) + PostgreSQL + Prisma ORM**
   - *Avantaje*: Separare clasică client-server.
   - *Dezavantaje*: Overhead suplimentar de mentenanță (două proiecte separate, configurare CORS, dublarea tipurilor de date între client și server, deployment mai complex).

3. **Python (FastAPI / Django) + PostgreSQL + React SPA**
   - *Avantaje*: Librării matematice avansate.
   - *Dezavantaje*: Fragmentarea limbajelor în echipă (Python pe backend, TypeScript pe frontend), complexitate adițională de integrare.

### 3. Decizia Adoptată

Am decis adoptarea stivei:
- **Framework Full-stack**: **Next.js 15 (App Router)** cu **TypeScript**
- **Bază de date**: **PostgreSQL 16** (containerizată prin **Docker Compose**)
- **ORM & Migrations**: **Prisma ORM**
- **Styling UI**: **Tailwind CSS** cu iconuri **Lucide React**
- **Containerizare dev**: **Docker & Docker Compose**

### 4. Consecințe și Beneficii
- **Integritate relațională**: PostgreSQL + Prisma garantează chei externe, constrângeri unice și tranzacții atomice la matching și generare de convenții.
- **Productivitate ridicată**: Generarea automată a clientului Prisma `@prisma/client` oferă autocompletion și verificări la compilare pentru toate cele 10+ tabele relaționate.
- **Start rapid**: Dezvoltatorul poate porni întreaga infrastructură cu o singură comandă `docker compose up -d` urmată de `npm run dev`.
- **Evolutivitate**: Next.js App Router permite extinderea facilă cu API-uri REST/JSON pentru eventuale integrări mobile sau externe (secretariate, sisteme universitare).


## ADR-002: Arhitectura „Professional Matching / Social Platform”, Scor de Compatibilitate și Politică de Confidențialitate CV

- **Data**: 2026-11-06
- **Status**: approved
- **Autor**: Agent AI & David Vulcu

### 1. Context și Cerințe Extinse
Pentru proiectul P14, interacțiunea dintre studenți și companii este concepută ca o platformă profesională de matching:
- **Profil student**: Secțiune bio detaliată, linkuri profesionale (GitHub, LinkedIn, portofoliu) și competențe exprimate prin tag-uri predefinite structurate pe domeniile Facultății de Inginerie (Calculatoare & Tehnologia Informației, Electronică & Telecomunicații, Mecatronică & Robotică, Inginerie Industrială / Management), plus posibilitatea adăugării de tag-uri personalizate (custom tags).
- **Poziții de practică (firme)**: Publicate cu seturi de tag-uri obligatorii și opționale, descriere proiect și tutore desemnat.
- **Motor de recomandare**: Calcularea unui scor de compatibilitate $S \in [0, 100]\%$ bazat pe gradul de suprapunere ponderată a competențelor și domeniilor.
- **Matching final**: Algoritmul Gale-Shapley (varianta Many-to-One / Hospital-Residents) aplicat pe baza preferințelor reale exprimate/validate de ambele părți (clasamente informate de scorul de recomandare).
- **Politica de confidențialitate (Privacy Gate)**: Datele de contact și fișierul CV detaliat sunt accesibile firmei **doar dacă studentul a aplicat explicit** la oferta respectivă. Până la aplicare, firma poate vedea doar profilul anonimizat/rezumat (competențe, an de studiu, scor compatibilitate, fără date personale de contact sau CV).

### 2. Decizia de Arhitectură
1. **Modelare Tag-uri & Taxonomie**:
   - Model dedicat `Tag` cu categorie (`EngineeringDomain`), flag `isPredefined` și relații Many-to-Many către `StudentProfile` (`StudentTag`) și `InternshipOffer` (`OfferTag`).
   - `OfferTag` include un nivel de importanță (`isRequired: Boolean`, pondere `weight`).
2. **Motorul de Scoring**:
   - Funcție pură și deterministă `calculateCompatibilityScore(studentTags, offerTags)`:
     - Calculează acoperirea tag-urilor obligatorii și opționale.
     - Ponderare pe domenii comune din cadrul Facultății de Inginerie.
     - Returnează procentaj și explicație detaliată a punctajului (competențe potrivite vs lipsă).
3. **Restricția de Acces la CV (Privacy Gate)**:
   - Verificare la nivel de Server Action / API Route / Data Access Layer:
     - Accesul la `cvUrl` este permis exclusiv dacă există o înregistrare în `CompanyApplicantRank` / `Application` cu status activ asociată studentului și ofertei deținute de firmă.
