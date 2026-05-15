import type { ParsedCV } from './parsing';

export type CvParseStatus =
  | 'not_required'
  | 'pending'
  | 'processing'
  | 'done'
  | 'failed';

export type RegistrationType = 'specific' | 'general';
export type RegistrationSource = 'manual' | 'cv_upload';

export interface Candidate {
  id: string;

  firstName?: string;
  lastName?: string;
  fullName: string;

  email: string;
  phone?: string;
  location?: string;

  yearsOfExperience?: number;
  education?: string;
  technicalSkills?: string[];
  professionalSummary?: string;

  registrationType: RegistrationType;
  registrationSource: RegistrationSource;
  cvParseStatus: CvParseStatus;
  cvStoragePath?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCandidateDTO {
  firstName?: string;
  lastName?: string;
  fullName: string;

  email: string;
  phone?: string;
  location?: string;

  yearsOfExperience?: number;
  education?: string;
  technicalSkills?: string[];
  professionalSummary?: string;

  registrationType: RegistrationType;
  registrationSource: RegistrationSource;
  cvParseStatus: CvParseStatus;
}
