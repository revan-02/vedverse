const pages = [
  '/',
  '/ask',
  '/library',
  '/library/rigveda/RV-3.62.10',
  '/concepts',
  '/concepts/dharma',
  '/sanskrit',
  '/compare',
  '/daily',
  '/mantras',
  '/learn',
  '/learn/what-are-the-vedas',
  '/research',
  '/journey',
  '/login',
  '/admin'
];

async function checkPages() {
  console.log('Testing all frontend pages for HTTP 200 status...\n');
  let okCount = 0;
  for (const page of pages) {
    try {
      const res = await fetch(`http://localhost:3000${page}`);
      if (res.status === 200) {
        console.log(`✅ [200 OK] ${page}`);
        okCount++;
      } else {
        console.log(`⚠️ [${res.status}] ${page}`);
      }
    } catch (e) {
      console.error(`❌ [ERR] ${page} - ${e.message}`);
    }
  }
  console.log(`\nPages checked: ${pages.length}, OK: ${okCount}`);
  if (okCount === pages.length) {
    console.log('🏆 ALL PAGES RESPOND WITH 200 OK!');
  }
}

checkPages();
