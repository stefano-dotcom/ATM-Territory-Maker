ATM SHOWCASE — WOW V3
=====================

FILES TO REPLACE
1. assistant.css
2. assistant.js

IMPORTANT CACHE STEP (recommended)
In index.html replace every occurrence of:
  ?v=20260811-4
with:
  ?v=20260812-wow3

For atm-v7.html and atm-bridge.html, change:
  assistant.css
into:
  assistant.css?v=20260812-wow3

and change:
  assistant.js
into:
  assistant.js?v=20260812-wow3

Then upload the two replacement files and the edited HTML files to GitHub.
After GitHub Pages deploys, use Ctrl+F5 once.

WHAT WOW V3 ADDS
- AI launcher physically disappears (display:none) while chat is open.
- Inline failsafe makes the fix work even if part of the CSS is cached.
- High-contrast buttons/links on light sections.
- New cinematic LIVE FLOW section automatically injected on the home page.
- Animated ATM v7 map: territories draw/pulse and cursor travels between them.
- Animated GeoJSON packet moves from v7 to Bridge to Manager.
- ATM Bridge demo detects the file, progresses and confirms it.
- ATM Manager live mini-dashboard lights up at the end of the flow.
- AI section no longer depends on the missing video: it becomes a live animated AI core.
- Floating v7 / Bridge / Manager orbit nodes and data particles feed the AI core.
- Premium hover depth, glow tracking and scroll reveals.
- Product pages receive ambient lighting and animated Bridge details.
- AI guide keeps conversational context and is more robust on follow-up questions.

NO NEW VIDEO FILE IS REQUIRED.
The illustrative 'video-like' sequence is rendered live in HTML/CSS/JS, so it is sharp on every screen and does not need an MP4 download.
