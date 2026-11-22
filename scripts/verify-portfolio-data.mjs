import assert from 'node:assert/strict';
import { featuredProjects, getPortfolioProject } from '../src/data/featuredProjects.ts';
import { sideProjects } from '../src/data/sideProjects.ts';

const slugs = featuredProjects.map(({ slug }) => slug);
assert.ok(featuredProjects.length > 0, 'portfolio needs featured projects');
assert.equal(new Set(slugs).size, slugs.length, 'featured project slugs must be unique');
assert.ok(slugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)), 'project slugs must be URL-safe');

for (const project of featuredProjects) {
  assert.ok(project.title.trim() && project.summary.trim(), `${project.slug} needs a title and summary`);
  assert.ok(project.problem.trim() && project.contributions.length && project.outcomes.length && project.technologies.length, `${project.slug} needs case-study content`);
  assert.ok(project.team.size > 0 && project.team.label.trim(), `${project.slug} needs team context`);
  assert.ok(/^#[\da-f]{6}$/i.test(project.color), `${project.slug} needs a six-digit hex color`);
  assert.equal(getPortfolioProject(project.slug), project, `${project.slug} should be retrievable by its slug`);
  for (const link of [project.repository, project.demo].filter(Boolean)) {
    assert.equal(new URL(link).protocol, 'https:', `${project.slug} links should use HTTPS`);
  }
}

assert.ok(sideProjects.length > 0, 'portfolio needs side projects');
for (const project of sideProjects) {
  assert.ok(project.title.trim() && project.category.trim() && project.description.trim(), 'side projects need descriptive content');
  assert.ok(project.technologies.length, `${project.title} needs at least one technology`);
  assert.equal(new URL(project.github).protocol, 'https:', `${project.title} GitHub link should use HTTPS`);
  if (project.demo) assert.equal(new URL(project.demo).protocol, 'https:', `${project.title} demo link should use HTTPS`);
}

console.log(`Portfolio data verified: ${featuredProjects.length} featured and ${sideProjects.length} side projects.`);
