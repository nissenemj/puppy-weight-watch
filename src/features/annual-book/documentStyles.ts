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
