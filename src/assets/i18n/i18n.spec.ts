import en from './en.json';
import mk from './mk.json';
import { PROJECTS } from '../../app/features/projects/project-registry';

interface TranslationTree {
  [key: string]: string | TranslationTree;
}

function flattenTranslations(tree: TranslationTree, prefix = ''): Record<string, string> {
  return Object.entries(tree).reduce<Record<string, string>>((flattened, [key, value]) => {
    const nextKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      flattened[nextKey] = value;
      return flattened;
    }

    return {
      ...flattened,
      ...flattenTranslations(value, nextKey)
    };
  }, {});
}

describe('i18n translations', () => {
  const enTranslations = flattenTranslations(en);
  const mkTranslations = flattenTranslations(mk);

  it('should keep English and Macedonian translation keys aligned', () => {
    expect(Object.keys(mkTranslations).sort()).toEqual(Object.keys(enTranslations).sort());
  });

  it('should keep all translation values non-empty', () => {
    [...Object.entries(enTranslations), ...Object.entries(mkTranslations)].forEach(([key, value]) => {
      expect(value.trim()).withContext(key).not.toBe('');
    });
  });

  it('should include translations for every project registry key', () => {
    const requiredKeys = PROJECTS.flatMap((project) => [project.titleKey, project.summaryKey, project.categoryKey]);

    requiredKeys.forEach((key) => {
      expect(enTranslations[key]).withContext(`Missing EN key: ${key}`).toBeDefined();
      expect(mkTranslations[key]).withContext(`Missing MK key: ${key}`).toBeDefined();
    });
  });
});
