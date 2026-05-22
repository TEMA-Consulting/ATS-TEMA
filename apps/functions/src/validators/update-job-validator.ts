import { HttpsError } from 'firebase-functions/v2/https';

import type {
  ArchiveJobPayload,
  JobStatus,
  Skill,
  SkillType,
  UpdateJobPayload,
} from '@ats/shared-types';

const VALID_JOB_STATUSES: JobStatus[] = ['draft', 'open', 'paused', 'closed'];
const VALID_SKILL_TYPES: SkillType[] = ['mandatory', 'desirable'];

export function validateUpdateJobPayload(
  payload: Partial<UpdateJobPayload>,
): asserts payload is UpdateJobPayload {
  validateRequiredString(payload.jobId, 'El jobId de la posición es obligatorio.');

  if (payload.title !== undefined) {
    validateRequiredString(payload.title, 'El título de la posición es obligatorio.');
  }

  if (payload.department !== undefined) {
    validateRequiredString(payload.department, 'El área de la posición es obligatoria.');
  }

  if (payload.seniority !== undefined) {
    validateRequiredString(payload.seniority, 'El seniority de la posición es obligatorio.');
  }

  if (payload.location !== undefined) {
    validateRequiredString(payload.location, 'La ubicación de la posición es obligatoria.');
  }

  if (payload.description !== undefined) {
    validateRequiredString(payload.description, 'La descripción de la posición es obligatoria.');
  }

  if (payload.city !== undefined && typeof payload.city !== 'string') {
    throw new HttpsError('invalid-argument', 'La ciudad debe ser texto.');
  }

  if (
    payload.observations !== undefined &&
    typeof payload.observations !== 'string'
  ) {
    throw new HttpsError('invalid-argument', 'Las observaciones deben ser texto.');
  }

  if (payload.skills !== undefined) {
    if (!Array.isArray(payload.skills) || payload.skills.length === 0) {
      throw new HttpsError(
        'invalid-argument',
        'Si se actualizan las skills, la lista no puede quedar vacía.',
      );
    }

    payload.skills.forEach(validateSkill);

    if (!payload.skills.some((skill) => skill.type === 'mandatory')) {
      throw new HttpsError(
        'invalid-argument',
        'La posición debe tener al menos una skill obligatoria.',
      );
    }
  }

  if (payload.responsabilities !== undefined) {
    validateStringArray(
      payload.responsabilities,
      'La lista de responsabilidades no puede quedar vacía.',
    );
  }

  if (payload.benefits !== undefined) {
    validateStringArray(
      payload.benefits,
      'La lista de beneficios no puede quedar vacía.',
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

export function validateArchiveJobPayload(
  payload: Partial<ArchiveJobPayload>,
): asserts payload is ArchiveJobPayload {
  validateRequiredString(payload.jobId, 'El jobId de la posición es obligatorio.');
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
