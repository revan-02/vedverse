async function testApi() {
  console.log('--- Testing Live /api/ask with Question 1 (Anger) ---');
  const res1 = await fetch('http://localhost:3000/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'What do the Vedas say about controlling anger?' })
  });
  const data1 = await res1.json();
  console.log('Direct Answer Exists:', data1.data.direct_answer_exists);
  console.log('Confidence:', data1.data.confidence);
  console.log('Citations Verified:', data1.data.citations_verified);
  console.log('Primary Sources:', data1.data.primary_sources.map(p => p.canonical_ref));
  console.log('Detected Concepts:', data1.data.detected_concepts.map(c => c.title));
  console.log('Traditional Commentaries count:', data1.data.traditional_interpretations.length);

  console.log('\n--- Testing Live /api/ask with Question 2 (Software Engineering) ---');
  const res2 = await fetch('http://localhost:3000/api/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: 'What does the Vedas say about choosing a software engineering career?' })
  });
  const data2 = await res2.json();
  console.log('Direct Answer Exists:', data2.data.direct_answer_exists);
  console.log('No-Direct-Answer Disclaimer:', data2.data.no_direct_answer_disclaimer);
  console.log('Confidence:', data2.data.confidence);
  console.log('Grounded Broader Passages:', data2.data.primary_sources.map(p => p.canonical_ref));
  console.log('Detected Concepts:', data2.data.detected_concepts.map(c => c.title));
  console.log('Modern Application Label:', data2.data.modern_application.slice(0, 100));

  console.log('\n--- Testing Live /api/admin Telemetry ---');
  // Login as admin
  const loginRes = await fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', email: 'admin@vedaverse.org', password: 'vedaverse123' })
  });
  const cookie = loginRes.headers.get('set-cookie');
  const adminRes = await fetch('http://localhost:3000/api/admin', {
    headers: { cookie: cookie || '' }
  });
  const adminData = await adminRes.json();
  console.log('Admin Stats:', adminData.stats);
  console.log('Knowledge Gaps Logged:', adminData.knowledgeGaps.length);
  console.log('First Knowledge Gap:', adminData.knowledgeGaps[0]?.query_text);
}

testApi().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
