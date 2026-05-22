import type { JobStatus, Skill, UpdateJobDTO } from '../models';

export interface UpdateJobPayload
  extends Partial<
    Omit<
      UpdateJobDTO,
      'status' | 'salaryMin' | 'salaryMax' | 'currency' | 'hiringManagerId'
    >
  > {
  jobId: string;
  status?: JobStatus;
  skills?: Skill[];
}

export interface UpdateJobResponse {
  jobId: string;
  status: JobStatus;
}

export interface ArchiveJobPayload {
  jobId: string;
}

export interface ArchiveJobResponse {
  jobId: string;
  status: 'paused';
}
