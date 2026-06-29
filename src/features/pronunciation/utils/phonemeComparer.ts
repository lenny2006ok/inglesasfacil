import { doubleMetaphone } from 'double-metaphone';
import { distance as levenshtein } from 'fastest-levenshtein';

export interface WordScore {
  word: string;
  expected: string;
  recognized: string;
  phonemeMatch: boolean;
  similarity: number; // 0.0 - 1.0
  status: 'correct' | 'partial' | 'incorrect';
}

export function scorePronunciation(expected: string, recognized: string): {
  overallScore: number;
  wordScores: WordScore[];
} {
  // Limpar pontuação e transformar em minúsculas
  const normalize = (text: string) => text.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  const expectedWords = normalize(expected).split(/\s+/).filter(w => w.length > 0);
  const recognizedWords = normalize(recognized).split(/\s+/).filter(w => w.length > 0);

  if (expectedWords.length === 0) return { overallScore: 0, wordScores: [] };

  const wordScores: WordScore[] = expectedWords.map((expWord, i) => {
    // Tenta casar com a palavra na mesma posição
    const recWord = recognizedWords[i] || '';
    
    // Comparação fonética (Double Metaphone) - Pega a fonética primária
    const [expPhoneme] = doubleMetaphone(expWord);
    const [recPhoneme] = doubleMetaphone(recWord);
    const phonemeMatch = !!(expPhoneme && recPhoneme && expPhoneme === recPhoneme);

    // Similaridade textual baseada em Distância de Levenshtein
    const maxLen = Math.max(expWord.length, recWord.length);
    const similarity = maxLen > 0 ? 1 - (levenshtein(expWord, recWord) / maxLen) : 0;

    // Se o som bate, damos um bônus. Se não, penalizamos.
    let combinedScore = similarity;
    if (phonemeMatch) {
      combinedScore = Math.max(0.75, similarity); // Se o som é igual, no mínimo 75%
    } else {
      combinedScore = similarity * 0.7; // Penalidade por errar a fonética
    }

    return {
      word: expWord,
      expected: expWord,
      recognized: recWord,
      phonemeMatch,
      similarity: combinedScore,
      status: combinedScore >= 0.8 ? 'correct' : combinedScore >= 0.5 ? 'partial' : 'incorrect',
    };
  });

  const overallScore = wordScores.reduce((sum, ws) => sum + ws.similarity, 0) / wordScores.length;

  return { overallScore, wordScores };
}
