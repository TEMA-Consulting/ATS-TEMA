import { HttpsError } from 'firebase-functions/v2/https';

import type { CreateJobPayload, JobStatus, Skill, SkillType } from '@ats/shared-types';

const VALID_JOB_STATUSES: JobStatus[] = ['draft', 'open', 'paused', 'closed'];
const VALID_SKILL_TYPES: SkillType[] = ['mandatory', 'desirable'];

export function validateCreateJobPayload(
  payload: Partial<CreateJobPayload>,
): asserts payload is CreateJobPayload {
  validateRequiredString(payload.title, 'El título de la posición es obligatorio.');
  validateRequiredString(payload.department, 'El área de la posición es obligatoria.');
  validateRequiredString(payload.seniority, 'El seniority de la posición es obligatorio.');
  validateRequiredString(payload.location, 'La ubicación de la posición es obligatoria.');
  validateRequiredString(payload.description, 'La descripción de la posición es obligatoria.');

  if (!Array.isArray(payload.skills) || payload.skills.length === 0) {
    throw new HttpsError(
      'invalid-argument',
      'La posición debe tener al menos una skill configurada.',
    );
  }

  payload.skills.forEach(validateSkill);

  if (!payload.skills.some((skill) => skill.type === 'mandatory')) {
    throw new HttpsError(
      'invalid-argument',
      'La posición debe tener al menos una skill obligatoria.',
    );
  }

  validateStringArray(
    payload.responsabilities,
    'La posición debe tener al menos una responsabilidad.',
  );
  validateStringArray(
    payload.benefits,
    'La posición debe tener al menos un beneficio.',
  );

  if (
    payload.observations !== undefined &&
    typeof payload.observations !== 'string'
  ) {
    throw new HttpsError(
      'invalid-argument',
      'Las observaciones deben ser texto.',
    );
  }

  if (payload.additionalCriteria !== undefined) {
    validateStringArray(
      payload.additionalCriteria,
      'Los criterios adicionales deben ser una lista de textos no vacíos.',
    );
  }

  if (
    payload.city !== undefined &&
    typeof payload.city !== 'string'
  ) {
    throw new HttpsError(
      'invalid-argument',
      'La ciudad debe ser texto.',
    );
  }

  if (
    payload.status !== undefined &&
    !VALID_JOB_STATUSES.includes(payload.status)
  ) {
    throw new HttpsError(
      'invalid-argument',
      'El estado de la posición no es válido.',
    );
  }
}

function validateRequiredString(
  value: unknown,
  message: string,
): asserts value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new HttpsError('invalid-argument', message);
  }
}

function validateStringArray(
  value: unknown,
  message: string,
): asserts value is string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== 'string' || item.trim().length === 0)
  ) {
    throw new HttpsError('invalid-argument', message);
  }
}

function validateSkill(skill: Skill): void {
  if (!skill.name || skill.name.trim().length === 0) {
    throw new HttpsError(
      'invalid-argument',
      'Cada skill debe tener un nombre válido.',
    );
  }

  if (
    typeof skill.yearsOfExperience !== 'number' ||
    !Number.isFinite(skill.yearsOfExperience) ||
    skill.yearsOfExperience < 0
  ) {
    throw new HttpsError(
      'invalid-argument',
      'Los años de experiencia de cada skill deben ser un número mayor o igual a 0.',
    );
  }

  if (
    typeof skill.weight !== 'number' ||
    !Number.isFinite(skill.weight) ||
    skill.weight < 1 ||
    skill.weight > 10
  ) {
    throw new HttpsError(
      'invalid-argument',
      'El peso de cada skill debe estar entre 1 y 10.',
    );
  }

  if (!VALID_SKILL_TYPES.includes(skill.type)) {
    throw new HttpsError(
      'invalid-argument',
      'El tipo de cada skill debe ser mandatory o desirable.',
    );
  }
}
