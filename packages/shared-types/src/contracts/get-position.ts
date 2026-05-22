import type { Job } from '../models';

export interface GetPositionPayload {
  id: string;
}

export type GetPositionResponse = Job;
