import { FieldValue } from 'firebase-admin/firestore';

import type {
  ArchiveJobResponse,
  Job,
  JobStatus,
  UpdateJobDTO,
  UpdateJobPayload,
  UpdateJobResponse,
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

  async updateJob(payload: UpdateJobPayload): Promise<UpdateJobResponse> {
    try {
      const jobId = payload.jobId.trim();
      const job = await this.jobsRepository.findById(jobId);

      if (!job) {
        throw new JobUpdateNotFoundError(jobId);
      }

      const nextStatus = payload.status ?? job.status;
      const updateData = this.buildUpdateData(job, payload, nextStatus);

      await this.jobsRepository.update(jobId, updateData);

      return {
        jobId,
        status: nextStatus,
      };
    } catch (error) {
      if (error instanceof JobUpdateNotFoundError) {
        throw error;
      }

      throw new UpdateJobServiceError('No se pudo actualizar la posición.', error);
    }
  }

  async archiveJob(jobId: string): Promise<ArchiveJobResponse> {
    try {
      const normalizedJobId = jobId.trim();
      const job = await this.jobsRepository.findById(normalizedJobId);

      if (!job) {
        throw new JobUpdateNotFoundError(normalizedJobId);
      }

      await this.jobsRepository.update(normalizedJobId, {
        status: 'paused',
      });

      return {
        jobId: normalizedJobId,
        status: 'paused',
      };
    } catch (error) {
      if (error instanceof JobUpdateNotFoundError) {
        throw error;
      }

      throw new UpdateJobServiceError('No se pudo archivar la posición.', error);
    }
  }

  private buildUpdateData(
    job: Job,
    payload: UpdateJobPayload,
    nextStatus: JobStatus,
  ): UpdateJobDTO {
    const updateData: UpdateJobDTO = {
      title: payload.title?.trim(),
      department: payload.department?.trim(),
      seniority: payload.seniority?.trim(),
      location: payload.location,
      city: payload.city?.trim(),
      description: payload.description?.trim(),
      observations: payload.observations?.trim(),
      responsabilities: payload.responsabilities?.map((item) => item.trim()),
      benefits: payload.benefits?.map((item) => item.trim()),
      skills: payload.skills?.map((skill) => ({
        name: skill.name.trim(),
        yearsOfExperience: skill.yearsOfExperience,
        weight: skill.weight,
        type: skill.type,
      })),
      status: nextStatus,
    };

    if (payload.status !== undefined) {
      if (job.status !== 'open' && nextStatus === 'open' && !job.publishedAt) {
        updateData.publishedAt = new Date();
      }

      if (nextStatus === 'closed') {
        updateData.closedAt = new Date();
      }

      if (job.status === 'closed' && nextStatus !== 'closed') {
        updateData.closedAt = FieldValue.delete() as never;
      }
    }

    return Object.fromEntries(
      Object.entries(updateData).filter(([, value]) => value !== undefined),
    ) as UpdateJobDTO;
  }
}
