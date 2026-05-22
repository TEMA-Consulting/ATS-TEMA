import type { JobStatus, Skill, UpdateJobDTO } from '../models';

export interface UpdatePositionPayload
  extends Partial<
    Omit<
      UpdateJobDTO,
      'status' | 'salaryMin' | 'salaryMax' | 'currency' | 'hiringManagerId'
    >
  > {
  id: string;
  skills?: Skill[];
}

export interface UpdatePositionResponse {
  ok: true;
}

export interface UpdatePositionStatusPayload {
  id: string;
  status: JobStatus;
}

export interface UpdatePositionStatusResponse {
  ok: true;
}
