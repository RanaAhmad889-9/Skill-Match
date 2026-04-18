import pdfParse from 'pdf-parse';

export const SKILL_DICTIONARY = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
  'php', 'ruby', 'swift', 'kotlin', 'scala', 'r', 'matlab',
  'react', 'next.js', 'vue', 'angular', 'svelte', 'nuxt.js',
  'node.js', 'express.js', 'fastapi', 'django', 'flask', 'spring boot',
  'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform', 'ansible',
  'ci/cd', 'jenkins', 'github actions', 'gitlab ci',
  'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch',
  'prisma', 'mongoose', 'sequelize', 'typeorm',
  'graphql', 'rest api', 'grpc', 'microservices', 'websockets',
  'tailwindcss', 'jest', 'cypress', 'playwright', 'vitest',
  'git', 'linux', 'nginx', 'kafka', 'rabbitmq',
  'machine learning', 'deep learning', 'tensorflow', 'pytorch',
  'data analysis', 'sql', 'pandas', 'numpy',
];

export const extractSkillsFromText = (text: string): string[] => {
  const lower = text.toLowerCase();
  return SKILL_DICTIONARY.filter((skill) => {
    const regex = new RegExp(`\\b${skill.replace(/[.+]/g, '\\$&')}\\b`, 'i');
    return regex.test(lower);
  });
};

export const extractSkillsFromPDF = async (buffer: Buffer): Promise<string[]> => {
  try {
    const data = await pdfParse(buffer);
    return extractSkillsFromText(data.text);
  } catch {
    return [];
  }
};