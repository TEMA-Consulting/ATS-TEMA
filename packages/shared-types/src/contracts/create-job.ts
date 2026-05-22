import type { CreateJobDTO, JobStatus } from '../models';

export interface CreateJobPayload
  extends Omit<
    CreateJobDTO,
    'hiringManagerId' | 'status' | 'salaryMin' | 'salaryMax' | 'currency'
  > {
  status?: JobStatus;
}

export interface CreateJobResponse {
  id: string;
}
