import { FieldValue } from 'firebase-admin/firestore';

import type {
  Job,
  JobStatus,
  UpdateJobDTO,
  UpdatePositionPayload,
  UpdatePositionResponse,
  UpdatePositionStatusResponse,
} from '@ats/shared-types';

import { JobsRepository } from '../repositories/jobs-repository';

export class JobUpdateNotFoundError extends Error {
  constructor(jobId: string) {
    super(`La posición ${jobId} no existe.`);
    this.name = 'JobUpdateNotFoundError';
  }
}

export class UpdateJobServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'UpdateJobServiceError';
  }
}

export class UpdateJobService {
  constructor(
    private readonly jobsRepository: JobsRepository = new JobsRepository(),
  ) {}

  async updatePosition(
    payload: UpdatePositionPayload,
  ): Promise<UpdatePositionResponse> {
    try {
      const jobId = payload.id.trim();
      const job = await this.jobsRepository.findById(jobId);

      if (!job) {
        throw new JobUpdateNotFoundError(jobId);
      }

      const updateData = this.buildUpdateData(payload);

      await this.jobsRepository.update(jobId, updateData);

      return { ok: true };
    } catch (error) {
      if (error instanceof JobUpdateNotFoundError) {
        throw error;
      }

      throw new UpdateJobServiceError('No se pudo actualizar la posición.', error);
    }
  }

  async updatePositionStatus(
    jobId: string,
    status: JobStatus,
  ): Promise<UpdatePositionStatusResponse> {
    try {
      const normalizedJobId = jobId.trim();
      const job = await this.jobsRepository.findById(normalizedJobId);

      if (!job) {
        throw new JobUpdateNotFoundError(normalizedJobId);
      }

      const updateData: UpdateJobDTO = { status };

      if (job.status !== 'open' && status === 'open' && !job.publishedAt) {
        updateData.publishedAt = new Date();
      }

      if (status === 'closed') {
        updateData.closedAt = new Date();
      }

      if (job.status === 'closed' && status !== 'closed') {
        updateData.closedAt = FieldValue.delete() as never;
      }

      await this.jobsRepository.update(normalizedJobId, updateData);

      return { ok: true };
    } catch (error) {
      if (error instanceof JobUpdateNotFoundError) {
        throw error;
      }

      throw new UpdateJobServiceError(
        'No se pudo actualizar el estado de la posición.',
        error,
      );
    }
  }

  async updateJob(
    payload: UpdatePositionPayload & { status?: JobStatus },
  ): Promise<UpdatePositionResponse> {
    if (payload.status !== undefined) {
      return this.updatePositionStatus(payload.id, payload.status);
    }

    return this.updatePosition(payload);
  }

  async archiveJob(jobId: string): Promise<UpdatePositionStatusResponse> {
    return this.updatePositionStatus(jobId, 'paused');
  }

  private buildUpdateData(payload: UpdatePositionPayload): UpdateJobDTO {
    const updateData: UpdateJobDTO = {
      title: payload.title?.trim(),
      department: payload.department?.trim(),
      seniority: payload.seniority?.trim(),
      location: payload.location,
      city: payload.city?.trim(),
      description: payload.description?.trim(),
      observations: payload.observations?.trim(),
      additionalCriteria: payload.additionalCriteria?.map((item) => item.trim()),
      responsabilities: payload.responsabilities?.map((item) => item.trim()),
      benefits: payload.benefits?.map((item) => item.trim()),
      skills: payload.skills?.map((skill) => ({
        name: skill.name.trim(),
        yearsOfExperience: skill.yearsOfExperience,
        weight: skill.weight,
        type: skill.type,
      })),
    };

    return Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    ) as UpdateJobDTO;
  }
}
