import type { Job } from '../models';

export interface GetInternalJobDetailPayload {
  jobId: string;
}

export type GetInternalJobDetailResponse = Job;
