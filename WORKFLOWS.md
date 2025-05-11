# GitHub Actions Workflows

Dette dokumentet beskriver strukturen og funksjonaliteten til GitHub Actions workflows i prosjektet.

---

## 📦 Workflow-struktur

### 🧙‍♂️ Backend Workflow (`backend.yml`)

* **Plassering**: `crm-core/.github/workflows/backend.yml`
* **Triggede hendelser**:

  * Endringer i `crm-core`-mappen
  * Push og pull requests til `main`-grenen
* **Jobber**:

  * Installer avhengigheter
  * Kjr linting og tester
  * Bygg backend
  * Docker build og push (kun på `main`)
* **Secrets** som må være konfigurert:

  * `DATABASE_URL`
  * `JWT_SECRET`
  * `POSTGRES_PASSWORD` *(hvis container-database brukes)*
  * `GITHUB_TOKEN` *(automatisk generert av GitHub)*

---

### 🖥️ Frontend Workflow (`frontend.yml`)

* **Plassering**: `web-frontend/.github/workflows/frontend.yml`
* **Triggede hendelser**:

  * Endringer i `web-frontend`-mappen
  * Push og pull requests til `main`-grenen
* **Jobber**:

  * Installer avhengigheter
  * Kjr linting og tester
  * Bygg frontend med Vite
  * Docker build og push (kun på `main`)
* **Secrets** som må være konfigurert:

  * `VITE_API_URL`
  * `VITE_API_WS_URL` *(hvis WebSocket brukes)*
  * `GITHUB_TOKEN`

---

## ✅ Generelle Anbefalinger

* Sørg for at **alle secrets** er korrekt lagt inn i GitHub under:

  * `Settings > Secrets and variables > Actions`
* Hold workflows **adskilt** og test hver for seg ved å gjøre endringer i enten `crm-core/` eller `web-frontend/`.
* Bruk `.env.example`-filer til å dokumentere hvilke variabler som kreves i hvert miljø (dev/prod).

---

## 🔧 Forslag til Forbedringer

* Legg til **security scanning** (f.eks. med `npm audit`, `trivy`, eller `Snyk`)
* Implementer **continous deployment (CD)** til staging/produksjon
* Konfigurer **matrix builds** for å teste på flere Node.js-versjoner
* Bruk **separate secrets** for dev og prod, og legg inn `if`-betingelser i workflows
* Optimaliser **caching av avhengigheter** for raskere builds

  * Eksempel: `pnpm`, `node_modules`, `vite` cache

---

## 📌 Dokumentasjon

Oppdater denne filen hver gang:

* En ny workflow legges til
* Triggere, secrets eller miljøvariabler endres
* Nye steg eller jobber legges inn i pipeline
