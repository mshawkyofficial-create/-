<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0922aef6-1400-4b1f-9338-f8c17081fd95

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Nutrition tracking

The nutrition module includes a client-and-date-scoped food log, coach targets,
remaining calories and macros, manual entries, plan-option logging, and a reviewed
smart-entry flow. Smart entry extracts foods and quantities, while macro totals are
calculated from the app's controlled ingredient database before the trainee confirms
the entry. Entries with missing gram weights or unclear cooked/raw state are blocked
until clarified.
