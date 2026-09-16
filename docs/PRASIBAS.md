# Ledus Kase — funkcionālās prasības

*Versija: atbilst aplikācijas v4.0 · atjaunots 2026-09-16*

Šis dokuments apraksta, **ko** aplikācija dara un pēc kādiem noteikumiem. Kā tā ir uzbūvēta — `ARHITEKTURA.md`. Kāpēc tieši tā — `LEMUMI.md`. Datu struktūra — `DATU-MODELIS.md`.

Ja kaut kas šeit ir pretrunā ar kodu, pretruna ir kļūda — jālabo viens vai otrs, ne jāignorē.

---

## 1. Konteksts un lietotājs

**Lietotājs ir viens cilvēks** — komandas kasieris vai organizators. Ne treneris, ne spēlētājs. Aplikācija atbild uz vienu jautājumu: *kurš man ir parādā un cik.*

**Lietošanas vide ir hallē**, ar cimdiem, sliktu apgaismojumu un bieži bez interneta. No tā izriet prasības: lieli pieskāriena laukumi, augsts kontrasts, darbība bezsaistē.

**Aplikācija nav grāmatvedība.** Tā neizraksta rēķinus, neseko PVN un nesavienojas ar banku. Tā aizstāj piezīmju lapiņu telefonā.

### Termini

| Termins | Nozīme |
|---|---|
| **Treniņš** | Viens pasākums ar datumu un cenu. Iekšēji `session` — sedz arī spēles |
| **Dalībnieks** | Cilvēks, kas var piedalīties treniņā. Trīs stāvokļi: komanda, viesis, arhīvs |
| **Atzīme** | Viena cilvēka maksājuma stāvoklis vienā treniņā |
| **Parāds** | Cilvēks man ir parādā naudu |
| **Atlikums** | Es esmu parādā cilvēkam — viņš iedeva vairāk, nekā bija jāmaksā |
| **Bilance** | Parāds mīnus atlikums. Pozitīva = viņš parādā, negatīva = man jāatdod |
| **Abonements** | Mēneša maksa, kas aizstāj maksāšanu par atsevišķiem treniņiem |
| **Mērķis** | Vienreizēja naudas vākšana ar savu maku — turnīrs, ekipējums, palīdzība |

---

## 2. Dalībnieki

### 2.1 Trīs saraksti

| Saraksts | Parādās treniņa izvēlnē | Nozīme |
|---|---|---|
| **Komanda** | Jā | Pastāvīgie spēlētāji |
| **Viesi** | Nē — tikai tajos treniņos, kuros jau ir | Cilvēki, kas atnāca vienu reizi |
| **Arhīvs** | Nē | Pašlaik nenāk; vēsture un parādi saglabājas |

Cilvēku var pārvietot starp visiem trim sarakstiem. Pārvietošana **nekad** neizmaina viņa maksājumu vēsturi.

### 2.2 Vārdi

- Vārds glabājas vienā formātā: **`Vārds Uzvārds`**
- Attēlošana un ievade seko iestatījumam **Vārdu secība** (`Vārds Uzvārds` vai `Uzvārds Vārds`); iestatījums attiecas uz visu aplikāciju vienlaikus
- **Kārtošana vienmēr notiek pēc uzvārda** (pēdējā vārda), neatkarīgi no iestatījuma; latviešu alfabēta secībā
- Sarakstos vispirms nāk komanda, tad viesi

### 2.3 Dzēšana

Cilvēka dzēšana noņem arī visus viņa ierakstus visos treniņos un abonementos; mērķos viņš tiek izņemts no sastāva, bet viņa iemaksas paliek kā teksts ar vārdu — nauda taču ienāca. Darbība prasa apstiprinājumu un nav atsaucama. **Arhivēšana ir ieteicamā alternatīva** un tā tiek piedāvāta saskarnē blakus.

---

## 3. Treniņi

### 3.1 Izveide

Treniņu identificē **datums** — divi treniņi vienā datumā nav atļauti. Jaunam treniņam cena tiek paņemta no iestatījumiem, bet **glabājas pie paša treniņa**, tāpēc vēlāka noklusējuma cenas maiņa vecos treniņus neietekmē.

Pēc izveides uzreiz atveras dalībnieku izvēle ar iepriekšējā treniņa sastāvu (bez viesiem — tie ir vienreizēji).

### 3.2 Dalībnieku izvēle

Izvēlnē redzami **tikai komandas cilvēki, kas nav arhīvā**, plus tie viesi, kas jau ir šajā treniņā. Palīgpogas: *Kā iepriekš*, *Visus*, *Notīrīt*, meklēšana.

Viesi tiek pievienoti tikai ar roku, ierakstot vārdu. Ievadot pirmos burtus, tiek piedāvāti aktīvie viesi no saraksta.

Ja no saraksta izņem cilvēku, kuram jau bija atzīme, viņa atzīme tiek dzēsta.

### 3.3 Maksājuma atzīmes

Katram dalībniekam ir **tieši četras** iespējas:

| Atzīme | Saņemtā nauda | Ietekme uz bilanci |
|---|---|---|
| **Iedeva naudu** | Treniņa cena | Nekāda |
| **Iedeva daļu** (ar summu) | Ievadītā summa | Parāds vai atlikums pēc starpības |
| **Palika parādā** | 0 | Parāds treniņa cenas apmērā |
| **Nebija treniņā** | 0 | Nekāda |

Noteikumi:

- **Nekas nav noklusējums.** Neatzīmēts cilvēks netiek uzskatīts ne par maksātāju, ne par parādnieku
- Nospiežot atzīmi, rinda **saritinās** un pārceļas uz saraksta apakšu zem virsraksta *Atzīmētie*. Augšā paliek tikai neizdarītais
- Izņēmums: *Iedeva daļu* rinda paliek vietā, kamēr tiek ievadīta summa
- Uzspiežot uz saritinātas rindas, tā atveras atkārtotai izvēlei
- **Apstiprinājums tiek prasīts tikai tad, ja tiek mainīta jau esoša atzīme.** Pirmā atzīme notiek bez jautājuma
- Summa `0` nozīmē "nav atzīmes" — ieraksts tiek dzēsts

*Atzīmētie* ir trīs kārtās: naudas atzīmes (jaunākā augšā — lai redz, kurš iedeva pēdējais), tad *Nebija treniņā*, tad abonementu maksātāji.

### 3.4 Abonementa gadījums

Ja cilvēkam ir **tā mēneša abonements** (jebkurā statusā), treniņā viņam maksāšanas pogas neparādās. Rindā ir tikai atzīme *Abonements*, un tā **neatveras** — abonements tiek kārtots savā sadaļā.

---

## 4. Naudas noteikumi

Šī ir dokumenta svarīgākā daļa. Visa pārējā funkcionalitāte ir saskarne ap šiem noteikumiem.

### 4.1 Pamatformulas

Vienam ierakstam, kur `p` = treniņa cena, `a` = skaidrā nauda, `c` = segts no atlikuma:

```
segtais       = a + c
saņemtā nauda = a                      (c nav jauna nauda!)
parāds        = max(0, p − a − c)
atlikums      = max(0, a + c − p) − c
```

**Kritiski:** maksājot no atlikuma, treniņa "saņemts" **nepieaug**. Nauda tika saņemta agrāk, citā treniņā. Ja to skaitītu vēlreiz, kopsavilkums rādītu vairāk naudas, nekā tiešām ienācis.

### 4.2 Atlikuma pārnešana

Cilvēka bilance ir summa pāri **visiem** treniņiem un abonementiem, ne pa vienam treniņam.

Ja pirms treniņa cilvēkam ir pozitīva bilance, tā parādās uz maksājuma pogas:

| Situācija | Kur | Krāsa |
|---|---|---|
| Atlikums ≥ treniņa cena | Uz *Iedeva naudu* | Zaļa, `+X €` |
| Atlikums > 0, bet < cena | Uz *Iedeva daļu* | Dzeltena, `+X €` |
| Parāds | Uz *Iedeva daļu* | Sarkana, `−X €` |
| Bilance nulle | — | — |

Nospiežot pogu ar atlikumu, tiek **jautāts**, vai to izmantot. Divas atbildes: *No atlikuma* (ieskaita) vai *Ar naudu* (atstāj atlikumu neskartu, pieņem skaidru naudu). Nekas netiek norakstīts bez apstiprinājuma.

Sarkanā summa ir **tikai atgādinājums** — parāds netiek automātiski ieskaitīts.

### 4.3 Vecāko parādu segšana (FIFO)

Parāds pieder cilvēkam, ne treniņam. Tāpēc treniņu sarakstā katra kartīte rāda **tikai to, kas šodien vēl nav nokārtots**:

1. Cilvēka notikumi tiek sakārtoti hronoloģiski
2. Katrs maksājums sedz **vecākos atvērtos parādus vispirms**
3. Neizlietotais atlikums paliek piesaistīts tam treniņam, kurā radās, līdz tiek izlietots

Sekas: nomaksāts parāds pazūd no vecās kartītes. Kartīte kļūst zaļa pati no sevis.

### 4.4 Rindas stāvoklis treniņā

Saritinātā rinda rāda **kopējo bilanci**, ne tikai šo treniņu:

- Bilance negatīva → sarkana, *Parādā X €*
- Bilance pozitīva → dzeltena, *Jāatdod X €*
- Bilance nulle → zaļa, *Viss kārtībā*

Zaļš nozīmē vienu vienīgu lietu: ar šo cilvēku viss ir tīrs. Cilvēks, kurš samaksāja par šo treniņu, bet palicis parādā par iepriekšējo, **nav** zaļš.

### 4.5 Piemērs

| Solis | Darbība | Rezultāts |
|---|---|---|
| 1 | 20 € treniņš, iedeva 50 € | Saņemts 50 €, atlikums +30 € |
| 2 | Nākamais 20 € treniņš — *Iedeva naudu* deg zaļa ar `+30 €` | |
| 3 | Izvēlas *No atlikuma* | Saņemts 0 €, atlikums +10 €, rinda dzeltena *Jāatdod 10 €* |
| 4 | Trešais 20 € treniņš — *Iedeva daļu* deg dzeltena ar `+10 €` | |
| 5 | Izvēlas *Izmantot*, skaidrā neko nedod | Atlikums 0, parāds 10 €, rinda sarkana |

Kopā: ienāca 50 €, izmantoti trīs treniņi par 60 €, paliek parādā 10 €. Skaitļi sakrīt.

---

## 5. Abonementi

- Abonements ir **mēneša** maksa ar savu cenu katram mēnesim
- Trīs statusi: **Samaksāts**, **Daļēji samaksāts** (ar summu), **Pieteicies** (nav samaksāts)
- *Pieteicies* rada parādu pilnas mēneša cenas apmērā un treniņos parādās kā *Abonements · nav apmaksāts*
- Abonementi attiecas tikai uz komandas cilvēkiem, kas nav arhīvā
- Abonementa parāds un pārmaksa ieplūst tajā pašā kopējā bilancē, kas treniņiem

Abonementi un Mērķi dzīvo vienā cilnē **Iemaksas** ar divām apakšcilnēm — abi ir maksājumi, kas nav piesaistīti treniņam.

---

## 6. Mērķi (naudas vākšana)

### 6.1 Kas tas ir

Mērķis ir vienreizēja vākšana ar nosaukumu, neobligātu termiņu un **savu maku**. Divi veidi:

| Veids | Piemērs | Kam jāmaksā |
|---|---|---|
| **Fiksēta daļa** | Turnīrs, 50 € no katra | Sastāvam — konkrētiem cilvēkiem, kurus izvēlas kā treniņam |
| **Brīvas iemaksas** | Palīdzība ar traumu | Nevienam — dod, kurš grib un cik grib |

### 6.2 Atsevišķs maks — galvenais noteikums

**Mērķa nauda nekad neieplūst treniņu kasē.** Tā neietekmē "Saņemts", parādus, atlikumus un bilanci. Ja Jānis iedod 60 € turnīram par 50 €, tie 10 € ir *papildus* turnīram, nevis viņa treniņa atlikums.

Kopsavilkumā mērķiem ir savs bloks (savākts / iztērēts / makā), kas neiet iekš sešiem pamata rādītājiem un netiek filtrēts pa periodiem.

### 6.3 Fiksēta daļa

- Izveidojot, jāieraksta daļa (> 0). Tad atveras **tas pats sastāva ekrāns, kas treniņam**, ar pēdējā treniņa sastāvu kā noklusējumu (poga *No pēdējā treniņa*)
- **Mērķa summa = daļu summa pār sastāvu**; tā pārrēķinās, mainot sastāvu vai daļas
- Katram cilvēkam sastāvā var iestatīt **individuālu daļu** (✎), arī 0 € — tad viņš ir sastāvā, bet nav parādnieks (vārtsargs, jaunietis)
- Statuss *samaksājis / nav* **netiek glabāts** — to rēķina, salīdzinot cilvēka iemaksas ar viņa daļu. Glabājam faktus, stāvokli rēķinām
- Trīs grupas: **Nav samaksājuši** (ar pogām *Samaksāja* un *Iedeva daļu*), **Samaksājuši** (jaunākā iemaksa augšā), **Citas iemaksas** (cilvēki ārpus sastāva un brīvs teksts)
- *Samaksāja* pievieno iemaksu tieši trūkstošajā apmērā; *Iedeva daļu* — ievadīto summu, kas **papildina** jau iedoto
- Pārmaksa redzama (*+30 papildus*), bet paliek mērķa makā
- Izņemot cilvēku no sastāva, viņa iemaksas paliek — viņš pārceļas uz *Citas iemaksas*
- Arhivēšana mērķi nemaina; arhivētais, kas jau ir sastāvā, sastāva ekrānā ir redzams un paliek, kamēr to apzināti neizņem

### 6.4 Brīvas iemaksas

- Mērķa summa ir neobligāta (0 = bez mērķa, progress rāda tikai savākto)
- Nav sastāva, nav parādnieku — tikai viens iemaksu saraksts, jaunākā augšā
- Iemaksātāju var izvēlēties no komandas un viesiem (ieteikumi, ievadot burtus) **vai ierakstīt brīvi** — "Jāņa tēvs", "Sponsors". Brīvs teksts glabājas kā teksts, ne kā dalībnieks, un sarakstus nepiesārņo
- Ja brīvi ierakstīts vārds sakrīt ar cilvēku sarakstā, iemaksa tiek piesaistīta viņam

### 6.5 Noslēgšana

- *Noslēgt* prasa **iztērēto summu** (noklusējumā = savāktais). Pārpalikums vai iztrūkums (*makā ±X €*) paliek mērķa vēsturē — netiek pārnests uz kasi, netiek dalīts atpakaļ
- Noslēgtam mērķim nav pogu, formas un labošanas; to var **atvērt no jauna** — tad iztērētais tiek dzēsts
- Noslēgtie stāv saraksta apakšā zem virsraksta *Noslēgtie*
- Mērķi var dzēst pilnībā ar apstiprinājumu

### 6.6 Piemērs

| Solis | Darbība | Rezultāts |
|---|---|---|
| 1 | Turnīrs, 50 € no katra, sastāvā 12 | Mērķa summa 600 €, nav samaksājuši 12 |
| 2 | Vārtsargam daļa 0 € | Mērķa summa 550 €, nav samaksājuši 11 |
| 3 | 9 cilvēki *Samaksāja*, viens iedeva 80 | Savākts 530 €, nav 1, pārmaksa +30 redzama |
| 4 | Kārlis (nav sastāvā) iemet 30 | Savākts 560 € — *Citas iemaksas* |
| 5 | Noslēdz ar iztērēts 550 | Makā +10 € · vēsturē. Treniņu kase neskarta |

---

## 7. Mani izdevumi

Katram treniņam ir izdevumu rindas ar nosaukumu un summu. Noklusējuma rindas: treneris, vārtsargs, vārtsargs 2, halle, citi izdevumi. Rindas var pievienot, pārsaukt un dzēst.

Treniņa **atlikums = saņemtā nauda − izdevumi**. Tas ir naudas plūsmas rādītājs, ne peļņa — parādi tajā neietilpst.

---

## 8. Kopsavilkums

Periods pēc noklusējuma ir **tekošais mēnesis**; ja tajā nav datu — viss laiks.

Seši rādītāji: saņemts, man parādā, man jāatdod, treniņu skaits, izdevumi, atlikums.

**Divu veidu skaitļi, un tie tiek filtrēti atšķirīgi:**

| Veids | Rādītāji | Periods nozīmē |
|---|---|---|
| **Apgrozījums** | Saņemts, izdevumi, treniņu skaits, apmeklējums | Tikai tas, kas notika šajā periodā |
| **Stāvoklis** | Man parādā, man jāatdod, bilance | Uz perioda **beigām**, ieskaitot visu iepriekšējo |

Parāds nav mēneša lielums — tas ir stāvoklis, kas nes līdzi iepriekšējos mēnešus. Ja augustā radās 30 € atlikums un septembrī no tā izlietoti 20 €, tad augusta skats rāda −30 € (tā tobrīd bija), septembra — −10 € (tā ir tagad). Zem tabulas par to ir paskaidrojums.

Sekas: cilvēks parādās tabulā arī tad, ja izvēlētajā mēnesī nav bijis nevienā treniņā, bet viņam ir atvērta bilance.

- Uzspiežot uz *Man parādā* vai *Man jāatdod*, atveras konkrēto cilvēku saraksts
- Uzspiežot uz *Izdevumi*, tiek aizritināts līdz izdevumu sadalījumam
- **Viena cilvēka parāds un pārmaksa savstarpēji dzēšas** — cilvēks nevar vienlaikus atrasties abos sarakstos
- Tabula pa cilvēkiem, izdevumi pa mēnešiem un kategorijām, abonementi pa mēnešiem, **mērķi** (visi, bez perioda filtra)
- CSV eksports (mērķus neiekļauj)

---

## 9. Nefunkcionālās prasības

| Prasība | Pamatojums |
|---|---|
| **Darbība bez interneta** pēc pirmās atvēršanas | Hallēs bieži nav signāla |
| **Dati paliek ierīcē** un netiek sūtīti nekur | Publiska adrese, bet privāti dati |
| **Dublējums ar vienu pieskārienu**; atgādinājums, ja nav taisīts nedēļu | Pārlūka datu notīrīšana iznīcina visu |
| **Pieskāriena laukums vismaz 44 px** | Cimdotas rokas |
| **Divas valodas** — latviešu un angļu, pārslēdzamas jebkurā brīdī | Starptautiskā versija |
| **Divas tēmas** — tumšā un gaišā | Halles apgaismojums |
| **Nulle ārējo bibliotēku** | Viens fails, nulle uzturēšanas |
| **Aritmētikas kļūda ir kritiska**, izkārtojuma kļūda nav | Te ir sveša nauda |
| **Bojāts imports nedrīkst salauzt lapu** un nedrīkst aizstāt esošos datus, ja to nevar normalizēt | Vienīgais dublējums ir lietotāja fails |

---

## 10. Ārpus tvēruma

Šajā versijā apzināti **nav**:

- Vairāku lietotāju piekļuves — aplikācija pieder vienam cilvēkam
- Sinhronizācijas starp ierīcēm — pārnešana notiek caur JSON failu
- Maksājumu pieņemšanas — nauda mainās no rokas rokā vai bankā
- Automātiskas parādu dzēšanas — visu apstiprina cilvēks
- Spēļu sastāva izvēles un pieteikšanās — tas ir bota uzdevums
- Mērķa naudas atmaksas iemaksātājiem — pārpalikums paliek makā

---

## 11. Atvērtie jautājumi

- **Kā treniņu identificē pēc apvienošanas ar botu?** Šobrīd tas ir datums, botā — `event_id`. Divi treniņi vienā dienā šobrīd nav iespējami; botā ir
- **Kas notiek ar bilanci, kad cilvēku dzēš?** Šobrīd viss pazūd klusi. Vai vajag brīdinājumu, ja bilance nav nulle?
- **Vai atlikumu drīkst pārnest starp sezonām?** Šobrīd bilance ir mūžīga un neierobežota laikā
- **Decimālais komats.** Summu lauki ir `type=number`; pārlūkos ar angļu lokāli "5,5" var kļūt par 55. Uz telefona ar latviešu lokāli komats parasti tiek pieņemts. Droši atrisināms tikai ar teksta lauku un pašu parsēšanu — visos summu laukos reizē
- **Vai bots drīkstētu izsludināt mērķi grupā** un pieņemt "+ 50" kā iemaksu? Tas prasa kopīgu datubāzi (3. fāze)
