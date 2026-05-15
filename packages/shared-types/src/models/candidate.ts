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
  fullName: string;
  email: string;
  phone?: string;
  cvStoragePath?: string;
  cvParseStatus: CvParseStatus;
  parsedData?: ParsedCV;
  createdAt: Date;
  updatedAt: Date;
  registrationSource: RegistrationSource;
  registrationType: RegistrationType;
  cvFileName?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export type CreateCandidateDTO = Omit<
  Candidate,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateCandidateDTO = Partial<Omit<Candidate, 'id' | 'createdAt'>>;
