# Ledus kase (Ice Till)

A finance tracking app for an amateur ice hockey team.

It replaces the phone notes and spreadsheets normally used to track who paid for a session, who still owes, and how much went to the coach, the goalies and the rink each month.

Everything runs from a single HTML file — no sign-up, no subscription, and no data leaves the device.

---

## What it does

**Sessions**

- Add a session date and pick who is attending — copy the list from the previous session or paste it from your team page
- One tap per participant: *paid cash*, *paid part* (with amount), *still owes*, or *did not attend*
- Marked rows collapse, so only the remaining work stays visible
- Every session has its own price, prefilled from settings
- A guest who shows up at the last minute can be added on the spot

**Memberships**

- Monthly membership with its own price per month
- Statuses: *paid*, *partly paid*, *signed up (not paid)*
- A player with a membership for that month shows no payment buttons in the session — just a "Membership" tag

**People**

- **Team** — regular players who appear when choosing participants
- **Guests** — people added to a single session only
- **Archive** — those not currently attending; out of the way, but their history and debts are kept

**My expenses**

- Per session: coach, goalies, rink, and any other rows you add
- Balance shown immediately: money received minus expenses

**Summary**

- Filter by month, defaults to the current one
- Received, owed to me, I owe, expenses, balance
- Tap a tile to see exactly which people are behind the number
- Expense breakdown by month and category
- CSV export

---

## Data and privacy

Data is stored **only on your device**, in the browser. Nothing is sent to a server and nobody else can reach it, even if the app's address is public.

That also means backups are your job:

- **Settings → Download file** saves everything into one JSON file
- **Load JSON** puts it back — on a new phone, after clearing browser data, or when moving to a newer version of the app
- If no backup has been made for over a week, the app reminds you

---

## Setup

1. Put `index.html` and `sw.js` in a GitHub repository and enable GitHub Pages (Settings → Pages → Deploy from a branch → main → /root)
2. Open the resulting address in your phone browser
3. Choose **Add to Home screen** — the app opens full screen with its own icon

After the first visit it also works **offline**, so it can be used in a rink with poor signal.

---

## Settings

- **Language** — Latvian or English
- **Appearance** — dark or light theme
- **Logo** — your team logo, shown in the header and used for the icon
- **Session price** — the default price for new sessions

---

## Technical

A single HTML file, no external libraries, no backend. Data in `localStorage`, offline support via a service worker. Works in any modern browser.
