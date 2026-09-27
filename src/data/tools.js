/**
 * TOOLS REGISTRY — QuickTools V2
 * Add a tool: entry here + UI component in src/tools/ui/ + register in src/pages/tools/[slug].astro.
 * Navigation, search, categories, sitemap and internal links follow automatically.
 * `intents` are task phrases matched by the intent-based search engine.
 */
export const tools = [
  /* ============================== IMAGES ============================== */
  {
    slug: 'image-compressor',
    name: 'Image Compressor',
    icon: 'compress',
    category: 'images',
    shortDesc: 'Reduce the file size of JPG, PNG and WebP images with a before/after comparison.',
    description:
      'Compress JPG, PNG and WebP images with a quality slider, live before/after comparison, and per-file savings. Batch-friendly: drop up to 40 files at once.',
    keywords: ['compress', 'image', 'reduce', 'size', 'optimize', 'jpg', 'png', 'webp', 'smaller'],
    intents: ['make my photo smaller', 'reduce image size', 'image too large', 'compress photo', 'reduce jpg size', 'shrink image', 'make file smaller', 'optimize image for web', 'image heavy'],
    steps: ['Drop one or more images', 'Adjust quality and watch the savings', 'Compare, then download'],
    faq: [
      { q: 'Are my images uploaded anywhere?', a: 'No. Compression happens entirely in your browser using the Canvas API. Your images never leave your device.' },
      { q: 'Will I lose visible quality?', a: 'You control the quality slider. Around 80% the difference is usually invisible; the built-in before/after comparator lets you check before downloading.' },
      { q: 'Why does my PNG barely shrink?', a: 'PNG is lossless — re-encoding it at a given quality has limited effect. For big savings on photos, convert to WebP or JPG instead.' },
    ],
    seo: `<p>Oversized images slow down websites, fill up cloud storage and fail email attachments. This <strong>image compressor</strong> reduces the weight of <strong>JPG, PNG and WebP</strong> files in seconds, with a quality slider to pick the right balance.</p><p>For every image you get the <strong>size before and after</strong>, the <strong>percentage saved</strong>, and a visual <strong>before/after comparator</strong>. Drop dozens of files at once — everything is processed on your device, nothing is uploaded.</p>`,
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    icon: 'resize',
    category: 'images',
    shortDesc: 'Resize images by exact pixels or percentage, with the aspect ratio locked or free.',
    description:
      'Resize an image to exact width × height or by percentage. Aspect ratio locking, output format choice (JPG, PNG, WebP) and instant preview of the target dimensions.',
    keywords: ['resize', 'image', 'scale', 'dimensions', 'pixels', 'percentage', 'resizer'],
    intents: ['resize image', 'change image dimensions', 'make image smaller dimensions', 'scale photo', 'resize for website', 'resize for instagram', 'shrink dimensions', 'image to 1920'],
    steps: ['Drop your image', 'Set width, height or a percentage', 'Pick the output format and download'],
    faq: [
      { q: 'Is my aspect ratio preserved?', a: 'By default, yes: changing the width updates the height automatically. Unlock the ratio only if you need exact dimensions and accept stretching.' },
      { q: 'Can I enlarge an image without losing quality?', a: 'Upscaling beyond the original size produces a softer image — no tool can invent missing pixels. Downscaling, however, is lossless in practice.' },
      { q: 'Which output format should I pick?', a: 'JPG for photos (small), PNG when you need transparency, WebP for the best quality-to-size ratio on the web.' },
    ],
    seo: `<p>Before publishing, emailing or printing, images often need the right dimensions. This <strong>image resizer</strong> lets you set an exact <strong>width or height</strong> — the other side is computed automatically to <strong>preserve proportions</strong> — or work in <strong>percentages</strong> (50%, 25%…).</p><p>The preview updates instantly, you choose the output format, and the file is generated locally in your browser. No upload, no waiting.</p>`,
  },
  {
    slug: 'jpg-to-webp',
    name: 'JPG to WebP',
    icon: 'img-convert',
    category: 'images',
    shortDesc: 'Convert JPG images to WebP and cut their weight by up to 80%.',
    description:
      'Convert one or many JPG/JPEG images to WebP, right in your browser. Quality control, per-file before/after sizes, individual or ZIP download.',
    keywords: ['jpg', 'jpeg', 'webp', 'convert', 'conversion', 'image'],
    intents: ['convert jpg to webp', 'jpg to webp', 'turn jpeg into webp', 'make jpg smaller', 'webp converter'],
    steps: ['Drop your JPG images', 'Set the conversion quality', 'Download your WebP files, one by one or as a ZIP'],
    faq: [
      { q: 'Are my images sent to a server?', a: 'No. Conversion runs entirely in your browser via the Canvas API. Files never leave your device.' },
      { q: 'What quality should I choose?', a: 'Between 75 and 85% the difference is invisible for most photos while the weight drops significantly. Below 60% you may see artifacts in gradients.' },
      { q: 'Why switch to WebP?', a: 'WebP compresses 25–35% better than JPEG at equal quality and is supported by all modern browsers — a free speed boost for any website.' },
    ],
    seo: `<p>The <strong>WebP</strong> format was built to replace JPEG on the web: equal visual quality, significantly smaller files. Converting photos to WebP is one of the easiest ways to speed up a site or free up storage.</p><p>This converter handles <strong>batch conversion</strong> with a quality slider, per-file before/after sizes, and a one-click <strong>ZIP download</strong>. Everything runs locally — your photos stay private.</p>`,
  },
  {
    slug: 'png-to-webp',
    name: 'PNG to WebP',
    icon: 'img-convert',
    category: 'images',
    shortDesc: 'Convert PNG images to WebP while keeping transparency.',
    description:
      'Convert PNG images to WebP with full transparency (alpha channel) support. Local processing, quality control, batch ZIP download.',
    keywords: ['png', 'webp', 'convert', 'transparency', 'alpha'],
    intents: ['convert png to webp', 'png to webp', 'keep transparency webp', 'webp with alpha'],
    steps: ['Drop your PNG images', 'Choose the output quality', 'Download your WebP files, individually or as a ZIP'],
    faq: [
      { q: 'Is transparency preserved?', a: 'Yes. WebP supports an alpha channel: transparent areas of your PNGs stay transparent after conversion.' },
      { q: 'Is WebP always smaller than PNG?', a: 'For colorful graphics, screenshots and marketing visuals: yes, usually by a wide margin. The tool shows the actual before/after size so you can judge.' },
      { q: 'Can I convert many PNGs at once?', a: 'Yes — add as many files as needed, then use “Download all” to get a single ZIP.' },
    ],
    seo: `<p>PNG is perfect for lossless quality but files get heavy. <strong>WebP</strong> keeps <strong>transparency</strong> while cutting file size dramatically — the ideal replacement for web graphics, cut-out logos and screenshots.</p><p>This converter processes your PNGs <strong>locally in the browser</strong>: no upload, no server copy. Adjust quality and download results one by one or as a ZIP archive.</p>`,
  },
  {
    slug: 'webp-to-jpg',
    name: 'WebP to JPG',
    icon: 'img-convert',
    category: 'images',
    shortDesc: 'Convert WebP images to JPG for maximum compatibility.',
    description:
      'Convert WebP images to JPG universally supported format. Batch conversion, quality control, ZIP download — all local.',
    keywords: ['webp', 'jpg', 'jpeg', 'convert', 'compatibility'],
    intents: ['convert webp to jpg', 'webp to jpg', 'webp to jpeg', 'open webp file', 'webp not supported'],
    steps: ['Drop your WebP images', 'Set the JPG quality', 'Download your JPG files'],
    faq: [
      { q: 'Why convert WebP back to JPG?', a: 'Some older software, printers and platforms still reject WebP. JPG opens everywhere — it is the safest compatibility fallback.' },
      { q: 'What happens to transparency?', a: 'JPG has no transparency: transparent areas are filled with white. If you need transparency, convert to PNG instead.' },
      { q: 'Is the conversion private?', a: 'Yes, it runs fully in your browser. Files are never uploaded.' },
    ],
    seo: `<p>You downloaded a <strong>WebP</strong> image and your software won't open it? Convert it to <strong>JPG</strong> — the most universally supported image format — in two seconds.</p><p>This tool converts <strong>WebP to JPG</strong> in batches, with a quality slider and ZIP download. Conversion runs locally in your browser: nothing is uploaded anywhere.</p>`,
  },
  {
    slug: 'jpg-to-png',
    name: 'JPG to PNG',
    icon: 'img-convert',
    category: 'images',
    shortDesc: 'Convert JPG images to lossless PNG.',
    description:
      'Convert JPG/JPEG images to PNG, the lossless format with transparency support. Batch-friendly, fully local.',
    keywords: ['jpg', 'jpeg', 'png', 'convert', 'lossless'],
    intents: ['convert jpg to png', 'jpg to png', 'jpeg to png', 'make png from photo'],
    steps: ['Drop your JPG images', 'Convert — PNG keeps every pixel', 'Download your PNG files'],
    faq: [
      { q: 'Does converting to PNG improve quality?', a: 'It preserves exactly what is in the JPG, without adding new compression. It cannot restore detail the JPG already lost, but it stops further degradation.' },
      { q: 'Will the file be bigger?', a: 'Usually yes — PNG is lossless. That is the trade: perfect fidelity for more bytes. If size matters more, keep WebP or JPG.' },
      { q: 'Is it processed locally?', a: 'Yes, entirely in your browser.' },
    ],
    seo: `<p>Need a <strong>PNG</strong> for editing, printing or a platform that demands it? Convert your <strong>JPG</strong> files in seconds.</p><p>PNG is <strong>lossless</strong>: the conversion preserves every pixel of the source without further compression. Batch conversion and ZIP download included — and like every tool here, it runs 100% locally.</p>`,
  },
  {
    slug: 'image-rotator',
    name: 'Image Rotator',
    icon: 'rotate',
    category: 'images',
    shortDesc: 'Rotate images by 90° steps and flip them horizontally or vertically.',
    description:
      'Rotate any image by 90°, 180° or 270°, flip it horizontally or vertically, and export as JPG, PNG or WebP. Batch-friendly.',
    keywords: ['rotate', 'image', 'flip', '90 degrees', 'orientation', 'photo'],
    intents: ['rotate image', 'rotate photo 90 degrees', 'fix photo orientation', 'flip image', 'rotate picture', 'image sideways'],
    steps: ['Drop your images', 'Rotate or flip with one click', 'Download the result'],
    faq: [
      { q: 'Is there any quality loss?', a: 'Rotating itself does not degrade the image. Re-encoding to the chosen format at high quality keeps the loss invisible.' },
      { q: 'Can I rotate many photos at once?', a: 'Yes — drop several files, pick the rotation, and download them all as a ZIP.' },
      { q: 'My photo looks sideways only in some apps — why?', a: 'Cameras store orientation in EXIF metadata. This tool rewrites the actual pixels, so the result looks correct everywhere.' },
    ],
    seo: `<p>A photo taken in portrait shows up sideways? Fix it in one click. This <strong>image rotator</strong> turns images by <strong>90°, 180° or 270°</strong> and can <strong>flip</strong> them horizontally or vertically.</p><p>Because the pixels themselves are rewritten (not just EXIF metadata), the result displays correctly in every app, browser and platform. Batch mode and ZIP download included.</p>`,
  },
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    icon: 'crop',
    category: 'images',
    shortDesc: 'Crop images to any ratio — square, 16:9, 4:3 — or a free selection.',
    description:
      'Crop images interactively: drag the selection, pick a preset ratio (square, 16:9, 4:3…) or free crop, then export to JPG, PNG or WebP.',
    keywords: ['crop', 'image', 'cut', 'ratio', 'square', 'avatar', 'photo'],
    intents: ['crop image', 'cut part of image', 'crop to square', 'make avatar', 'crop photo 16:9', 'trim image'],
    steps: ['Drop your image', 'Drag the crop area or pick a ratio', 'Download the cropped image'],
    faq: [
      { q: 'Is the crop destructive?', a: 'Your original file is never modified — the tool creates a new cropped file you download.' },
      { q: 'Can I crop to an exact pixel size?', a: 'Yes: pick a ratio (or free crop), then the output size follows your selection. The dimensions are displayed live.' },
      { q: 'Does it work on mobile?', a: 'Yes — the crop area works with touch, and you can use the preset ratio buttons for speed.' },
    ],
    seo: `<p>Remove the edges, focus on the subject, fit a format: <strong>cropping</strong> is the most common photo edit. This cropper gives you a <strong>draggable selection</strong> with popular <strong>aspect-ratio presets</strong> — square for avatars, 16:9 for covers, 4:3, or completely free.</p><p>The preview is instant and the export runs locally in your browser, in JPG, PNG or WebP.</p>`,
  },
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    icon: 'favicon',
    category: 'images',
    shortDesc: 'Turn one image into a complete favicon set, including a multi-size .ico.',
    description:
      'Upload a logo and get a ready-to-use favicon kit: 16, 32, 48 px inside a real favicon.ico, plus 180 (Apple), 192 and 512 px PNGs, and the HTML snippet.',
    keywords: ['favicon', 'ico', 'generator', 'icon', 'website', 'logo'],
    intents: ['create favicon', 'make favicon', 'favicon generator', 'ico file', 'website icon'],
    steps: ['Drop your logo (square works best)', 'Preview every size', 'Download the kit + HTML snippet'],
    faq: [
      { q: 'What sizes do I actually need?', a: 'favicon.ico (16/32/48) covers all browsers, apple-touch-icon 180 covers iOS, and 192/512 cover Android and PWAs. The kit includes all of them.' },
      { q: 'Is the .ico a real ICO file?', a: 'Yes — a valid multi-size ICO container with PNG-compressed frames, supported by every browser.' },
      { q: 'Should my source image have transparency?', a: 'Ideally yes: a square PNG with transparent background gives the cleanest result at small sizes.' },
    ],
    seo: `<p>Every website needs a <strong>favicon</strong> — the tiny icon in browser tabs, bookmarks and home screens. Generating one properly means producing several sizes in several formats.</p><p>This <strong>favicon generator</strong> does it in one step: upload your logo, and download a complete kit — a real multi-size <strong>favicon.ico</strong>, apple-touch-icon, Android/PWA icons — plus the HTML snippet to paste in your site's <code>&lt;head&gt;</code>.</p>`,
  },

  /* ============================== PDF ============================== */
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    icon: 'merge',
    category: 'pdf',
    shortDesc: 'Combine several PDF files into one document, in the order you choose.',
    description:
      'Merge multiple PDFs into a single file: drag-free reordering with buttons, page counts per document, per-file removal. Local processing with pdf-lib.',
    keywords: ['pdf', 'merge', 'combine', 'join', 'assemble'],
    intents: ['merge pdf', 'combine pdf files', 'join pdfs', 'put pdfs together', 'make one pdf from several'],
    steps: ['Add at least two PDF files', 'Reorder them with the arrows', 'Merge and download the final document'],
    faq: [
      { q: 'Are my PDFs uploaded somewhere?', a: 'No. The merge runs entirely in your browser with the open-source pdf-lib library. Your documents stay on your device.' },
      { q: 'What about password-protected PDFs?', a: 'PDFs locked with a password cannot be merged. The tool flags the offending file so you can remove or unlock it first.' },
      { q: 'Is there a size or file-count limit?', a: 'The practical limit is your device memory. Files up to 50 MB each are accepted; dozens of regular PDFs merge without trouble.' },
    ],
    seo: `<p>Assembling a report and its annexes, monthly invoices, or separate chapters is a task this tool does in seconds — <strong>no software to install</strong>.</p><p>Add your files, <strong>reorder them</strong>, check each document's page count, then merge. The final file is generated locally with the open-source <strong>pdf-lib</strong>: nothing is sent to a server, which makes it safe for confidential documents.</p>`,
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    icon: 'split',
    category: 'pdf',
    shortDesc: 'Extract pages from a PDF or burst every page into separate files.',
    description:
      'Split a PDF two ways: extract a page range (e.g. 1-3, 5, 8-10) into a new PDF, or export every page as its own file in a ZIP.',
    keywords: ['pdf', 'split', 'extract', 'pages', 'separate', 'burst'],
    intents: ['split pdf', 'extract pages from pdf', 'separate pdf pages', 'get one page from pdf', 'cut pdf'],
    steps: ['Drop your PDF', 'Pick pages to extract, or split every page', 'Download the result'],
    faq: [
      { q: 'How do I select pages?', a: 'Use ranges like “1-3, 5, 8-10”. The tool validates the syntax and refuses out-of-range numbers with a clear message.' },
      { q: 'What does “split every page” produce?', a: 'One PDF per page, bundled in a single ZIP archive named page-1.pdf, page-2.pdf, etc.' },
      { q: 'Is it private?', a: 'Yes — the PDF never leaves your browser.' },
    ],
    seo: `<p>You need pages 3 to 5 of a 40-page document? No need for heavyweight software: this <strong>PDF splitter</strong> extracts exactly the pages you list — <strong>“1-3, 5, 8-10”</strong> style — into a new PDF.</p><p>Need every page as a separate file instead? One click bursts the whole document into individual PDFs, delivered as a ZIP. Processing happens entirely in your browser.</p>`,
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    icon: 'pdf-compress',
    category: 'pdf',
    shortDesc: 'Reduce PDF file size — with an honest result, no fake compression.',
    description:
      'Compress a PDF by rebuilding it with optimized object streams and stripped metadata. If the file is already optimal, the tool tells you instead of pretending.',
    keywords: ['pdf', 'compress', 'reduce', 'size', 'optimize', 'shrink'],
    intents: ['compress pdf', 'reduce pdf size', 'pdf too large', 'make pdf smaller', 'shrink pdf', 'pdf for email'],
    steps: ['Drop your PDF', 'Run the compression', 'Download — or read why nothing was gained'],
    faq: [
      { q: 'How does the compression work?', a: 'The document is rebuilt from scratch: redundant objects removed, cross-reference tables and object streams optimized, metadata stripped. Embedded images are kept as-is, so quality never degrades.' },
      { q: 'What if the file does not get smaller?', a: 'Then the tool says so — “already optimized” — and gives you the original back. We would rather be honest than fake a number.' },
      { q: 'Is my document uploaded?', a: 'No, the whole process runs locally with pdf-lib.' },
    ],
    seo: `<p>A PDF too heavy for an email or a form? This <strong>PDF compressor</strong> rebuilds your document with <strong>optimized structures</strong> and <strong>stripped metadata</strong>, which removes bloat without touching your content — text stays text, images keep their original quality.</p><p>And if the file is already optimal, the tool tells you plainly instead of faking a gain. Everything runs in your browser, so even sensitive documents are safe to process.</p>`,
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    icon: 'rotate',
    category: 'pdf',
    shortDesc: 'Rotate every page of a PDF by 90°, 180° or 270°.',
    description:
      'Fix a scanned document that ended up sideways: rotate all pages of a PDF by 90°, 180° or 270° and download the corrected file.',
    keywords: ['pdf', 'rotate', 'orientation', 'pages', 'landscape', 'portrait'],
    intents: ['rotate pdf', 'pdf sideways', 'rotate pdf pages', 'fix pdf orientation'],
    steps: ['Drop your PDF', 'Choose the rotation angle', 'Download the corrected PDF'],
    faq: [
      { q: 'Does it rotate the content or just a flag?', a: 'It sets the official page rotation of each page — the same property PDF viewers use — so the result is correct everywhere, and text remains selectable.' },
      { q: 'Can I rotate a single page?', a: 'V2 rotates all pages at once, which covers the common “scanned document sideways” case. Per-page control is on the roadmap.' },
      { q: 'Is it lossless?', a: 'Yes — nothing is re-rendered or recompressed, the file content is untouched.' },
    ],
    seo: `<p>A scanned contract arrives sideways? This <strong>PDF rotator</strong> turns <strong>every page</strong> by 90°, 180° or 270° in one click.</p><p>The operation is <strong>lossless</strong>: pages are not re-rendered, their official rotation property is rewritten, so text stays selectable and the file keeps its exact quality. As always, processing is 100% local.</p>`,
  },
  {
    slug: 'image-to-pdf',
    name: 'Image to PDF',
    icon: 'img-pdf',
    category: 'pdf',
    shortDesc: 'Turn one or more images into a single PDF document.',
    description:
      'Create a PDF from JPG, PNG or WebP images: reorder pages, choose orientation, page size and margins. Generated 100% locally with pdf-lib.',
    keywords: ['pdf', 'image', 'jpg', 'png', 'convert', 'document'],
    intents: ['image to pdf', 'convert image to pdf', 'jpg to pdf', 'photos into pdf', 'make pdf from pictures', 'turn image into pdf'],
    steps: ['Add your images in order', 'Choose orientation, page size and margins', 'Generate and download your PDF'],
    faq: [
      { q: 'Can I change the page order?', a: 'Yes. Reorder thumbnails with the arrow buttons: the PDF follows the displayed order exactly.' },
      { q: 'Which image formats are accepted?', a: 'JPG, PNG and WebP. Other browser-readable formats are converted to PNG on the fly.' },
      { q: 'Is image quality preserved?', a: 'Yes. JPG and PNG images are embedded natively without recompression when you use the “fit to image” page size.' },
    ],
    seo: `<p>Scanned invoices, photographed notes, mood boards: turning images into a single shareable document is a daily need.</p><p>This tool assembles your images into <strong>one PDF</strong>, in the order you choose. You control <strong>orientation</strong> (portrait or landscape), <strong>page size</strong> (A4, Letter, or fitted to each image) and <strong>margins</strong>. Generation uses the open-source pdf-lib, entirely in your browser.</p>`,
  },
  {
    slug: 'pdf-to-image',
    name: 'PDF to Image',
    icon: 'pdf-img',
    category: 'pdf',
    shortDesc: 'Render PDF pages as high-quality PNG images.',
    description:
      'Convert each page of a PDF into a crisp PNG image, at 1× or 2× resolution. Download pages individually or as a ZIP.',
    keywords: ['pdf', 'image', 'png', 'convert', 'render', 'jpg'],
    intents: ['pdf to image', 'pdf to png', 'pdf to jpg', 'convert pdf pages to pictures', 'extract pdf as image'],
    steps: ['Drop your PDF', 'Choose the resolution', 'Download the pages as PNG'],
    faq: [
      { q: 'What resolution do I get?', a: '1× renders at 96 DPI (screen), 2× at 192 DPI (print-friendly). 2× is the best choice for most uses.' },
      { q: 'Why PNG and not JPG?', a: 'PNG keeps text razor-sharp with no compression artifacts. If you need JPG, run the result through our PNG to JPG-style converters — or compress it.' },
      { q: 'Is the rendering local?', a: 'Yes — pages are rendered in your browser with the open-source PDF.js engine, loaded on demand.' },
    ],
    seo: `<p>Sending a PDF page to someone who can only handle images, or embedding a page into a presentation? This tool <strong>renders every PDF page as a PNG</strong>, crisp at 1× or 2× resolution.</p><p>Rendering uses the open-source <strong>PDF.js</strong> engine — loaded only when you use this tool — and happens entirely on your device.</p>`,
  },

  /* ============================== TEXT ============================== */
  {
    slug: 'word-counter',
    name: 'Word Counter',
    icon: 'counter',
    category: 'text',
    shortDesc: 'Count words, characters, sentences, paragraphs and reading time in real time.',
    description:
      'Paste or type your text and get live stats: words, characters, characters without spaces, sentences, paragraphs, lines and estimated reading time.',
    keywords: ['words', 'characters', 'count', 'text', 'sentences', 'paragraphs', 'reading time'],
    intents: ['count words', 'how many words', 'character count', 'word counter', 'count characters', 'essay length'],
    steps: ['Paste or type your text', 'Read the live statistics', 'Copy or clear with one click'],
    faq: [
      { q: 'How are words counted?', a: 'A word is a run of letters and digits. Apostrophes and hyphens inside a word keep it together — “don’t” and “well-known” each count as one word, matching most English writing tools.' },
      { q: 'Is the reading time reliable?', a: 'It is estimated at about 200 words per minute, the average silent reading speed. Treat it as a useful ballpark for essays, articles and speeches.' },
      { q: 'Is my text saved?', a: 'No. Counting happens live in your browser; nothing is sent or stored. Refreshing the page clears the content.' },
    ],
    seo: `<p>Writing an essay, cover letter or post with a length constraint? This <strong>word counter</strong> shows <strong>words, characters, characters without spaces, sentences, paragraphs and lines</strong> in real time, plus an estimated <strong>reading time</strong>.</p><p>Counting is instant — no button to press — and the text never leaves your browser, which makes it safe for sensitive documents too.</p>`,
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    icon: 'case',
    category: 'text',
    shortDesc: 'UPPERCASE, lowercase, Title Case, camelCase, snake_case and more.',
    description:
      'Convert text between cases instantly: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case.',
    keywords: ['case', 'uppercase', 'lowercase', 'title case', 'camelcase', 'capitalize'],
    intents: ['convert case', 'uppercase text', 'lowercase', 'title case', 'capitalize', 'camel case', 'snake case'],
    steps: ['Paste your text', 'Pick a case', 'Copy the result'],
    faq: [
      { q: 'How does Title Case work?', a: 'Every word is capitalized — a simple, predictable rule suited to headings. For strict style-guide title case, minor words may need manual tweaks.' },
      { q: 'What about camelCase and friends?', a: 'Words are detected by spaces, punctuation and case boundaries: “Hello World!” becomes helloWorld (camel), HelloWorld (Pascal), hello_world (snake), hello-world (kebab).' },
    ],
    seo: `<p>Fixing a pasted headline, naming a variable, cleaning a dataset: <strong>case conversion</strong> is a constant little chore. This tool converts your text to <strong>UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case or kebab-case</strong> instantly, as you type.</p>`,
  },
  {
    slug: 'sort-lines',
    name: 'Sort Lines',
    icon: 'sort',
    category: 'text',
    shortDesc: 'Sort lines alphabetically, reverse, or numerically — with one click.',
    description:
      'Sort the lines of any text: A→Z, Z→A, or numeric. Optional case-insensitive mode and trimming of extra spaces.',
    keywords: ['sort', 'lines', 'alphabetical', 'order', 'list'],
    intents: ['sort lines', 'alphabetize', 'sort list', 'order alphabetically', 'sort names'],
    steps: ['Paste your list', 'Choose the sort order', 'Copy the sorted result'],
    faq: [
      { q: 'How are accents and case handled?', a: 'Sorting uses locale-aware comparison, so é sits next to e. The case-insensitive option ignores capitalization entirely.' },
      { q: 'What does numeric sort do?', a: 'Lines are ordered by the first number they contain — perfect for “item 2, item 10” lists where alphabetical would put 10 before 2.' },
    ],
    seo: `<p>Alphabetize a guest list, order log lines, rank a dataset column: paste your text, pick <strong>A→Z, Z→A or numeric</strong>, and copy the sorted result. Optional <strong>case-insensitive</strong> and <strong>trim</strong> modes handle messy inputs.</p>`,
  },
  {
    slug: 'remove-duplicate-lines',
    name: 'Remove Duplicate Lines',
    icon: 'dedupe',
    category: 'text',
    shortDesc: 'Delete duplicate lines from any text, keeping the first occurrence.',
    description:
      'Clean a list by removing duplicate lines. Optional case-insensitive matching, trim, and blank-line removal — with a live count of removed duplicates.',
    keywords: ['duplicates', 'remove', 'unique', 'lines', 'dedupe', 'list'],
    intents: ['remove duplicates', 'dedupe', 'unique lines', 'delete duplicate lines', 'clean list'],
    steps: ['Paste your list', 'Remove duplicates', 'Copy the unique result'],
    faq: [
      { q: 'Which occurrence is kept?', a: 'The first one. Order of the remaining lines is preserved.' },
      { q: 'Can “Apple” and “apple” be considered equal?', a: 'Yes — enable the case-insensitive option.' },
      { q: 'Does it remove empty lines?', a: 'Optionally. Toggle “remove blank lines” to strip them in the same pass.' },
    ],
    seo: `<p>Mailing lists, log files, keyword sheets: duplicates sneak in everywhere. Paste your text and get back only the <strong>unique lines</strong> — first occurrence kept, order preserved — with optional <strong>case-insensitive</strong> matching and blank-line removal. The tool tells you exactly how many duplicates were removed.</p>`,
  },

  /* ============================== DEVELOPER ============================== */
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    icon: 'json',
    category: 'developer',
    shortDesc: 'Format, validate and minify JSON with precise error messages.',
    description:
      'Beautify JSON with 2 or 4 spaces, minify it, and get line-accurate validation errors when the input is broken.',
    keywords: ['json', 'formatter', 'validator', 'beautify', 'minify', 'pretty print'],
    intents: ['format json', 'json formatter', 'validate json', 'pretty print json', 'minify json', 'json error'],
    steps: ['Paste your JSON', 'Format, minify or validate', 'Copy the result'],
    faq: [
      { q: 'Where do error positions point?', a: 'Errors report the line and column of the problem, extracted from the parser — “position 124” becomes line 5, column 12.' },
      { q: 'Is my data sent anywhere?', a: 'No. Formatting is pure browser JavaScript; nothing leaves the page.' },
      { q: 'Does it handle big files?', a: 'Yes, comfortably into several megabytes — formatting is a single fast pass.' },
    ],
    seo: `<p>Paste raw JSON, get it <strong>pretty-printed</strong> with your preferred indentation — or <strong>minified</strong> for production. When the input is broken, the validator points at the exact <strong>line and column</strong> of the mistake instead of failing silently. Pure client-side: your data never leaves the page.</p>`,
  },
  {
    slug: 'base64-encode-decode',
    name: 'Base64 Encoder / Decoder',
    icon: 'base64',
    category: 'developer',
    shortDesc: 'Encode text to Base64 and decode it back — UTF-8 safe.',
    description:
      'Two-way Base64 conversion with full Unicode support, URL-safe output option and instant error detection on invalid input.',
    keywords: ['base64', 'encode', 'decode', 'converter', 'utf-8'],
    intents: ['base64 encode', 'base64 decode', 'convert to base64', 'decode base64 string'],
    steps: ['Paste your text or Base64', 'Encode or decode', 'Copy the result'],
    faq: [
      { q: 'Does it support emojis and accents?', a: 'Yes. Text is UTF-8 encoded before Base64, so every Unicode character survives the round-trip.' },
      { q: 'What is URL-safe Base64?', a: 'It replaces “+” and “/” with “-” and “_” so the result can sit in URLs without escaping.' },
      { q: 'Is Base64 encryption?', a: 'No — it is an encoding, trivially reversible. Never use it to protect secrets.' },
    ],
    seo: `<p>Embedding data in a URL, an email or a data URI? <strong>Base64</strong> is the standard answer. This tool <strong>encodes and decodes</strong> with full <strong>UTF-8</strong> support (accents, emojis, CJK), an optional <strong>URL-safe</strong> output, and a clear error when the input is not valid Base64. Nothing is transmitted — conversion runs in your browser.</p>`,
  },
  {
    slug: 'url-encode-decode',
    name: 'URL Encoder / Decoder',
    icon: 'url',
    category: 'developer',
    shortDesc: 'Percent-encode or decode URLs and query strings safely.',
    description:
      'Encode any text for safe use in URLs (percent-encoding), or decode a percent-encoded string back. Component and full-URL modes.',
    keywords: ['url', 'encode', 'decode', 'percent encoding', 'query string', 'uri'],
    intents: ['url encode', 'url decode', 'percent encode', 'encode query string', 'escape url'],
    steps: ['Paste your text or URL', 'Encode or decode', 'Copy the result'],
    faq: [
      { q: 'What is the difference between component and full URL mode?', a: 'Component mode encodes everything (for a query-string value). Full-URL mode keeps structural characters like : / ? & = intact.' },
      { q: 'Why does decoding fail sometimes?', a: 'A lone “%” or a malformed escape like “%ZZ” is invalid percent-encoding — the tool reports it instead of guessing.' },
    ],
    seo: `<p>Spaces, accents and symbols break URLs unless they are <strong>percent-encoded</strong>. Paste any value and get a URL-safe string — or paste an encoded string and read it back. Two modes: <strong>component</strong> (encode everything) and <strong>full URL</strong> (keep the structure readable). Fully client-side.</p>`,
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    icon: 'uuid',
    category: 'developer',
    shortDesc: 'Generate v4 UUIDs with the browser cryptographic RNG — one or a thousand.',
    description:
      'Generate RFC 4122 version-4 UUIDs using crypto.randomUUID(). Single or batch mode (up to 1000), uppercase/hyphen options, copy all.',
    keywords: ['uuid', 'guid', 'generator', 'random', 'v4', 'unique id'],
    intents: ['generate uuid', 'uuid generator', 'generate guid', 'random unique id'],
    steps: ['Choose how many you need', 'Generate', 'Copy one or all'],
    faq: [
      { q: 'Are these truly random?', a: 'They use the browser cryptographic generator (crypto.randomUUID), the same source used for TLS session keys — vastly better than Math.random().' },
      { q: 'Can two UUIDs collide?', a: 'Version 4 UUIDs have 122 random bits; generating a billion of them gives a collision probability around one in 10^27. For practical purposes: never.' },
      { q: 'Batch mode?', a: 'Up to 1000 at once, one per line, ready to copy.' },
    ],
    seo: `<p>Need a unique identifier for a database row, a test fixture or a message ID? This <strong>UUID generator</strong> produces standard <strong>v4 UUIDs</strong> with the browser's <strong>cryptographic RNG</strong> — individually or <strong>a thousand at once</strong>. Optional uppercase and no-hyphen formats. Generated locally, never transmitted.</p>`,
  },
  {
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    icon: 'clock',
    category: 'developer',
    shortDesc: 'Unix timestamp to human date and back — seconds and milliseconds.',
    description:
      'Convert Unix timestamps to readable dates (local + UTC) and dates to timestamps. Auto-detects seconds vs milliseconds, shows “now” live.',
    keywords: ['timestamp', 'unix', 'epoch', 'converter', 'date', 'time'],
    intents: ['timestamp converter', 'unix to date', 'epoch converter', 'convert timestamp', 'what date is this timestamp'],
    steps: ['Paste a timestamp or pick a date', 'Read both directions at once', 'Copy what you need'],
    faq: [
      { q: 'Seconds or milliseconds — do I need to know?', a: 'No. The tool auto-detects: values above 10^12 are treated as milliseconds, smaller ones as seconds.' },
      { q: 'Which timezone is used?', a: 'Both are shown: your local timezone and UTC. The current timestamp ticks live at the top.' },
    ],
    seo: `<p>1730000000 — what date is that? Paste any <strong>Unix timestamp</strong> and read it instantly in <strong>local time and UTC</strong>, or pick a date and get its timestamp. Seconds and milliseconds are <strong>auto-detected</strong>, and the current epoch ticks live on the page. Useful daily for developers debugging logs, APIs and databases.</p>`,
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    icon: 'regex',
    category: 'developer',
    shortDesc: 'Test regular expressions live, with highlighted matches and capture groups.',
    description:
      'Live regex testing: matches highlighted in the subject text, match list with indices, capture-group breakdown, and friendly syntax-error messages.',
    keywords: ['regex', 'regular expression', 'test', 'match', 'pattern', 'groups'],
    intents: ['regex tester', 'test regex', 'regular expression', 'check regex pattern', 'regex match'],
    steps: ['Write your pattern', 'Paste the subject text', 'Inspect matches and groups'],
    faq: [
      { q: 'Which flags are supported?', a: 'g, i, m, s, u and d — toggled with checkboxes, no manual flag string needed.' },
      { q: 'What if my pattern has a syntax error?', a: 'The error is caught and shown in plain language with the offending position — no red wall of stack trace.' },
      { q: 'Is it safe for huge texts?', a: 'Matching runs in your browser; very large subjects work but pathological patterns can be slow — that is inherent to regex, not to this tool.' },
    ],
    seo: `<p>Write a pattern, paste your text, see <strong>every match highlighted</strong> instantly. The tester lists each match with its <strong>indices</strong> and <strong>capture groups</strong>, supports all standard <strong>flags</strong>, and turns syntax errors into readable messages. Everything runs locally in your browser.</p>`,
  },

  /* ============================== CALCULATORS ============================== */
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    icon: 'percent',
    category: 'calculators',
    shortDesc: 'Five modes: X% of Y, proportion, change, discount, increase.',
    description:
      'Calculate instantly: X% of Y, what percent X is of Y, percentage change, or apply a discount/increase. Result as you type, formula shown.',
    keywords: ['percentage', 'calculator', 'percent', 'discount', 'increase', 'proportion'],
    intents: ['calculate percentage', 'percent of', 'percentage calculator', 'calculate discount', 'percent change', 'how much is 20 percent'],
    steps: ['Choose the mode', 'Type your two numbers', 'Read the result instantly'],
    faq: [
      { q: 'How do I calculate X% of Y?', a: 'Multiply Y by X and divide by 100. Example: 20% of 150 = 150 × 20 ÷ 100 = 30. That is exactly what the “X% of Y” mode does.' },
      { q: 'How is percentage change computed?', a: '(final − initial) ÷ initial × 100. From 80 to 100 gives +25%; from 100 to 80 gives −20%.' },
      { q: 'Are results rounded?', a: 'Displayed with sensible precision (up to 4 meaningful decimals); the internal calculation is never rounded.' },
    ],
    seo: `<p>Sales, VAT, tips, statistics, grades: <strong>percentages</strong> are everywhere, and the formula shifts with the context. This calculator groups the <strong>five situations people actually need</strong>: value of a percentage, proportion, change, discount, increase.</p><p>The result appears <strong>while you type</strong>, with the formula spelled out — so you understand the calculation instead of just copying it.</p>`,
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    icon: 'unit',
    category: 'calculators',
    shortDesc: 'Length, weight, temperature, data, volume and speed — converted live.',
    description:
      'Convert between metric and imperial units across six categories: length, weight, temperature, data storage, volume and speed. Live, bidirectional.',
    keywords: ['unit', 'converter', 'metric', 'imperial', 'length', 'weight', 'temperature', 'km to miles'],
    intents: ['convert units', 'km to miles', 'pounds to kg', 'celsius to fahrenheit', 'gb to mb', 'unit converter', 'inches to cm'],
    steps: ['Pick a category', 'Type a value on either side', 'Read the conversion both ways'],
    faq: [
      { q: 'Which direction does it convert?', a: 'Both — type in either field and the other updates. No “from/to” swapping.' },
      { q: 'How is temperature handled?', a: 'With real formulas (°C ↔ °F ↔ K), not simple factors — so 0 °C correctly gives 32 °F.' },
      { q: 'Data units: 1000 or 1024?', a: 'Storage units use the industry convention: 1 MB = 1000 KB (decimal), matching what drives and cloud providers advertise.' },
    ],
    seo: `<p>Kilometers to miles, pounds to kilograms, Celsius to Fahrenheit, gigabytes to megabytes: this <strong>unit converter</strong> covers the six categories people actually use — <strong>length, weight, temperature, data, volume, speed</strong> — in both directions at once, with metric and imperial systems side by side.</p>`,
  },
  {
    slug: 'date-calculator',
    name: 'Date Calculator',
    icon: 'calendar',
    category: 'calculators',
    shortDesc: 'Difference between two dates, or add/subtract days, months and years.',
    description:
      'Two calculators in one: the exact difference between two dates (days, weeks, months, years), and date arithmetic — add or subtract days, months, years.',
    keywords: ['date', 'calculator', 'difference', 'days between', 'add days', 'duration'],
    intents: ['days between dates', 'date difference', 'add days to date', 'how many days until', 'date calculator', 'how long between'],
    steps: ['Pick difference or add/subtract mode', 'Enter your dates', 'Read the breakdown'],
    faq: [
      { q: 'How are months counted?', a: 'Calendar months: from Jan 15 to Mar 10 is 1 month and the remaining days, matching how humans talk about durations.' },
      { q: 'Does it handle leap years?', a: 'Yes — everything is computed with real calendar arithmetic, including leap years and month lengths.' },
      { q: 'Can I count business days?', a: 'V2 gives calendar days; business-day mode is a planned addition.' },
    ],
    seo: `<p>“How many days until the deadline?”, “What date is 90 days from today?” This <strong>date calculator</strong> answers both families of questions: the <strong>difference between two dates</strong> broken into years, months, weeks and days — and <strong>date arithmetic</strong>, adding or subtracting days, months or years from any date. Real calendar math, leap years included.</p>`,
  },

  /* ============================== UTILITIES & SECURITY ============================== */
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    icon: 'qr',
    category: 'utilities',
    shortDesc: 'Live QR codes for links, text, email, phone and Wi-Fi — PNG or SVG export.',
    description:
      'Generate a customized QR code in real time: URL, text, email, phone, SMS or Wi-Fi. Colors, size, margin and error-correction level. Export PNG or SVG.',
    keywords: ['qr', 'qrcode', 'qr code', 'generator', 'make qr'],
    intents: ['create qr code', 'qr code generator', 'make a qr', 'generate qr', 'qr for wifi', 'qr for link'],
    steps: ['Choose the content type and type it in', 'Customize colors, size and correction', 'Download PNG or SVG'],
    faq: [
      { q: 'Does the QR code expire?', a: 'No. A static QR code encodes its content directly: it depends on no external service and stays readable forever.' },
      { q: 'What is the error-correction level?', a: 'It controls how much of the code can be damaged or covered while staying scannable. M (15%) fits almost all cases; pick Q or H for small prints or codes overlaid with a logo.' },
      { q: 'PNG or SVG?', a: 'PNG for immediate use (web, slides). SVG is vector: sharp at any size, ideal for print.' },
    ],
    seo: `<p>A <strong>QR code</strong> shares a link, an email address, a phone number or a Wi-Fi access instantly. This generator builds yours <strong>in real time, while you type</strong>.</p><p>Customize colors, size, quiet zone and <strong>error-correction level</strong>, then export as <strong>PNG</strong> (web) or <strong>SVG</strong> (print, infinite scaling). The code is drawn in your browser: the content is never sent anywhere, and your QR code depends on no platform that could expire.</p>`,
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    icon: 'password',
    category: 'security',
    shortDesc: 'Strong random passwords with crypto.getRandomValues() — never sent anywhere.',
    description:
      'Generate strong, random passwords: adjustable length, uppercase, digits, symbols, ambiguous-character exclusion. Entropy meter and one-click copy. 100% local.',
    keywords: ['password', 'generator', 'random', 'strong', 'secure'],
    intents: ['generate password', 'password generator', 'strong password', 'random password', 'create password'],
    steps: ['Set length and character sets', 'Generate', 'Copy and store it in a manager'],
    faq: [
      { q: 'Is the password truly random?', a: 'Yes — it uses the browser cryptographic API (crypto.getRandomValues), the same source of randomness as TLS, not a pseudo-random function like Math.random().' },
      { q: 'Is my password sent anywhere?', a: 'Never. Generation happens in your browser; the password is written to no log, storage or server. The tool even works offline.' },
      { q: 'How long should my password be?', a: 'At least 12 characters for regular accounts, 16+ for sensitive ones. A 16-character password mixing all sets exceeds 90 bits of entropy — out of brute-force reach.' },
    ],
    seo: `<p>Short, reused passwords are the number one cause of account takeovers. The fix: <strong>long, random, unique passwords</strong> for every service — exactly what this generator produces.</p><p>Generation relies on <strong>crypto.getRandomValues()</strong>, the browser cryptographic RNG, and each draw guarantees at least one character from every selected set. The <strong>entropy meter</strong> shows the real strength in bits. Everything stays local: the password is neither transmitted nor stored.</p>`,
  },
];

export function getTool(slug) {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(categorySlug) {
  return tools.filter((t) => t.category === categorySlug);
}

export function getRelatedTools(tool, count = 4) {
  const sameCat = tools.filter((t) => t.category === tool.category && t.slug !== tool.slug);
  const others = tools.filter((t) => t.category !== tool.category);
  return [...sameCat, ...others].slice(0, count);
}

/** Curated “Popular” quick actions — task-oriented, links to real tools. */
export const popularActions = [
  { label: 'Compress an image', slug: 'image-compressor', icon: 'compress' },
  { label: 'Convert JPG to WebP', slug: 'jpg-to-webp', icon: 'img-convert' },
  { label: 'Resize an image', slug: 'image-resizer', icon: 'resize' },
  { label: 'Merge PDFs', slug: 'merge-pdf', icon: 'merge' },
  { label: 'Compress a PDF', slug: 'compress-pdf', icon: 'pdf-compress' },
  { label: 'Create a QR code', slug: 'qr-code-generator', icon: 'qr' },
  { label: 'Convert image to PDF', slug: 'image-to-pdf', icon: 'img-pdf' },
  { label: 'Generate a password', slug: 'password-generator', icon: 'password' },
];

/** What-next suggestions shown after a result, keyed by tool slug. */
export const nextSteps = {
  'image-compressor': [
    { slug: 'jpg-to-webp', label: 'Convert to WebP' },
    { slug: 'image-resizer', label: 'Resize it' },
    { slug: 'image-to-pdf', label: 'Make a PDF' },
  ],
  'image-resizer': [
    { slug: 'image-compressor', label: 'Compress it' },
    { slug: 'jpg-to-webp', label: 'Convert to WebP' },
    { slug: 'image-cropper', label: 'Crop it' },
  ],
  'jpg-to-webp': [
    { slug: 'image-compressor', label: 'Compress further' },
    { slug: 'image-resizer', label: 'Resize it' },
    { slug: 'image-to-pdf', label: 'Make a PDF' },
  ],
  'png-to-webp': [
    { slug: 'image-compressor', label: 'Compress further' },
    { slug: 'image-resizer', label: 'Resize it' },
  ],
  'webp-to-jpg': [
    { slug: 'image-compressor', label: 'Compress it' },
    { slug: 'image-resizer', label: 'Resize it' },
  ],
  'jpg-to-png': [
    { slug: 'image-compressor', label: 'Compress it' },
    { slug: 'image-cropper', label: 'Crop it' },
  ],
  'image-rotator': [
    { slug: 'image-cropper', label: 'Crop it' },
    { slug: 'image-compressor', label: 'Compress it' },
  ],
  'image-cropper': [
    { slug: 'image-compressor', label: 'Compress it' },
    { slug: 'favicon-generator', label: 'Make a favicon' },
  ],
  'merge-pdf': [
    { slug: 'compress-pdf', label: 'Compress the result' },
    { slug: 'split-pdf', label: 'Split it again' },
  ],
  'split-pdf': [
    { slug: 'merge-pdf', label: 'Merge PDFs' },
    { slug: 'pdf-to-image', label: 'Pages to images' },
  ],
  'compress-pdf': [
    { slug: 'merge-pdf', label: 'Merge PDFs' },
    { slug: 'split-pdf', label: 'Extract pages' },
  ],
  'rotate-pdf': [
    { slug: 'merge-pdf', label: 'Merge PDFs' },
    { slug: 'compress-pdf', label: 'Compress it' },
  ],
  'image-to-pdf': [
    { slug: 'compress-pdf', label: 'Compress the PDF' },
    { slug: 'merge-pdf', label: 'Merge with other PDFs' },
  ],
  'pdf-to-image': [
    { slug: 'image-compressor', label: 'Compress the images' },
    { slug: 'merge-pdf', label: 'Merge PDFs' },
  ],
  'favicon-generator': [{ slug: 'image-resizer', label: 'Resize another icon' }],
};
