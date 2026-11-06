# P14 - Portal de Practică: Matching Studenți - Firme

Platformă universitară dedicată gestionării stagiilor de practică: publicare oferte de către companii, înregistrare profiluri studenți cu CV și competențe, matching stabil cu capacități limitate bazat pe algoritmul **Gale-Shapley**, gestionarea excepțiilor prin realocare minimală, programare interviuri, generare convenție de practică în format PDF și jurnal săptămânal de pontaj ore validat de tutore.

---

## 🚀 Stivă Tehnologică

Conform deciziei de arhitectură documentate în [DECISIONS.md](file:///home/david/Work/web2-lab/docs/agents/DECISIONS.md) (**ADR-001** - status `approved`):

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/) cu **React 19** și **TypeScript**
- **Bază de date**: **PostgreSQL 16** (containerizată cu Docker Compose)
- **ORM & Migrations**: [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Infrastructură locală**: [Docker Compose](https://docs.docker.com/compose/)

---

## 🗄️ Schema Bazei de Date (11 Tabele Relaționale)

Definită în [prisma/schema.prisma](file:///home/david/Work/web2-lab/prisma/schema.prisma) și detaliată în [CONTRACTS.md](file:///home/david/Work/web2-lab/docs/agents/CONTRACTS.md):

1. **`User` (`users`)**: Autentificare și roluri (`STUDENT`, `COMPANY_TUTOR`, `COORDINATOR`, `ADMIN`).
2. **`StudentProfile` (`student_profiles`)**: Date academice (facultate, an, grupă), CV URL, competențe, disponibilitate.
3. **`CompanyProfile` (`company_profiles`)**: Informații companie, CUI/CIF, descriere, persoană de contact.
4. **`InternshipOffer` (`internship_offers`)**: Oferte de practică cu număr total de locuri, competențe cerute, perioadă și tutore.
5. **`StudentPreference` (`student_preferences`)**: Liste ordonate de preferințe ale studenților pentru oferte (rank 1, 2, ...).
6. **`CompanyApplicantRank` (`company_applicant_ranks`)**: Evaluarea și ordonarea candidaților de către companie.
7. **`Placement` (`placements`)**: Rezultatul stabil al algoritmului de matching (maxim 1 loc per student).
8. **`InternshipConvention` (`internship_conventions`)**: Convenții generate automat în format PDF cu date precompletate și flux de semnare.
9. **`WorkLog` (`work_logs`)**: Jurnal / pontaj săptămânal al orelor de practică, validat de tutorele din companie.
10. **`InterviewSlot` (`interview_slots`)**: Sloturi orare propuse de firmă și rezervate de studenți pentru interviuri.
11. **`FinalEvaluation` (`final_evaluations`)**: Fișă de evaluare finală completată de tutore la încheierea stagiului.

---

## 📋 Cerințe Preliminare

Asigurați-vă că aveți instalate pe sistem:
- **Node.js** >= 20.x (recomandat v22+)
- **npm** >= 10.x
- **Docker** și **Docker Compose**

---

## 🛠️ Instrucțiuni de Pornire

### 1. Clonare și configurare variabile de mediu

Fișierul `.env` este deja configurat pentru mediul local. Puteți verifica sau ajusta setările în caz de nevoie:

```bash
cp .env.example .env
```

Parametrii impliciți:
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=postgrespassword`
- `POSTGRES_DB=web2_lab`
- `POSTGRES_PORT=5432`
- `DATABASE_URL="postgresql://postgres:postgrespassword@localhost:5432/web2_lab?schema=public"`

### 2. Pornirea bazei de date în Docker

Porniți containerul PostgreSQL rulând:

```bash
npm run db:up
# sau direct: docker compose up -d
```

Verificați starea containerului:
```bash
npm run db:status
# sau: docker compose ps
```

### 3. Instalarea dependențelor

Instalați pachetele Node.js:

```bash
npm install
```

*(Comanda va rula automat și `prisma generate` pentru generarea tipurilor TypeScript).*

### 4. Aplicarea schemei în baza de date

Aplicați schema Prisma în containerul PostgreSQL activ:

```bash
npm run db:push
# sau pentru migrații versionate:
npm run db:migrate
```

### 5. Pornirea serverului de dezvoltare

Lansați aplicația Next.js:

```bash
npm run dev
```

Aplicația va fi accesibilă în browser la: **[http://localhost:3000](http://localhost:3000)**

---

## 🔍 Prisma Studio (Interfață vizuală pentru Baza de Date)

Pentru a vizualiza și gestiona înregistrările din baza de date:

```bash
npm run db:studio
```

Aceasta va deschide Prisma Studio la adresa `http://localhost:5555`.

---

## 📦 Scripturi NPM Disponibile

| Script | Descriere |
|---|---|
| `npm run dev` | Pornește serverul Next.js în mod dezvoltare (port 3000) |
| `npm run build` | Compilează aplicația pentru producție |
| `npm run start` | Pornește serverul compilat în producție |
| `npm run db:up` | Pornește containerul PostgreSQL în fundal prin Docker Compose |
| `npm run db:down` | Oprește containerul PostgreSQL |
| `npm run db:status` | Afișează starea containerelor Docker |
| `npm run db:push` | Sincronizează schema Prisma direct în baza de date PostgreSQL |
| `npm run db:migrate` | Creează și aplică o migrație Prisma nouă |
| `npm run db:generate` | Generează clientul TypeScript `@prisma/client` |
| `npm run db:studio` | Pornește interfața grafică Prisma Studio pe portul 5555 |

---

## 📁 Structura Proiectului

```text
web2-lab/
├── AGENTS.md                  # Regulile de lucru pentru agenți AI
├── docker-compose.yml         # Serviciul PostgreSQL pentru dev local
├── docs/
│   ├── brief.md               # Cerințele oficiale de proiect (P14)
│   └── agents/
│       ├── CONTRACTS.md       # Modele de date, entități și diagrame ERD
│       ├── DECISIONS.md       # Registru ADR (ADR-001 Stivă aprobată)
│       ├── OPEN-QUESTIONS.md  # Întrebări deschise și clarificări viitoare
│       └── PATTERNS.md        # Șabloane de cod și bune practici
├── prisma/
│   └── schema.prisma          # Schema completă a bazei de date (11 tabele)
├── src/
│   ├── app/
│   │   ├── globals.css        # Stiluri globale Tailwind CSS
│   │   ├── layout.tsx         # Root layout Next.js
│   │   └── page.tsx           # Pagină de pornire și sumar arhitectură
│   └── lib/
│       └── prisma.ts          # Singleton Prisma Client pentru Next.js
├── .env                       # Variabile de mediu locale
├── .env.example               # Șablon variabile de mediu
├── package.json               # Dependențe și scripturi npm
├── tsconfig.json              # Configurare compilator TypeScript
└── README.md                  # Documentație de instalare și pornire
```
