// The offscreen print preflight and the actual PDF use identical paper dimensions.
const paperRules = (root: string) => `
 ${root} {font-size:10pt;line-height:1.45;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
 ${root} .annual-sheet {display:flex;flex-direction:column;width:148mm;height:210mm;max-width:none;margin:0;padding:14mm;border:0;border-radius:0;break-after:page;}
 ${root} .annual-sheet > * {flex-shrink:0;}
 ${root} .annual-sheet:last-child {break-after:auto;}
 ${root} .annual-sheet :is(h1,h2) {font-size:20pt;margin:4mm 0 5mm;}
 ${root} img {height:60mm;} ${root} .annual-page-cover img {height:85mm;}
 ${root} .annual-comparison {grid-template-columns:1fr 1fr;gap:5mm;}
 ${root} .annual-comparison img {height:65mm;}
 ${root} figcaption,${root} .annual-kicker {font-size:9pt;}
 ${root} .annual-footer {font-size:8pt;margin-top:auto;padding-top:6mm;}
 ${root} table {font-size:10pt;} ${root} th,${root} td {padding:4px;}
`;

export const documentStyles = `
.annual-document { color:#24332e; font-family:Arial,sans-serif; font-size:16px; line-height:1.55; }
.annual-document * { box-sizing:border-box; }
.annual-document .annual-sheet { width:100%; max-width:560px; margin:0 auto 24px; padding:36px; background:#fffef9; border:1px solid #d9e2dd; border-radius:3px; overflow-wrap:anywhere; }
.annual-document .annual-sheet :is(h1,h2) { color:#245246; font-size:28px; line-height:1.2; margin:12px 0 24px; font-family:Georgia,serif; }
.annual-document .annual-kicker { color:#53625d; font-size:13px; margin:0; }
.annual-document .annual-name {font-size:20px;color:#245246;font-weight:600;}
.annual-document figure { margin:0 0 20px; }
.annual-document img { display:block; width:100%; height:240px; object-fit:contain; background:#edf3ef; border-radius:8px; }
.annual-document .annual-page-cover img { height:320px; }
.annual-document figcaption { color:#53625d; font-size:13px; margin-top:8px; }
.annual-document .annual-copy { white-space:pre-wrap; margin:16px 0; }
.annual-document .annual-comparison { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.annual-document .annual-comparison img { height:200px; }
.annual-document table { width:100%; border-collapse:collapse; font-size:14px; }
.annual-document th,.annual-document td { padding:7px; text-align:left; border-bottom:1px solid #d9e2dd; }
.annual-document .annual-footer { margin:24px 0 0; font-size:12px; color:#53625d; }
@media(max-width:480px) { .annual-document .annual-sheet {padding:20px;} .annual-document .annual-comparison {grid-template-columns:1fr;} }
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
