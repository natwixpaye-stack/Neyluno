/** Long-tail guides — genuinely useful content, no keyword filler. */
export const guides = [
  {
    slug: 'reduce-image-size-for-email',
    title: 'How to reduce image size for email (under 10 MB, no quality loss you can see)',
    description:
      'Email providers block large attachments. Here is the exact recipe to shrink photos and screenshots — dimensions first, then quality — with numbers that work.',
    keywords: ['reduce image size for email', 'image too large to send', 'shrink photo for attachment'],
    relatedTools: ['image-compressor', 'image-resizer', 'jpg-to-webp'],
    updated: '2026-09-01',
    faq: [
      { q: 'What is a safe maximum size for email attachments?', a: 'Most providers (Gmail, Outlook, Yahoo) cap attachments at 20–25 MB, but large emails are slow to send and often bounce on corporate servers. Keeping the total under 10 MB is the practical safe zone.' },
      { q: 'Should I resize or compress first?', a: 'Resize first. A photo that is 4000 px wide needs only ~1920 px for email viewing; halving dimensions divides the pixel count by four, which matters far more than the quality setting.' },
      { q: 'Does converting to WebP help for email?', a: 'It makes the file smaller, but the recipient must be able to open WebP. JPG is the safest choice for email compatibility.' },
    ],
    html: `
<p>Email providers usually reject attachments above <strong>20–25 MB</strong>, and even a 15 MB email is slow to upload, painful to download, and frequently blocked by corporate filters. The fix is not “find a bigger email” — it is shrinking the images properly.</p>

<h2>Step 1 — Cut the dimensions, not just the quality</h2>
<p>The single biggest lever is resolution. Most phones now shoot 12-megapixel photos around <strong>4000 × 3000 px</strong>. On an email thread, the recipient will view them at most 1200 px wide — the remaining pixels only add weight.</p>
<ul>
  <li>Resize to a maximum of <strong>1920 px on the longest side</strong> (use the “Website” preset in our resizer). This alone typically divides file size by 3–4×.</li>
  <li>For screenshots of documents, <strong>1280 px</strong> is plenty and text stays readable.</li>
</ul>

<h2>Step 2 — Compress at 70–80 % quality</h2>
<p>Once dimensions are reasonable, compression is the second lever. Between <strong>70 and 80 % JPEG quality</strong>, differences are virtually invisible for photos, while file size keeps dropping. Below 60 %, you will start seeing blocky artifacts in skies and gradients.</p>
<p>Our <a href="/tools/image-compressor/">Image Compressor</a> shows the before/after sizes per file, so you can watch the total drop under 10 MB in real time.</p>

<h2>Step 3 — Batch, then ZIP</h2>
<p>Sending ten photos? Process them all at once (the compressor accepts up to 40 files), then use <strong>“Download all (ZIP)”</strong>: one attachment, often 10–20× smaller than the originals, and your recipient gets everything in a single archive.</p>

<h2>What does NOT work</h2>
<ul>
  <li><strong>Re-compressing an already small image</strong> — you lose quality without gaining size.</li>
  <li><strong>Expecting PNG to compress like JPG</strong> — PNG is lossless; for photos, always pick JPG or WebP.</li>
  <li><strong>Renaming the extension</strong> — changing .png to .jpg in the file name changes nothing.</li>
</ul>

<h2>Quick reference</h2>
<table>
  <thead><tr><th>Goal</th><th>Dimensions</th><th>Quality</th><th>Typical result</th></tr></thead>
  <tbody>
    <tr><td>Photo in email</td><td>≤ 1920 px</td><td>75 %</td><td>150–400 KB</td></tr>
    <tr><td>Document screenshot</td><td>≤ 1280 px</td><td>80 %</td><td>80–250 KB</td></tr>
    <tr><td>Web upload</td><td>≤ 2560 px</td><td>80–85 %</td><td>300–800 KB</td></tr>
  </tbody>
</table>
`,
  },
  {
    slug: 'convert-webp-to-jpg',
    title: 'Convert WebP to JPG when nothing will open it',
    description:
      'WebP saves space but older software, printers and some platforms still refuse it. Here is why it happens and the fastest reliable conversion path.',
    keywords: ['webp to jpg', 'open webp file', 'webp not supported'],
    relatedTools: ['webp-to-jpg', 'image-compressor', 'image-resizer'],
    updated: '2026-09-01',
    faq: [
      { q: 'Why do so many sites serve WebP now?', a: 'WebP files are 25–35 % smaller than JPEG at equal quality, which makes pages load faster. Every modern browser supports it, so sites switched massively.' },
      { q: 'Does converting WebP to JPG increase the file size?', a: 'Usually yes — JPEG is less efficient. If size matters, keep quality around 80 % or stay on WebP where the recipient supports it.' },
      { q: 'Can I keep transparency?', a: 'Not in JPG — it has no alpha channel. Convert to PNG instead if transparency must survive.' },
    ],
    html: `
<p>You downloaded an image, double-clicked it… and your photo viewer, office suite or printer utility says <em>“cannot open file”</em>. The culprit is usually the <strong>WebP format</strong>: excellent for the web, still spotty elsewhere.</p>

<h2>Why WebP breaks older tools</h2>
<p>WebP is only about a decade old. Software that has not been updated — legacy photo editors, car head units, some printers, government upload portals — predates it and simply does not know the format exists. The file itself is fine; the reader is outdated.</p>

<h2>The reliable fix: convert to JPG</h2>
<p>JPEG is the most universally supported image format ever shipped — every device made in the last 25 years opens it. Converting is a two-second job:</p>
<ol>
  <li>Open the <a href="/tools/webp-to-jpg/">WebP to JPG converter</a>.</li>
  <li>Drop your .webp file(s) — batches work too.</li>
  <li>Keep quality around <strong>80 %</strong> (invisible loss, reasonable size) and download.</li>
</ol>
<p>The conversion runs in your browser: nothing is uploaded, which matters if the image is sensitive (ID scans, tickets, contracts).</p>

<h2>When NOT to convert</h2>
<ul>
  <li><strong>You need transparency</strong> → convert to PNG, not JPG.</li>
  <li><strong>The recipient is a modern website</strong> → WebP is the better upload (smaller, faster).</li>
  <li><strong>Archival</strong> → keep the original WebP too; conversions are never lossless.</li>
</ul>

<h2>Tip: bulk downloads</h2>
<p>If a site serves every image as WebP, add them all at once — the converter processes the batch and hands you a ZIP, so you do not repeat the operation file by file.</p>
`,
  },
  {
    slug: 'compress-pdf-for-email',
    title: 'Compress a PDF for email — what actually works (and what only pretends)',
    description:
      'Most “PDF compressors” fake their results. This guide explains what genuinely shrinks a PDF, how to check honestly, and when splitting is the better answer.',
    keywords: ['compress pdf for email', 'pdf too large to send', 'reduce pdf size'],
    relatedTools: ['compress-pdf', 'split-pdf', 'image-compressor'],
    updated: '2026-09-01',
    faq: [
      { q: 'Why is my PDF so heavy?', a: 'Almost always because of embedded images: a single 12 MP scan can weigh 5 MB. Fonts, duplicated objects and bloated metadata account for the rest.' },
      { q: 'How do I know a compressor is honest?', a: 'It shows you the real before/after sizes — and tells you when nothing can be gained. Tools that always claim “80 % saved” are faking it.' },
      { q: 'When should I split instead of compress?', a: 'When the file is big because of many pages rather than heavy pages. A 120-page report splits into logical parts people actually read.' },
    ],
    html: `
<p>A 30 MB PDF will not go through most mail servers, and “compress it online” often means uploading a sensitive document to a stranger's server. Before choosing a path, understand what actually makes PDFs heavy — and what genuinely shrinks them.</p>

<h2>The honest anatomy of a fat PDF</h2>
<ol>
  <li><strong>Embedded images</strong> — the usual suspect. Scans and exported slides carry full-resolution pictures.</li>
  <li><strong>Duplicated objects</strong> — every time a document is edited and re-saved, orphan objects accumulate.</li>
  <li><strong>Metadata cruft</strong> — edit history, software stamps, keywords.</li>
  <li><strong>Fonts</strong> — embedded font subsets add weight per style.</li>
</ol>

<h2>What actually shrinks a PDF</h2>
<p><strong>Rebuilding the document.</strong> Loading the PDF and writing it out fresh removes orphan objects, recompresses cross-reference tables into object streams, and drops metadata. Our <a href="/tools/compress-pdf/">PDF compressor</a> does exactly that — and follows one rule most tools ignore: <em>if the rebuilt file is not smaller, it tells you and gives you back the original.</em> No fake percentage.</p>
<p><strong>Downsampling images.</strong> If your PDF is 90 % images (typical for scans), the biggest wins come from the images themselves: render pages at a sensible DPI or shrink source images before creating the PDF.</p>

<h2>When splitting beats compressing</h2>
<p>A 60-page, 40 MB report will not become 4 MB by magic. If structure allows it, <a href="/tools/split-pdf/">split it</a> into parts (chapters, months, sections) — each part is small, reviewable, and easy to forward. Combine both: split first, compress each part.</p>

<h2>Email-specific checklist</h2>
<ul>
  <li>Target <strong>under 10 MB</strong> total — safe for every major provider.</li>
  <li>If the document is confidential, prefer tools that process <strong>locally in your browser</strong> (verify with the Network tab: no file should leave your machine).</li>
  <li>Zipping a PDF rarely helps — PDFs are already compressed internally.</li>
</ul>
`,
  },
  {
    slug: 'create-a-favicon',
    title: 'Create a favicon that works everywhere (browsers, iOS, Android, PWAs)',
    description:
      'One logo, five sizes, three formats. This guide explains exactly which favicon files a modern site needs and how to generate the whole set in one step.',
    keywords: ['create favicon', 'favicon.ico sizes', 'apple-touch-icon'],
    relatedTools: ['favicon-generator', 'image-resizer', 'image-cropper'],
    updated: '2026-09-01',
    faq: [
      { q: 'Is favicon.ico really still needed?', a: 'Yes. Modern browsers look for it by default at the site root, and many bookmarking tools and feed readers still expect it. It costs one small file.' },
      { q: 'Why is my favicon blurry?', a: 'Usually because only a 16 × 16 version exists and the browser upscaled it. Provide 32 and 48 px inside the ICO, plus 192/512 PNGs for high-DPI contexts.' },
      { q: 'Should my icon be round?', a: 'Design on a square canvas — Android masks it (round or squircle depending on the launcher), but you should not pre-cut the shape yourself.' },
    ],
    html: `
<p>The favicon is the smallest design asset on your site and the one users stare at the most: browser tabs, bookmarks, history, home screens. Getting it wrong means a blurry tab icon or a missing one entirely. Here is the complete modern set — and how to produce it in one pass.</p>

<h2>The files a modern site actually needs</h2>
<table>
  <thead><tr><th>File</th><th>Size</th><th>Used by</th></tr></thead>
  <tbody>
    <tr><td><code>favicon.ico</code></td><td>16, 32, 48 px (one file)</td><td>All browsers, tab bars, bookmark managers</td></tr>
    <tr><td><code>apple-touch-icon.png</code></td><td>180 × 180</td><td>iOS home-screen shortcuts</td></tr>
    <tr><td><code>android-chrome-192x192.png</code></td><td>192 × 192</td><td>Android home screen, Chrome</td></tr>
    <tr><td><code>android-chrome-512x512.png</code></td><td>512 × 512</td><td>PWA splash screens</td></tr>
  </tbody>
</table>

<h2>Design rules that matter at 16 px</h2>
<ul>
  <li><strong>One symbol, no text.</strong> Wordmarks become noise at 16 px — keep the glyph alone.</li>
  <li><strong>Fill the canvas.</strong> Padding that looks fine at 512 px becomes emptiness at 16 px.</li>
  <li><strong>Check contrast on both themes.</strong> Tabs are light or dark depending on the user's OS.</li>
</ul>

<h2>Generate the whole set in one step</h2>
<p>Hand-crafting four exports and assembling a multi-size ICO by hand is tedious. The <a href="/tools/favicon-generator/">favicon generator</a> does it all at once: drop your square logo, pick the sizes, and download a ZIP containing the real multi-size <code>favicon.ico</code>, all PNGs, and the HTML snippet to paste in your <code>&lt;head&gt;</code>.</p>

<h2>The snippet</h2>
<pre><code>&lt;link rel="icon" href="/favicon.ico"&gt;
&lt;link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"&gt;
&lt;link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png"&gt;
&lt;link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png"&gt;</code></pre>

<h2>Common failure modes</h2>
<ul>
  <li><strong>Icon updated but the old one shows</strong> — browsers cache favicons aggressively. Hard-refresh, or rename the file and update the link.</li>
  <li><strong>Transparent background turns black</strong> — the source had no alpha channel; export your logo as PNG with transparency.</li>
  <li><strong>Wrong icon on iOS</strong> — iOS ignores favicon.ico and wants the dedicated apple-touch-icon.</li>
</ul>
`,
  },
  {
    slug: 'strong-passwords-guide',
    title: 'What actually makes a password strong in 2026',
    description:
      'Length beats complexity, reuse is the real enemy, and entropy is the metric that matters. The numbers behind strong passwords — and how to generate them.',
    keywords: ['strong password guide', 'password entropy', 'how long should a password be'],
    relatedTools: ['password-generator'],
    updated: '2026-09-01',
    faq: [
      { q: 'How many bits of entropy do I need?', a: '60 bits is the minimum for anything valuable; 80+ bits is comfortable; 90+ bits is out of reach of brute force with current and foreseeable hardware. Our generator shows the exact number for your settings.' },
      { q: 'Do special characters matter?', a: 'They add a little entropy, but one extra character of length adds more than adding a symbol set. Prioritize length.' },
      { q: 'Should I change passwords regularly?', a: 'Only if a service was breached. Forced periodic changes push people toward weaker, predictable passwords — modern guidance (NIST) agrees.' },
    ],
    html: `
<p>Most “password advice” is folklore. Here is the arithmetic that actually matters, in plain numbers.</p>

<h2>Entropy: the only metric that counts</h2>
<p>A password's strength is measured in <strong>bits of entropy</strong>: how many guesses a brute-force attack needs on average. Each bit doubles the search space.</p>
<ul>
  <li>40 bits — cracked in seconds on a GPU rig.</li>
  <li>60 bits — the practical minimum for real accounts.</li>
  <li>80 bits — years of work for an attacker.</li>
  <li>90+ bits — out of reach, today and for the foreseeable future.</li>
</ul>

<h2>Length beats complexity</h2>
<p>Entropy grows with <em>log₂(alphabet) × length</em>. Adding a symbol set might take your alphabet from 62 to 94 characters (+0.6 bits per character). Adding one more character is worth a full 5–6 bits. That is why <strong>a 16-character password with letters and digits beats an 8-character “complex” one every time</strong>.</p>
<table>
  <thead><tr><th>Password</th><th>Entropy</th></tr></thead>
  <tbody>
    <tr><td>8 chars, all sets</td><td>≈ 52 bits</td></tr>
    <tr><td>12 chars, letters + digits</td><td>≈ 71 bits</td></tr>
    <tr><td>16 chars, all sets</td><td>≈ 105 bits</td></tr>
  </tbody>
</table>

<h2>The real enemy: reuse</h2>
<p>Breaches leak credentials constantly; attackers feed them into every other site automatically (credential stuffing). One reused password means one breach compromises everything. The fix is structural: <strong>a unique password per service, kept in a password manager</strong>.</p>

<h2>Generate, don't invent</h2>
<p>Human-invented passwords follow patterns attackers model first (seasons, team names, keyboard walks). The <a href="/tools/password-generator/">password generator</a> uses <code>crypto.getRandomValues()</code> — the browser's cryptographic RNG — and shows the entropy of every generation. 16 characters with all sets gives you ~105 bits; generate, copy into your password manager, done.</p>

<h2>Checklist</h2>
<ul>
  <li>12+ characters minimum, 16+ for sensitive accounts.</li>
  <li>Unique per service — always.</li>
  <li>Stored in a password manager, never in a notes app.</li>
  <li>Two-factor authentication wherever offered (a strong password does not replace 2FA).</li>
</ul>
`,
  },
  {
    slug: 'merge-pdf-files',
    title: 'How to merge PDF files into one document (and keep the page order right)',
    description:
      'Combine several PDFs into a single file directly in your browser. Covers page order, mixing scanned and digital pages, and what to check before sending the result.',
    keywords: ['merge pdf', 'combine pdf files', 'join pdf into one'],
    relatedTools: ['merge-pdf', 'pdf-organizer', 'compress-pdf'],
    updated: '2026-10-03',
    faq: [
      { q: 'Are my files uploaded anywhere when I merge PDFs here?', a: 'No. Merging happens entirely in your browser with JavaScript — the files never leave your device. You can verify it: the tool works with Wi-Fi turned off.' },
      { q: 'Does merging change the order of my pages?', a: 'Only if you choose to. Files are merged in the order you add them; the Merge tool lets you reorder files before running, and the PDF Organizer lets you fine-tune page-level order afterwards.' },
      { q: 'Can I merge scanned PDFs with regular ones?', a: 'Yes — merging just concatenates pages, it does not care how they were made. Scanned pages stay images, digital pages stay selectable text.' },
      { q: 'The merged file is huge — what now?', a: 'Merging never compresses. If the result is too large for email, run it through the PDF Compressor; it rebuilds the document and only gives you the compressed version if it is genuinely smaller.' },
    ],
    html: `
<p>Merging PDFs sounds trivial until you actually need to do it: three invoices, a cover letter, two scanned receipts — and suddenly you need one clean document for an application. Here is the reliable path.</p>

<h2>Step 1 — Prepare your files</h2>
<ul>
  <li>Keep each source as its own file; <strong>do not rename extensions</strong> or edit files in a text editor.</li>
  <li>If a scan came in as separate JPG pages, convert each to PDF first (most scanner software has a “Save as PDF” option).</li>
</ul>

<h2>Step 2 — Add them in the right order</h2>
<p>Open the <a href="/tools/merge-pdf/">Merge PDF</a> tool and add your files. The order you add them in is the order of the final document, and you can drag to reorder before merging. Cover letters first, then the body documents, then annexes — it is much easier to order now than to split later.</p>

<h2>Step 3 — Merge and verify</h2>
<p>Click Merge and download the result, then open it and scroll through once: check total page count (it should equal the sum of your sources) and spot-check one page per source file. If something is missing, re-add the files — nothing was modified, your originals are untouched.</p>

<h2>If the result needs cleanup</h2>
<p>Merging keeps every page exactly as-is. To drop a page, duplicate one, or rotate a sideways scan inside the merged document, use the <a href="/tools/pdf-organizer/">PDF Organizer</a> — it shows every page as a thumbnail before you commit.</p>

<h2>What does NOT work</h2>
<ul>
  <li><strong>Renaming files 1.pdf, 2.pdf and zipping them</strong> — a ZIP is not a PDF; the recipient still has N files.</li>
  <li><strong>Copy-pasting pages in Word</strong> — layouts, fonts and page breaks shift; a PDF merge keeps everything pixel-identical.</li>
  <li><strong>Expecting merging to reduce size</strong> — it never compresses; use the PDF Compressor for that.</li>
</ul>
`,
  },
  {
    slug: 'extract-text-from-pdf',
    title: 'How to extract text from a PDF (and what to do when there is none)',
    description:
      'Get editable text out of a PDF: copy the text layer when it exists, download a .txt, and understand why scanned PDFs return nothing — with honest workarounds.',
    keywords: ['extract text from pdf', 'copy text pdf not selectable', 'pdf to txt'],
    relatedTools: ['pdf-to-text', 'pdf-to-image', 'pdf-organizer'],
    updated: '2026-10-03',
    faq: [
      { q: 'Why can I not select the text in my PDF?', a: 'The document is probably a scan: every “page” is a photograph of the original. There is no hidden text layer to read — only pixels. Tools that extract text will correctly tell you so.' },
      { q: 'Does extracting text keep the formatting?', a: 'Text layers store characters and positions, not paragraphs. You get clean words and line breaks; lists, tables and columns may need light re-tidying after extraction.' },
      { q: 'Is OCR the solution for scans?', a: 'OCR turns pixels into text. Quality depends heavily on scan resolution and language; for anything important, compare the output against the original. QuickTools does not ship OCR in V4 — this is a deliberate V5 scope decision.' },
      { q: 'Is my document uploaded anywhere?', a: 'No. Extraction runs locally in your browser; the file never leaves your device.' },
    ],
    html: `
<p>“I just need the text out of this PDF.” Sometimes you can select and copy; sometimes the text refuses to be selected. The difference decides your whole strategy.</p>

<h2>Case 1 — The text is selectable</h2>
<p>PDFs exported from Word, Google Docs or most software contain a <strong>text layer</strong>: real characters hidden behind the visual page. Extraction is trivial and lossless:</p>
<ul>
  <li>Open the <a href="/tools/pdf-to-text/">PDF → Text</a> tool and load your file.</li>
  <li>Copy the extracted text straight from the results, or download it as a <code>.txt</code> file.</li>
  <li>Page boundaries are marked so you know where page 2 starts — useful for citations.</li>
</ul>

<h2>Case 2 — The text is NOT selectable (scanned PDF)</h2>
<p>If the tool reports that no text layer was found, be glad it told you the truth: the “text” you see is an image. Your options, in honest order:</p>
<ul>
  <li><strong>Re-export the original</strong> if you have it — always better than extracting from a scan.</li>
  <li><strong>Use the PDF → Images tool</strong> to get clean page pictures, then retype the few lines you actually need.</li>
  <li><strong>OCR</strong> (optical character recognition) converts pixels to text but is a separate, heavier process; QuickTools leaves it for V5 and prefers telling you “no text found” over guessing characters.</li>
</ul>

<h2>Quick checklist</h2>
<table>
  <thead><tr><th>Symptom</th><th>Meaning</th><th>Do this</th></tr></thead>
  <tbody>
    <tr><td>Text selects, copies fine</td><td>Text layer present</td><td>PDF → Text tool</td></tr>
    <tr><td>Nothing selects, whole page highlights as image</td><td>Scan</td><td>Re-export original or OCR later</td></tr>
    <tr><td>Some pages extract, others not</td><td>Mixed document</td><td>Extract what exists; handle scans separately</td></tr>
  </tbody>
</table>
`,
  },
  {
    slug: 'base64-encoding',
    title: 'Base64, explained with real use cases (images in CSS, APIs, emails)',
    description:
      'What Base64 actually is, when encoding is the right tool (data URIs, API payloads, email attachments) and when it is the wrong one — with size math included.',
    keywords: ['base64 encode decode', 'image to base64', 'data uri'],
    relatedTools: ['encoding-lab', 'text-diff', 'qr-generator'],
    updated: '2026-10-03',
    faq: [
      { q: 'Does Base64 compress my data?', a: 'The opposite: Base64 expands data by ~33 % (3 bytes become 4 characters). It makes binary safe to transport as plain text — never smaller.' },
      { q: 'Is Base64 encryption?', a: 'No. Anyone can decode it instantly. It is an encoding, not a protection. Never treat Base64 as security for tokens or secrets.' },
      { q: 'When should I inline an image as a data URI?', a: 'For tiny graphics (icons, logos under ~5 KB) where avoiding an extra HTTP request wins. For photos, the 33 % size penalty makes a normal file the better choice.' },
      { q: 'Why do my APIs use Base64?', a: 'JSON can only carry text. To send a file through a JSON payload, you encode it to Base64 first — the receiver decodes it back to bytes. That is the whole trick.' },
    ],
    html: `
<p>Base64 looks mysterious but does one simple thing: it turns <strong>any bytes into plain text</strong>, using only 64 safe characters (A–Z, a–z, 0–9, <code>+</code> and <code>/</code>). Why bother? Because old protocols, file formats and JSON payloads only transport text reliably.</p>

<h2>The size math (the part everyone forgets)</h2>
<p>Every 3 bytes of input become 4 characters of output: a 3 MB image becomes a ~4 MB Base64 string. Planning to email a Base64 attachment? You are making the email 33 % heavier, not lighter.</p>

<h2>When Base64 is the RIGHT tool</h2>
<ul>
  <li><strong>Data URIs in CSS/HTML</strong> — <code>background: url(data:image/png;base64,…)</code> inlines a small icon and saves a network request.</li>
  <li><strong>JSON APIs carrying files</strong> — encode the bytes, send the string, decode on the other side.</li>
  <li><strong>Email attachments</strong> — MIME uses Base64 internally for every attachment you have ever sent.</li>
  <li><strong>Quick checksums of identity</strong> — paste the same string into two systems and compare.</li>
</ul>

<h2>When Base64 is the WRONG tool</h2>
<ul>
  <li><strong>“Compressing” images or files</strong> — it inflates them; use the Image Compressor instead.</li>
  <li><strong>Hiding secrets</strong> — decoding takes one click; use real encryption.</li>
  <li><strong>Storing large binaries in databases “for simplicity”</strong> — size and query costs compound; files belong in files.</li>
</ul>

<h2>Try it</h2>
<p>The <a href="/tools/encoding-lab/#base64">Encoding Lab</a> encodes and decodes Base64, URL encoding and more — live as you type, entirely in your browser. Paste a string, get the encoded form; paste a <code>data:</code> URI, see what is inside. Nothing is sent anywhere.</p>
`,
  },
];

export function getGuide(slug) {
  return guides.find((g) => g.slug === slug);
}
