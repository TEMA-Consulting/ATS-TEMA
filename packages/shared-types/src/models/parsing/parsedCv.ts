import { ParsedEducation } from './parsedEducation';
import { ParsedExperience } from './parsedExperience';

export interface ParsedCV {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  hardSkills?: string[];
  softSkills?: string[];
  languages?: string[];
  education?: ParsedEducation[];
  experience?: ParsedExperience[];
  rawText?: string;
}
