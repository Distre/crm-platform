Solo Developer Roadmap – CRM/ERP plattform
Mål: Få en MVP (Customer + Invoice) i drift på Synology NAS en – uten å miste oversikten. Arbeidstid antatt 10–15 t/uke. Kryss av etter hvert som du blir ferdig ✅.
________________________________________
📋 Fremdrifts tracker
Nr	Steg	Mål/Leveranse	Status		
0.1	Portainer installert	Container portainer kjører på http://nas:9000	✅ (2025 05 04)		
0.2	Postgres container oppe	crm-postgres lytter på port 5433	✅ (2025 05 05)		
0.3	Backup script aktivt	Cron jobb med pg_dump + 7 dagers retention	✅ (2025 05 05)		
1.1	Node 20 + PNPM lokalt	Dev maskin klar (nvm + pnpm)	✅ (2025 05 05)		
1.2	Monorepo init	pnpm init + Turborepo skeleton	✅ (2025 05 05)		
1.3	docker compose.dev stack	Postgres + pgAdmin på localhost	✅ (2025 05 05)		
2.1	NestJS app crm-core	CLI generert app	✅ (2025 05 05)		
2.2	Customer modul	CRUD + unit tester	✅ (2025 05 05)		
2.3	React skeleton	Vite/Next + auth stub	✅ (2025 05 06)		
3.1	JWT Auth modul	Installer Passport+JWT, auth module & service	✅ (2025 05 06)		
3.2	Row Level Security	RLS policy testet	✅		
4.1	Invoice modul	Entitet + PDF stub	✅		
4.2	Invoice UI	Liste + form i front	✅		
5.1	Image build	GitHub Action: lint→test→build	✅ (2025 05 08)		
5.2	Prod deploy	docker compose -f prod.yml up -d på NAS	☐		
6.1	Pilot import	CSV import + 1 kunde live	☐		
6.2	Pilotfeedback	Critical bugs lukket	☐		
7.1	Warehouse modul	product + stock_move	☐		
8.1	Invoice 2.0	EHF/PEPPOL stub	☐		
9.1	Hardening	npm audit, OWASP scan	☐		
9.2	Load test	k6 500 rps 30 min	☐		
________________________________________
0 • Infrastruktur (Fullført ✅)
0.1 Portainer installert ✅
Portainer CE kjører på hosten din:
•	Container: portainer
•	Image: portainer/portainer-ce:latest
•	UI: http://nas:9000
________________________________________
0.2 Postgres container oppe ✅
Felt	Verdi
Container	crm-postgres
Image	postgres:15-alpine
Host → Container port	5433 → 5432/tcp
Volum	crmpostgres_postgres_data → /var/lib/postgresql/data
DB / bruker	crm_db / crmuser
Connection string eksempel (.env):
DATABASE_URL="postgresql://crmuser:YOUR_PASSWORD@localhost:5433/crm_db"
________________________________________
0.3 Backup script aktivt ✅
Skriptet /volume1/backup/db_backup.sh kjører via Synology Task Scheduler kl. 02:00 hver natt og beholder syv dager med dump filer.
________________________________________
1 • Lokal utvikling (pågår)
1.1 Node 20 + PNPM lokalt ✅
Windows 11 / 10 (PowerShell)
1.	Last ned nvm-setup.exe fra https://github.com/coreybutler/nvm-windows/releases/latest
(lagre og kjør installasjons¬filen – standardvalg er ok).
2.	Lukk og åpne et nytt PowerShell vindu.
Skriv nvm -v → du skal få et versjons¬nummer.
3.	Kjør:
4.	nvm install 20
5.	nvm use 20
6.	node -v      # sjekk at du får v20.x
7.	npm i -g pnpm@latest
8.	pnpm -v      # sjekk versjon
macOS / Linux (Bash/Zsh)
1.	Installer nvm:
2.	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
3.	source ~/.nvm/nvm.sh
4.	Deretter:
5.	nvm install 20
6.	node -v   # v20.x
7.	npm i -g pnpm@latest
8.	pnpm -v   # 9.x
Når node -v og pnpm -v gir riktige versjoner → kryss av 1.2 ✅.
   nvm install 20
   nvm use 20
   node -v      # sjekk at du får v20.x
   npm i -g pnpm@latest
   pnpm -v      # sjekk versjon
macOS / Linux (Bash/Zsh)
1.	Installer nvm:
2.	curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
3.	source ~/.nvm/nvm.sh
4.	Deretter:
5.	nvm install 20
6.	node -v   # v20.x
7.	npm i -g pnpm@latest
8.	pnpm -v   # 9.x
Når node -v og pnpm -v gir riktige versjoner → kryss av 1.1 ✅.
1.2 Monorepo init ✅
pnpm init
pnpm add -w -D turbo eslint prettier husky
1.3 docker compose.dev stack ✅
Opprett docker-compose.dev.yml (Postgres + pgAdmin) og kjør:
docker compose -f docker-compose.dev.yml up -d
________________________________________
2 • Backend – NestJS modulær monolitt
2.1 NestJS app crm-core ✅
pnpm nest new crm-core
2.2 Customer modul ✅
nest g module customer → CRUD + RLS.
2.3 React skeleton ✅
Opprett front end med Vite/React.
________________________________________
3 • Sikkerhet
3.1 JWT Auth ✅
Manuell JwtStrategy-implementering
1.	Opprett fil crm-core/src/auth/jwt.strategy.ts med innhold:
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: this.configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload.sub er bruker-ID, payload.username er brukernavn
    return { userId: payload.sub, username: payload.username };
  }
}
2.	Åpne src/auth/auth.module.ts og legg til strategien:
import { JwtStrategy } from './jwt.strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
3.	Neste steg: Lag en beskyttet rute med @UseGuards(AuthGuard('jwt')) i CustomerController.
3.2 Row Level Security ✅
________________________________________
4 • Faktura
4.1 Invoice modul ✅
4.2 Invoice UI ✅
________________________________________
5 • CI/CD & Prod deploy
5.1 Image build ✅
5.2 Prod deploy ☐
________________________________________
6 • Pilotfase
6.1 Pilot import ☐
6.2 Pilotfeedback ☐
________________________________________
7 • Warehouse modul ☐
________________________________________
8 • Invoice 2.0 ☐
________________________________________
9 • Hardening & Load test
9.1 Hardening ☐
9.2 Load test ☐
________________________________________
📣 Slik bruker du dokumentet
11	Finn neste ☐ oppgave.
12.	Gjør jobben – test.
13	Marker ✅ direkte i tabellen.
14.	Still spørsmål her ved behov.
