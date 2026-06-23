import { PROJECTS } from './project-registry';

describe('PROJECTS registry', () => {
  const allowedStatuses = ['ready', 'planned', 'migration'];
  const allowedDifficulties = ['beginner', 'intermediate', 'advanced'];
  const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

  it('should contain unique project ids and routes', () => {
    const ids = PROJECTS.map((project) => project.id);
    const routes = PROJECTS.map((project) => project.route);
    const orders = PROJECTS.map((project) => project.order);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(routes).size).toBe(routes.length);
    expect(new Set(orders).size).toBe(orders.length);
    expect(orders).toEqual([...orders].sort((first, second) => first - second));
  });

  it('should keep project routes aligned with ids', () => {
    PROJECTS.forEach((project) => {
      expect(project.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(project.route).toBe(`/admin/projects/${project.id}`);
    });
  });

  it('should include required catalog metadata for every project', () => {
    PROJECTS.forEach((project) => {
      expect(project.titleKey).toMatch(/^PROJECTS\.[A-Z0-9_]+\.TITLE$/);
      expect(project.summaryKey).toMatch(/^PROJECTS\.[A-Z0-9_]+\.SUMMARY$/);
      expect(project.categoryKey).toMatch(/^CATEGORIES\.[A-Z0-9_]+$/);
      expect(project.image).toMatch(/^assets\/project-covers\/.+\.png$/);
      expect(project.order).toBeGreaterThan(0);
      expect(project.tags.length).toBeGreaterThan(0);
    });
  });

  it('should use supported status, difficulty, and date values', () => {
    PROJECTS.forEach((project) => {
      expect(allowedStatuses).toContain(project.status);
      expect(allowedDifficulties).toContain(project.difficulty);
      expect(project.createdAt).toMatch(isoDatePattern);
      expect(project.updatedAt).toMatch(isoDatePattern);
    });
  });
});
