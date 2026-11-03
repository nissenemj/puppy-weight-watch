// The offscreen print preflight and the actual PDF use identical paper dimensions.
const paperRules = (root: string) => `
 ${root} {font-size:11pt;line-height:1.5;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
 ${root} .annual-sheet {display:flex;flex-direction:column;width:148mm;height:210mm;max-width:none;margin:0;padding:14mm 12mm 12mm 11mm;border:0;border-left:5mm solid var(--annual-accent);border-radius:0;break-after:page;}
 ${root} .annual-sheet::before {left:2mm;}
 ${root} .annual-sheet > * {flex-shrink:0;}
 ${root} .annual-sheet:last-child {break-after:auto;}
 ${root} .annual-sheet :is(h1,h2) {font-size:26pt;margin:4mm 0 7mm;}
 ${root} .annual-page-cover :is(h1,h2) {font-size:28pt;line-height:1.05;margin:9mm 0 6mm;}
 ${root} .annual-page-cover:has(.annual-cover-illustration) :is(h1,h2) {font-size:32pt;}
 ${root} img {height:60mm;} ${root} .annual-page-cover img {height:78mm;}
 ${root} figure:not(.annual-cover-illustration):not(.annual-growth-chart) {padding:3mm;}
 ${root} .annual-cover-illustration {display:flex;align-items:center;flex:1 1 0;min-height:0;margin:3mm 0 6mm;}
 ${root} .annual-cover-illustration img {height:100%;max-height:110mm;min-height:0;}
 ${root} .annual-comparison {grid-template-columns:1fr 1fr;gap:5mm;}
 ${root} .annual-comparison img {height:auto;max-height:65mm;}
 ${root} figcaption,${root} .annual-kicker {font-size:9pt;}
 ${root} .annual-footer {font-size:8pt;margin-top:auto;padding-top:3mm;}
 ${root} table {font-size:10pt;} ${root} th,${root} td {padding:4px;}
 ${root} .annual-growth-chart svg {height:76mm;}
 ${root} .annual-chart-data {display:none;}
 ${root} .annual-growth-facts {padding:3mm 0;}
 ${root} .annual-growth-facts strong {font-size:15pt;}
 ${root} .annual-growth-facts span {font-size:8pt;}
 ${root} .annual-copy {margin:3mm 0 5mm;}
 ${root} .annual-story-title {font-size:17pt;line-height:1.3;}
 ${root} .annual-mishap-illustration {margin:2mm auto 4mm;}
 ${root} .annual-mishap-illustration img {width:52mm;height:48mm;background:transparent;}
 ${root} .annual-letter-copy {font-size:11pt;line-height:1.5;}
 ${root} .annual-letter-ending {height:41mm;margin:2mm 0 5mm;gap:5mm;}
 ${root} .annual-letter-ending img {height:41mm;width:41mm;}
 ${root} .annual-letter-lines {height:28mm;}
 ${root} .annual-page-guided .annual-guided-photo img {height:45mm;}
 ${root} .annual-page-guided :is(h1,h2) {font-size:24pt;margin:3mm 0 5mm;}
 ${root} .annual-guided-answers {margin:4mm 0;}
 ${root} .annual-guided-answers > div {margin:0 0 4mm;}
 ${root} .annual-guided-answers dt {font-size:9pt;line-height:1.4;}
 ${root} .annual-guided-answers dd {font-size:11pt;line-height:1.5;margin:1mm 0 0;}
 ${root} .annual-guided-edition {font-size:8pt;margin:0 0 3mm;}
 ${root} .annual-guided-selections {margin:3mm 0;}
 ${root} .annual-guided-selections > p {font-size:8pt;margin:0 0 1mm;}
 ${root} .annual-guided-selections ul {gap:1.5mm;}
 ${root} .annual-guided-selections li {font-size:8pt;padding:1mm 2mm;}
 ${root} .annual-guided-imagined {padding:2mm 3mm;}
 ${root} .annual-guided-imagined dt span {font-size:8pt;}
 ${root} .annual-guided-photo figcaption {font-size:9pt;margin-top:2mm;}
 ${root} .annual-guided-photo figcaption strong {font-size:12pt;}
 ${root} .annual-guided-content:has(.annual-guided-selections) .annual-guided-photo img {height:35mm;}
 ${root} .annual-guided-continuation .annual-guided-photo img {height:110mm;}
 ${root} .annual-page-scrapbook :is(h1,h2) {font-size:24pt;margin:3mm 0 5mm;}
 ${root} .annual-page-scrapbook[data-scrapbook-section="photo"] :is(h1,h2) {font-size:18pt;}
 ${root} .scrap-content figure.scrap-photo-frame {padding:3mm;margin:0 0 4mm;}
 ${root} .annual-page-scrapbook .scrap-photo-frame img {height:55mm;}
 ${root} .annual-page-scrapbook .scrap-layout-story .scrap-photo-frame img {height:35mm;}
 ${root} .annual-page-scrapbook[data-brief-photo="true"] .scrap-content:not(.scrap-layout-story) .scrap-photo-frame img {height:auto;max-height:85mm;}
 ${root} .annual-page-scrapbook .scrap-photo-only .scrap-photo-frame img {height:110mm;}
 ${root} .scrap-content .scrap-copy {font-size:11pt;line-height:1.5;margin:2mm 0 4mm;}
 ${root} .scrap-content .scrap-copy-label {font-size:9pt;margin:2mm 0 1mm;}
 ${root} .scrap-content .scrap-fiction-label {font-size:8pt;margin:0 0 1mm;}
 ${root} .scrap-content .scrap-quote {padding:2mm 3mm;margin:3mm 0;}
 ${root} .scrap-content .scrap-quote-on-photo {margin:2mm 2mm 6mm;}
 ${root} .scrap-content .scrap-photo-scene:has(.scrap-quote-on-photo) > img {height:auto;max-height:55mm;}
 ${root} .scrap-content .scrap-quote .scrap-copy {font-size:11pt;line-height:1.4;margin:0;}
 ${root} .scrap-content .scrap-event-date {font-size:9pt;margin:2mm 0;}
 ${root} .scrap-content .scrap-paper-sticker {width:12mm;height:12mm;right:1mm;bottom:1mm;}
 ${root} .scrap-content figcaption {font-size:8pt;margin-top:2mm;}
`;

export const documentStyles = `
.annual-document { --annual-accent:#245246;--annual-wash:#edf3ef;color:#233f50; font-family:Arial,sans-serif; font-size:16px; line-height:1.55; }
.annual-document.annual-palette-lake {--annual-accent:#233f50;--annual-wash:#eef3f5;}
.annual-document.annual-palette-berry {--annual-accent:#74465c;--annual-wash:#f6edf2;}
.annual-document * { box-sizing:border-box; }
.annual-document .annual-sheet {position:relative;width:100%;max-width:560px;margin:0 auto 24px;padding:36px 36px 28px 30px;background:#fff;border:1px solid #d4dfe4;border-left:14px solid var(--annual-accent);border-radius:1px;overflow-wrap:anywhere;}
.annual-document .annual-sheet::before {content:"";position:absolute;left:7px;top:0;bottom:0;border-left:1px dashed var(--annual-accent);opacity:0.45;}
.annual-document .annual-sheet :is(h1,h2) {color:var(--annual-accent);font-size:36px;font-weight:400;letter-spacing:-0.035em;line-height:1.1;margin:16px 0 28px;font-family:Georgia,serif;}
.annual-document .annual-page-cover {text-align:center;}
.annual-document .annual-page-cover :is(h1,h2) {font-size:42px;line-height:1.05;margin:32px 0 24px;text-wrap:balance;}
.annual-document .annual-kicker {color:#53636a;font-size:12px;line-height:1.5;margin:0;}
.annual-document .annual-name {font-size:20px;color:var(--annual-accent);font-weight:600;}
.annual-document .annual-cover-subtitle {font-size:14px;color:#53636a;max-width:30ch;margin:0 auto 16px;}
.annual-document figure {position:relative;margin:0 0 20px;}
.annual-document figure:not(.annual-cover-illustration):not(.annual-growth-chart) {padding:12px;border:1px solid #d4dfe4;background:#fff;}
.annual-document figure:not(.annual-cover-illustration):not(.annual-growth-chart)::before {content:"";position:absolute;right:12px;top:-7px;width:56px;height:18px;background:#f2dc91c9;transform:rotate(-8deg);}
.annual-document img {display:block;width:100%;height:240px;object-fit:contain;background:#fff;}
.annual-document .annual-page-cover img { height:320px; }
.annual-document .annual-cover-illustration img {background:transparent;object-fit:contain;}
.annual-document figcaption {color:#53636a;font-size:13px;margin-top:8px;line-height:1.55;}
.annual-document .annual-copy {white-space:pre-wrap;margin:16px 0;font-family:Georgia,serif;line-height:1.6;}
.annual-document .annual-story-title {font-size:25px;line-height:1.35;color:var(--annual-accent);}
.annual-document .annual-mishap-illustration {width:100%;max-width:300px;margin:24px auto;}
.annual-document .annual-mishap-illustration img {height:240px;background:transparent;}
.annual-document .annual-comparison { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.annual-document .annual-comparison img {height:auto;max-height:240px;}
.annual-document table {width:100%;border-collapse:collapse;font-size:14px;font-variant-numeric:tabular-nums;}
.annual-document th,.annual-document td {padding:7px;text-align:left;border-bottom:1px solid #d4dfe4;}
.annual-document caption {text-align:left;font-weight:600;margin:12px 0 8px;}
.annual-document .annual-footer {display:flex;justify-content:space-between;gap:12px;margin:32px 0 0;padding-top:12px;border-top:1px solid #d4dfe4;font-size:11px;color:#53636a;}
.annual-document .annual-footer span:last-child {white-space:nowrap;}
.annual-document .annual-growth-chart {margin:0;}
.annual-document .annual-growth-chart svg {display:block;width:100%;height:auto;overflow:visible;}
.annual-document .annual-chart-axis {fill:#53636a;font-family:Arial,sans-serif;font-size:13px;}
.annual-document .annual-chart-grid {stroke:#d4dfe4;stroke-width:1;}
.annual-document .annual-chart-line {stroke:var(--annual-accent);}
.annual-document .annual-chart-point {fill:var(--annual-accent);stroke:#fff;stroke-width:1;}
.annual-document .annual-growth-facts {display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;border-top:1px solid #d4dfe4;border-bottom:1px solid #d4dfe4;padding:12px 0;margin:16px 0;font-variant-numeric:tabular-nums;}
.annual-document .annual-growth-facts p {margin:0;text-align:center;}
.annual-document .annual-growth-facts strong {display:block;font-size:22px;color:var(--annual-accent);}
.annual-document .annual-growth-facts span {display:block;font-size:12px;}
.annual-document .annual-chart-data summary {min-height:44px;cursor:pointer;padding:12px 0;color:var(--annual-accent);text-decoration:underline;}
.annual-document .annual-letter-copy {font-family:Georgia,serif;font-size:17px;line-height:1.7;}
.annual-document .annual-letter-ending {display:flex;align-items:end;gap:24px;height:160px;margin:12px 0 24px;}
.annual-document .annual-letter-ending img {width:160px;height:160px;object-fit:contain;background:transparent;}
.annual-document .annual-letter-lines {flex:1;height:108px;background:repeating-linear-gradient(to bottom,transparent 0,transparent 26px,#d4dfe4 26px,#d4dfe4 27px);}
.annual-document .annual-guided-title {font:400 30px/1.15 Georgia,serif;color:var(--annual-accent);letter-spacing:-0.035em;margin:12px 0 24px;text-wrap:balance;}
.annual-document .annual-guided-photo img {object-fit:contain;height:220px;}
.annual-document .annual-guided-date {font-size:14px;color:#53636a;margin:12px 0;}
.annual-document .annual-guided-answers {margin:20px 0 0;}
.annual-document .annual-guided-answers > div {margin-bottom:20px;}
.annual-document .annual-guided-answers dt {font-size:14px;line-height:1.5;color:#53636a;}
.annual-document .annual-guided-answers dd {font:400 18px/1.6 Georgia,serif;color:#233f50;margin:6px 0 0;overflow-wrap:anywhere;}
.annual-document .annual-guided-answers .annual-guided-empty {color:#53636a;font-size:16px;font-style:italic;}
.annual-document .annual-guided-edition {display:flex;align-items:center;gap:8px;font-size:12px;line-height:1.5;color:var(--annual-accent);padding-bottom:10px;margin:0 0 20px;border-bottom:1px solid #d4dfe4;}
.annual-document .annual-guided-edition svg {flex:none;}
.annual-document .annual-guided-selections {margin:20px 0;}
.annual-document .annual-guided-selections > p {font-size:12px;color:#53636a;margin:0 0 8px;}
.annual-document .annual-guided-selections ul {list-style:none;display:flex;flex-wrap:wrap;gap:6px;padding:0;margin:0;}
.annual-document .annual-guided-selections li {font-size:12px;line-height:1.5;color:var(--annual-accent);border:1px solid #a0b4b3;border-radius:2px;padding:4px 8px;background:var(--annual-wash);}
.annual-document .annual-guided-photo figcaption span {display:block;}
.annual-document .annual-guided-photo figcaption strong {display:block;font:400 20px/1.4 Georgia,serif;color:var(--annual-accent);margin-top:4px;}
.annual-document .annual-guided-imagined {border-left:3px solid var(--annual-accent);background:var(--annual-wash);padding:12px 14px;}
.annual-document .annual-guided-imagined dt {color:var(--annual-accent);}
.annual-document .annual-guided-imagined dt span {display:block;color:#53636a;font-size:12px;font-weight:400;}
.annual-document .annual-guided-placeholder {display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:190px;padding:20px;text-align:center;border:1px dashed #81929c;background:var(--annual-wash);color:var(--annual-accent);}
.annual-document .annual-guided-placeholder :is(p,small) {margin:0;font-size:14px;line-height:1.6;}
.annual-document .scrap-content figure.scrap-photo-frame {padding:10px 10px 18px;margin:8px 0 24px;transform:rotate(-1.5deg);}
.annual-document .scrap-content .scrap-photo-frame img {display:block;height:230px;width:100%;object-fit:contain;}
.annual-document .scrap-content.scrap-layout-poster figure.scrap-photo-frame {border:0;transform:none;padding:0;}
.annual-document .scrap-layout-poster .scrap-photo-frame::before {display:none;}
.annual-document .scrap-content.scrap-layout-story figure.scrap-photo-frame {max-width:300px;margin-left:auto;margin-right:auto;transform:rotate(1deg);}
.annual-document .scrap-content.scrap-layout-story .scrap-photo-frame img {height:170px;}
.annual-document .scrap-content.scrap-photo-only .scrap-photo-frame img {height:400px;}
.annual-document .annual-page-scrapbook[data-brief-photo="true"] .scrap-content:not(.scrap-layout-story) .scrap-photo-frame img {height:auto;max-height:340px;}
.annual-document .scrap-photo-frame figcaption {font:400 12px/1.5 Arial,sans-serif;}
.annual-document .scrap-photo-frame:has(.scrap-paper-sticker) figcaption {padding-right:52px;}
.annual-document .scrap-paper-sticker {position:absolute;right:-4px;bottom:5px;display:flex;align-items:center;justify-content:center;width:48px;height:48px;background:#f2dc91;color:#233f50;border-radius:50%;transform:rotate(10deg);box-shadow:1px 2px 0 #233f5020;}
.annual-document .scrap-copy {font:400 18px/1.6 Georgia,serif;color:#233f50;margin:12px 0 20px;white-space:pre-wrap;overflow-wrap:anywhere;}
.annual-document .scrap-copy-label {font:400 14px/1.5 Arial,sans-serif;color:#53636a;margin:0 0 6px;}
.annual-document .scrap-photo-scene {position:relative;display:grid;grid-template-areas:"photo";isolation:isolate;}
.annual-document .scrap-photo-scene > img {grid-area:photo;}
.annual-document .scrap-photo-scene:has(.scrap-quote-on-photo) {width:fit-content;max-width:100%;margin-inline:auto;}
.annual-document .scrap-content .scrap-photo-scene:has(.scrap-quote-on-photo) > img {width:auto;height:auto;max-width:100%;max-height:230px;}
.annual-document .scrap-quote {position:relative;padding:12px 14px;background:#fff;color:#233f50;border:2px solid var(--annual-accent);border-radius:18px 18px 18px 6px;margin:16px 0 24px;}
.annual-document .scrap-quote::after {content:"";position:absolute;left:22px;bottom:-9px;width:16px;height:16px;background:#fff;border-right:2px solid var(--annual-accent);border-bottom:2px solid var(--annual-accent);transform:rotate(45deg);}
.annual-document .scrap-quote-on-photo {grid-area:photo;z-index:1;align-self:end;justify-self:start;contain:inline-size;min-width:0;width:82%;max-width:82%;padding:8px 10px;margin:24px 8px 8px;box-shadow:0 2px 6px #233f5020;}
.annual-document .scrap-quote-on-photo::after {left:auto;right:18px;top:-9px;bottom:auto;border:0;border-left:2px solid var(--annual-accent);border-top:2px solid var(--annual-accent);}
.annual-document .scrap-fiction-label {display:block;font:400 12px/1.5 Arial,sans-serif;color:#53636a;margin:6px 0 8px;}
.annual-document .scrap-quote .scrap-copy {font:400 16px/1.4 Georgia,serif;margin:0;}
.annual-document .scrap-quote-on-photo .scrap-copy {font-size:14px;}
.annual-document .scrap-event-date {font-size:14px;color:#53636a;margin:12px 0;}
@media(max-width:480px) { .annual-document .annual-sheet {padding:24px 16px 20px 20px;border-left-width:8px;} .annual-document .annual-sheet::before {left:4px;} .annual-document .annual-sheet :is(h1,h2) {font-size:30px;} .annual-document .annual-page-cover :is(h1,h2) {font-size:36px;} .annual-document .annual-comparison {grid-template-columns:1fr;} .annual-document .annual-letter-ending img {width:120px;height:120px;} }
.annual-print-root {position:fixed;left:-100000px;top:0;width:148mm;visibility:hidden;pointer-events:none;}
${paperRules(".annual-print-root .annual-document")}
@media print {
 @page {size:A5;margin:0;}
 body:has(> .annual-print-root) {margin:0!important;padding:0!important;}
 body:has(> .annual-print-root)::before,body:has(> .annual-print-root)::after {display:none!important;content:none!important;}
 body:has(> .annual-print-root) > :not(.annual-print-root) {display:none!important;}
 body > .annual-print-root {position:static!important;visibility:visible!important;width:148mm;pointer-events:auto;}
 ${paperRules(".annual-document")}
}
`;
