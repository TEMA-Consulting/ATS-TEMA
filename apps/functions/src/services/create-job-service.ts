import type {
  CreateJobDTO,
  CreateJobPayload,
  CreateJobResponse,
  JobStatus,
} from '@ats/shared-types';

import { JobsRepository } from '../repositories/jobs-repository';

export class CreateJobServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'CreateJobServiceError';
  }
}

export class CreateJobService {
  private static readonly DEFAULT_HIRING_MANAGER_ID = 'recruiter-dev';

  constructor(
    private readonly jobsRepository: JobsRepository = new JobsRepository(),
  ) {}

  async createJob(
    recruiterId: string | undefined,
    payload: CreateJobPayload,
  ): Promise<CreateJobResponse> {
    try {
      const status: JobStatus = payload.status ?? 'draft';
      const hiringManagerId =
        recruiterId ?? CreateJobService.DEFAULT_HIRING_MANAGER_ID;

      const jobData: CreateJobDTO = {
        title: payload.title.trim(),
        department: payload.department.trim(),
        seniority: payload.seniority.trim(),
        location: payload.location,
        city: payload.city?.trim(),
        description: payload.description.trim(),
        skills: payload.skills.map((skill) => ({
          name: skill.name.trim(),
          yearsOfExperience: skill.yearsOfExperience,
          weight: skill.weight,
          type: skill.type,
        })),
        observations: payload.observations?.trim(),
        additionalCriteria: payload.additionalCriteria?.map((item) => item.trim()),
        status,
        responsabilities: payload.responsabilities.map((item) => item.trim()),
        benefits: payload.benefits.map((item) => item.trim()),
        hiringManagerId,
      };

      const id = await this.jobsRepository.create(jobData);

      return { id };
    } catch (error) {
      throw new CreateJobServiceError('No se pudo crear la posición.', error);
    }
  }
}
