import assert from 'node:assert/strict';
import { certifications, education, organizationExperience, profile, skillTiers } from '../src/data/profile.ts';

assert.ok(profile.name.trim() && profile.location.trim() && profile.availability.trim(), 'profile needs identity and availability');
assert.match(profile.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'profile email should be usable');
for (const link of [profile.website, profile.github, profile.linkedin]) {
  assert.equal(new URL(link).protocol, 'https:', 'profile links should use HTTPS');
}

assert.ok(education.degree.trim() && education.university.trim() && education.expectedGraduation.trim(), 'education needs degree, institution, and graduation date');
assert.match(education.gpa, /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/, 'GPA should include earned and maximum scores');
assert.ok(organizationExperience.length, 'profile needs experience entries');
for (const experience of organizationExperience) {
  assert.ok(experience.organization.trim() && experience.role.trim() && experience.period.trim() && experience.responsibilities.length, 'experience entries need context and responsibilities');
}

assert.ok(certifications.length, 'profile needs certification entries');
for (const certification of certifications) {
  assert.ok(certification.title.trim() && certification.issuer.trim() && /^\d{4}$/.test(certification.year), 'certifications need title, issuer, and year');
  if (certification.isVerifiedTransaction) {
    assert.ok(certification.credentialId && certification.verificationUrl, `${certification.title} claims verification and needs a public lookup`);
    assert.equal(new URL(certification.verificationUrl).protocol, 'https:');
  }
}

const tierLabels = skillTiers.map(({ label }) => label);
assert.ok(skillTiers.length && new Set(tierLabels).size === tierLabels.length, 'skill tiers need unique labels');
for (const tier of skillTiers) {
  assert.ok(tier.skills.length, `${tier.label} needs skills`);
  for (const skill of tier.skills) assert.ok(skill.name.trim() && /^#[\da-f]{6}$/i.test(skill.color), `${tier.label} skills need names and valid colors`);
}

console.log(`Profile data verified: ${organizationExperience.length} experiences, ${certifications.length} certifications, ${skillTiers.length} skill tiers.`);
