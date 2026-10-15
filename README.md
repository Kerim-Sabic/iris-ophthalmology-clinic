# IRIS — ophthalmology teaching clinic

A browser-based practice clinic for medical students: animated narrated tutorials, 36 lectures, interactive studios (optics bench, retinoscopy, prescription desk, visual function, pupils, cover test, visual fields, slit lamp), fictional patients, spaced review and mock exams.

> Educational simulation only. Content is draft and not clinically reviewed; it is not clinical advice and does not certify clinical skill.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Tests
```bash
npm test           # unit / domain tests (Vitest)
npm run reference  # independent Python reference checks for the optics fixtures
npm run e2e        # browser journeys (Playwright, uses installed Microsoft Edge)
```

## Deploy on Netlify
The repo includes `netlify.toml` (build `npm ci && npm run build`, publish `dist`, Node 22). In Netlify: **Add new site → Import an existing project → GitHub →** pick this repository and deploy; no settings need changing. No environment variables or API keys are needed — learner progress is stored in each visitor's browser.

## More
- `CLAUDE.md` — architecture and conventions
- `BUILD_STATUS.md` — what is built, verified and still missing
- `docs/` — specification, simulation contracts, test plan, sources, content status
