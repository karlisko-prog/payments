# Ledus Kase — datu modelis

*Versija: atbilst aplikācijas v4.0 · atjaunots 2026-09-16*

Apraksta **pašreizējo** glabāšanu (pārlūka `localStorage`) un pāreju uz kopīgu datubāzi. Bota SQLite shēma ir atsevišķi — `hokeja-bots/docs/DATU-MODELIS.md`.

---

## 1. Kur dati glabājas

| Kas | Kur | Piezīme |
|---|---|---|
| Viss aplikācijas stāvoklis | `localStorage`, atslēga `hokejs_treninu_maksajumi_v1` | Viens JSON objekts |
| Rezerves kopija atmiņā | JS mainīgais | Ja `localStorage` nav pieejams (privātais režīms) — dati dzīvo līdz cilnes aizvēršanai |
| Dublējums | Lietotāja lejupielādēts `.json` fails | `payments-YYYYMMDD-HHMM.json` |

Servera nav. Sinhronizācijas nav. **Vienīgais dublējums ir tas, ko lietotājs pats saglabā.**

---

## 2. Saknes objekts

```jsonc
{
  "v": 3,                  // shēmas versija
  "price": 20,             // noklusējuma treniņa cena, EUR
  "people": [ /* … */ ],
  "sessions": [ /* … */ ],
  "subs": { /* … */ },
  "goals": [ /* … */ ],    // no v4.0; nav lauka = tukšs masīvs

  // lietotāja iestatījumi
  "lang": "lv",            // "lv" | "en"          — nav → "lv"
  "theme": "dark",         // "dark" | "light"     — nav → "dark"
  "nameOrder": "fl",       // "fl" | "lf"          — nav → "fl" (Vārds Uzvārds)
  "logo": "data:image/png;base64,…",   // neobligāts, samazināts līdz 128 px augstumā
  "subLast": 100,          // pēdējā izmantotā abonementa cena — noklusējums jauniem mēnešiem
  "backup": 1756300000000  // pēdējā dublējuma laiks, ms
}
```

### 2.1 `people[]` — dalībnieki

| Lauks | Tips | Nozīme |
|---|---|---|
| `id` | string | Nemainīgs. Vecajiem — `p1`, `p2`…; jaunajiem — nejaušs |
| `name` | string | **Vienmēr `Vārds Uzvārds`**, neatkarīgi no attēlojuma iestatījuma |
| `guest` | bool | `true` = viesis (neparādās treniņa izvēlnē) |
| `arch` | bool | `true` = arhīvā |

Komandas cilvēks = `!guest && !arch`.

### 2.2 `sessions[]` — treniņi

| Lauks | Tips | Nozīme |
|---|---|---|
| `id` | string | Nemainīgs |
| `date` | string | `YYYY-MM-DD`. **Unikāls** — divi treniņi vienā datumā nav atļauti |
| `price` | number | Šī treniņa cena. Ja nav — tiek izmantota saknes `price` |
| `roster` | string[] | Dalībnieku `id`. Ja lauka nav — uzskatāms, ka piedalās visi |
| `entries` | object | `id` → atzīme (skat. 2.3) |
| `exp` | object[] | Izdevumu rindas `{ n: nosaukums, a: summa }` |

### 2.3 `entries` — maksājuma atzīme

```jsonc
"p3": { "s": "part", "a": 10, "c": 10, "t": 1758000000000 }
```

| Lauks | Tips | Nozīme |
|---|---|---|
| `s` | string | `"paid"` \| `"part"` \| `"debt"` \| `"none"` |
| `a` | number\|null | Skaidrā nauda. Attiecas tikai uz `part` |
| `c` | number | Cik segts no iepriekšēja atlikuma. **Nav lauka = 0** |
| `t` | number | Atzīmēšanas laiks, ms (no v3.6). Nav lauka = nezināms, kārtojas zemāk |

**Ieraksta neesamība nozīmē "nav atzīmēts"** un nav tas pats, kas `"none"` (nebija treniņā).

> **Mantojuma formāts:** v2.6 rakstīja `"c": 1` kā karogu "segts pilnībā". Nolasīšanas kods to pārtulko par pilnu treniņa cenu, ja `s === "paid"`. Jauni ieraksti vienmēr raksta summu. Šo apstrādi **nedrīkst noņemt**, kamēr eksistē vecas ierīces.

### 2.4 `subs` — abonementi

```jsonc
"subs": {
  "2026-08": {
    "price": 100,
    "entries": { "p1": { "s": "paid", "a": null } }
  }
}
```

Atslēga ir `YYYY-MM`. Statusi: `"paid"` \| `"part"` (ar `a`) \| `"signed"` (pieteicies, nav maksājis).

### 2.5 `goals[]` — mērķi (naudas vākšana), no v4.0

```jsonc
{
  "id": "k3f9a1x",
  "title": "Turnīrs Rīgā",
  "kind": "fixed",             // "fixed" (daļa no katra) | "free" (brīvas iemaksas)
  "share": 50,                 // tikai fixed — kopējā daļa vienam cilvēkam
  "target": 1000,              // tikai free — mērķa summa (0 = bez mērķa)
  "due": "2026-10-12",         // YYYY-MM-DD vai null
  "roster": ["p1", "p2"],      // tikai fixed — kam jāmaksā
  "shares": { "p2": 25 },      // individuālas daļas; 0 = nav jāmaksā; nav atslēgas = share
  "contribs": [                // iemaksu žurnāls, nekad netiek pārrakstīts kopumā
    { "id": "c1", "pid": "p1", "name": null, "a": 50, "t": 1758000000000 },
    { "id": "c2", "pid": null, "name": "Jāņa tēvs", "a": 30, "t": 1758000100000 },
    { "id": "c3", "pid": null, "name": "Kārlis Ozols", "pn": 1, "a": 20, "t": 1758000200000 }
  ],
  "status": "open",            // "open" | "closed"
  "created": 1757900000000,
  "spent": 600,                // tikai closed — cik iztērēts, noslēdzot
  "closedAt": 1760000000000    // tikai closed
}
```

| Lauks iemaksā | Nozīme |
|---|---|
| `pid` | Cilvēka `id`, ja iemaksātājs ir sarakstā; citādi `null` |
| `name` | Brīvs teksts, ja `pid` ir `null` ("Sponsors", "Jāņa tēvs") |
| `pn` | `1` = `name` ir bijušā cilvēka kanoniskais vārds (`Vārds Uzvārds`) — rāda pēc vārdu secības iestatījuma. Rodas, dzēšot cilvēku |
| `a`, `t` | Summa, laiks |

**Mērķa nauda ir atsevišķs maks.** Neviens `goals` lauks neietekmē treniņu bilanci, parādus, atlikumus vai kopsavilkuma sešus rādītājus. Pārpalikums pēc noslēgšanas (`Σa − spent`) paliek mērķa vēsturē.

---

## 3. Kas **netiek** glabāts

Šie lielumi tiek rēķināti no ierakstiem katrā attēlošanā. Tie nekad nenonāk datubāzē — citādi tie novecotu.

| Lielums | Formula (`p` = treniņa cena) |
|---|---|
| Segts no atlikuma | `c` (mantojuma gadījums: `paid` + `c===1` → `p`) |
| Saņemtā nauda | `paid` → `p − c` · `part` → `a` · pārējie → `0` |
| Parāds | `debt` → `p` · `part` → `max(0, p − a − c)` · pārējie → `0` |
| Atlikums | `paid` → `−c` · `part` → `max(0, a + c − p) − c` · pārējie → `0` |
| Cilvēka bilance | Σ atlikums − Σ parāds pāri visiem treniņiem un abonementiem |
| Treniņa nesegtais | FIFO sadale: vēlākie maksājumi sedz vecākos parādus |
| Mērķa daļa cilvēkam | `shares[pid]`, ja ir; citādi `share` |
| Mērķī samaksājis | Σ `contribs.a` ar šo `pid` ≥ daļa − 0.004 |
| Mērķa summa | `fixed` → Σ daļas pār `roster` · `free` → `target` |
| Mērķī savākts | Σ visu `contribs.a` (arī ārpus sastāva un brīvā teksta) |

**Atlikums var būt negatīvs** — tā tiek attēlota atlikuma izlietošana. Skaitot summas, negatīvās vērtības nedrīkst nogriezt.

---

## 4. Invarianti

Šie apgalvojumi ir patiesi vienmēr. Tos vērts pārbaudīt testos.

1. `people[].id` ir unikāls
2. `sessions[].date` ir unikāls
3. Katrs `entries` un `subs[].entries` atslēgas `id` eksistē `people[]`
4. `roster` satur tikai eksistējošus `id`
5. Cilvēkam vienā treniņā ir **ne vairāk kā viena** atzīme
6. Σ (saņemtā nauda) pāri visiem ierakstiem = kopsavilkuma *Saņemts*
7. Σ (atlikums) − Σ (parāds) pa cilvēku = viņa bilance abās vietās, kur to rāda
8. Ja `c > 0`, tad pirms šī treniņa cilvēkam bija vismaz tikpat liels atlikums
9. `goals[].roster` un `goals[].shares` atslēgas eksistē `people[]`; `contribs[].pid` ir vai nu eksistējošs `id`, vai `null` ar `name`
10. Kopsavilkuma seši rādītāji ir identiski neatkarīgi no `goals` satura

Invariants 8 **netiek pārbaudīts kodā**. Ja lietotājs izdzēš vecu treniņu, kurā radās atlikums, jaunākais ieraksts ar `c` paliks "karājoties" un bilance kļūs negatīva. Zināms trūkums, skat. 7. sadaļu.

Invariants 9 **tiek uzturēts** ar `normGoals()` ielādē un importā, un ar cilvēka dzēšanas kodu (iemaksa pārvēršas par tekstu ar `pn:1`).

---

## 5. Migrācijas

Migrācijas notiek ielādes brīdī un ir drošas atkārtotai palaišanai.

| No | Uz | Darbība |
|---|---|---|
| bez `v` | `v: 2` | Cilvēkiem bez `guest` lauka: `guest = !/^p\d+$/.test(id)` — sākotnējais komandas saraksts saglabā `pN` id |
| `v: 2` | `v: 3` | Treniņiem bez `price` tiek fiksēta tā brīža noklusējuma cena |

**Jaunam laukam nav vajadzīga migrācija, ja tā neesamība ir derīga vērtība** (`c`, `t`, `nameOrder`, `theme`, `goals`). Migrācija vajadzīga tikai tad, kad mainās esošu datu nozīme.

Importējot dublējumu, papildus tiek normalizēts: `subs`, `entries`, cenas kā skaitļi, trūkstoši masīvi, un `goals` caur `normGoals()` — nederīgi `id` tiek pārģenerēti, fantomu `pid` izmesti, `due`/`closedAt`/summas pārbaudītas, `null` ieraksti izmesti. Ja normalizācija nokrīt, iepriekšējais stāvoklis paliek neskarts.

---

## 6. Dublējuma formāts

Eksportētais fails ir **precīza saknes objekta kopija**, `JSON.stringify(S, null, 2)`. Atsevišķa apvalka nav, versionēšana notiek ar `v`.

Imports pieņem jebkuru `v` un palaiž migrācijas. **Imports aizvieto visu** — apvienošanas nav.

Minimālā derīguma pārbaude: objektam jāsatur `people` un `sessions`. Ar to pietiek, lai atšķirtu no cita JSON, bet nepietiek, lai atklātu bojātu failu — skat. 7. sadaļu.

---

## 7. Zināmie trūkumi

| Trūkums | Sekas | Risinājums |
|---|---|---|
| Nav atsauces integritātes | Izdzēšot treniņu, kurā radās atlikums, ieraksts ar `c` paliek bez seguma | Pārbaude pirms dzēšanas vai `c` pārrēķins |
| Nav zaudējumu aizsardzības | Pārlūka datu notīrīšana iznīcina visu bez brīdinājuma | Automātisks dublējums, kad būs serveris |
| Imports neatpazīst bojātu failu | Var ielādēt daļēju JSON ar tukšiem masīviem | Kontrolsumma vai stingrāka shēmas pārbaude |
| `price` bez valūtas | Vienmēr EUR, klusi | Lauks `currency`, kad būs ārpus eirozonas |
| Nav notikumu žurnāla treniņiem | Nevar pierādīt, kas un kad tika atzīmēts | `payment_log` tabula serverī (mērķiem `contribs` jau ir žurnāls) |
| Decimālais komats `type=number` laukos | Pārlūkā ar en lokāli "5,5" var kļūt par 55 | `type=text inputmode=decimal` ar komata parsēšanu visos summu laukos |

---

## 8. Pāreja uz kopīgu datubāzi (3. fāze)

Ceļazīmes 3. fāzē Ledus Kase kļūst par produkta web daļu ar kopīgu Postgres. Tad:

**Divi atsevišķi modeļi kļūst par vienu.** Botam ir `players` (atslēga — telefons), Kasei — `people` (atslēga — iekšējs `id`). Salaidums notiek pēc telefona; Kases cilvēkiem bez numura tiek izveidots ieraksts bez `phone`.

**Treniņš iegūst identitāti.** Šobrīd Kasē treniņu identificē datums, botā — `event_id`. Pēc apvienošanas noteicošais ir `event_id`, un datuma unikalitātes ierobežojums atkrīt.

**Pievienojas nomnieka jēdziens.** Katrai tabulai `team_id`; katrs vaicājums pēc tā filtrēts. Tas ir vienīgais slānis, kas neļauj vienai komandai ieraudzīt citas naudu — tāpēc tas jāievieš uzreiz, ne pēc tam.

**Aprēķini pārceļas uz serveri.** Bilance un FIFO sadale šobrīd tiek rēķināta pārlūkā katrā attēlošanā. Ar daudzām komandām tas jāpārceļ uz serveri un jākešo.

Aptuvenā atbilstība:

| Tagad (JSON) | Botā (SQLite) | Pēc apvienošanas (Postgres) |
|---|---|---|
| `people[]` | `players` | `people` (`team_id`, `phone`, `name`, `is_guest`, `is_archived`) |
| `sessions[]` | `events` | `events` (`team_id`, `kind`, `starts_at`, `price`) |
| `entries` | — | `payments` (`event_id`, `person_id`, `status`, `cash`, `from_balance`, `marked_at`) |
| `subs` | — | `subscriptions` (`team_id`, `person_id`, `month`, `price`, `status`, `paid`) |
| `exp[]` | — | `expenses` (`event_id`, `label`, `amount`) |
| `goals[]` | — | `goals` (`team_id`, `title`, `kind`, `share`, `target`, `due`, `status`, `spent`, `closed_at`) + `goal_members` (`goal_id`, `person_id`, `share`) + `goal_contribs` (`goal_id`, `person_id` nullable, `name`, `amount`, `at`) |
| — | `signups`, `signup_log` | Bez izmaiņām, papildināts ar `team_id` |

**Pirms migrācijas rakstīšanas jāizlemj:** vai `payments` glabā stāvokli (kā tagad) vai notikumus (katrs maksājums — rinda). Notikumu variants atrisina žurnāla trūkumu un padara FIFO dabisku, bet prasa pārrēķinu pie katras izmaiņas. Mērķi jau ir notikumu formā (`contribs`) — tas ir arguments par labu notikumiem arī treniņiem. Šis lēmums pieder `LEMUMI.md`.
