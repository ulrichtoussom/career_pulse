// backend/prompts/quizPrompt.js
// Prompts pour la génération du quiz et des questions d'entretien

/**
 * Génère un quiz de 15 questions à difficulté progressive.
 * 5 easy · 5 medium · 5 hard
 */
export const getQuizPrompt = (cvContext, jobContext) => `
Tu es un expert en évaluation de compétences et en recrutement tech.

PROFIL DU CANDIDAT :
${cvContext || 'Non fourni — génère des questions générales sur le poste'}

OFFRE D'EMPLOI :
${jobContext}

Génère EXACTEMENT 15 questions de quiz pour évaluer la compatibilité du candidat avec ce poste.
Répartition OBLIGATOIRE : 5 questions "easy" (d'abord), 5 "medium", 5 "hard" (en dernier).

Règles :
- Les questions "easy" portent sur des notions fondamentales du domaine
- Les questions "medium" évaluent la maîtrise pratique et les situations courantes
- Les questions "hard" testent l'expertise avancée, l'architecture ou des cas complexes
- Chaque question a 4 options, 1 seule bonne réponse
- L'explication est concise (2 phrases maximum)
- Questions spécifiques au poste ET au secteur de l'entreprise si précisé

Réponds UNIQUEMENT avec ce JSON strict, sans texte avant ou après :
{
  "questions": [
    {
      "difficulty": "easy",
      "question": "...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "..."
    }
  ]
}
`;

/**
 * Génère 8 questions d'entretien typiques avec suggestions de réponses.
 */
export const getInterviewQuestionsPrompt = (cvContext, jobContext) => `
Tu es un coach expert en préparation aux entretiens d'embauche.

PROFIL DU CANDIDAT :
${cvContext || 'Non fourni'}

OFFRE D'EMPLOI :
${jobContext}

Génère 8 questions d'entretien représentatives pour ce poste.
Mix : 3 comportementales, 3 techniques, 2 motivationnelles.

Pour chaque question :
- "suggested_answer" : une réponse modèle structurée (méthode STAR pour les comportementales), 4-6 phrases
- "tip" : un conseil de présentation en 1 phrase

Réponds UNIQUEMENT avec ce JSON strict :
{
  "questions": [
    {
      "question": "...",
      "type": "behavioral",
      "suggested_answer": "...",
      "tip": "..."
    }
  ]
}
`;
