// Ollama Integration Layer for VedaVerse RAG Pipeline

export interface OllamaGenerateOptions {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  format?: 'json' | undefined;
}

let isOllamaOnline: boolean | null = null;
let lastOllamaCheck = 0;

export async function checkOllamaAvailable(): Promise<boolean> {
  const now = Date.now();
  // Cache availability check for 10 seconds
  if (isOllamaOnline !== null && now - lastOllamaCheck < 10000) {
    return isOllamaOnline;
  }
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(600) });
    isOllamaOnline = res.ok;
  } catch {
    isOllamaOnline = false;
  }
  lastOllamaCheck = now;
  return isOllamaOnline;
}

export async function getAvailableOllamaModels(): Promise<string[]> {
  const available = await checkOllamaAvailable();
  if (!available) return [];
  try {
    const res = await fetch('http://127.0.0.1:11434/api/tags', { signal: AbortSignal.timeout(1000) });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models || []).map((m: any) => m.name);
  } catch {
    return [];
  }
}

let cachedPreferredModel: string | null = null;

export async function getPreferredOllamaModel(): Promise<string> {
  if (cachedPreferredModel) return cachedPreferredModel;
  const models = await getAvailableOllamaModels();
  // Prefer qwen:latest for fast inference, then llama3:latest
  if (models.includes('qwen:latest')) {
    cachedPreferredModel = 'qwen:latest';
  } else if (models.includes('llama3:latest')) {
    cachedPreferredModel = 'llama3:latest';
  } else if (models.includes('mistral:latest')) {
    cachedPreferredModel = 'mistral:latest';
  } else if (models.length > 0) {
    cachedPreferredModel = models[0];
  } else {
    cachedPreferredModel = 'llama3:latest';
  }
  return cachedPreferredModel;
}

export async function generateWithOllama(options: OllamaGenerateOptions): Promise<string | null> {
  const isOnline = await checkOllamaAvailable();
  if (!isOnline) {
    return null;
  }
  const modelToUse = options.model || (await getPreferredOllamaModel());
  const { prompt, systemPrompt, temperature = 0.2, format } = options;

  try {
    const bodyObj: any = {
      model: modelToUse,
      prompt,
      system: systemPrompt || 'You are VedaVerse AI, a rigorous scholarly assistant grounded strictly in verified Vedic and classical Indian texts. Never fabricate verses or citations. Maintain clear distinction between textual evidence, traditional commentary, and modern application.',
      stream: false,
      options: {
        temperature
      }
    };
    if (format === 'json') {
      bodyObj.format = 'json';
    }

    const res = await fetch('http://127.0.0.1:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyObj),
      signal: AbortSignal.timeout(30000) // 30s timeout
    });

    if (!res.ok) {
      console.warn(`Ollama responded with status: ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data.response ? data.response.trim() : null;
  } catch (error: any) {
    console.warn('Ollama generation error or timeout:', error.message);
    return null;
  }
}

