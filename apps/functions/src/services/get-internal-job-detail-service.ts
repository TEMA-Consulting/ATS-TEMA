import type { GetInternalJobDetailResponse } from '@ats/shared-types';

import { JobsRepository } from '../repositories/jobs-repository';

export class InternalJobDetailValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalJobDetailValidationError';
  }
}

export class InternalJobDetailNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InternalJobDetailNotFoundError';
  }
}

export class GetInternalJobDetailServiceError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'GetInternalJobDetailServiceError';
  }
}

export class GetInternalJobDetailService {
  constructor(
    private readonly jobsRepository: JobsRepository = new JobsRepository(),
  ) {}

  async getInternalJobDetail(
    jobId: string,
  ): Promise<GetInternalJobDetailResponse> {
    try {
      const normalizedJobId = jobId?.trim();

      if (!normalizedJobId) {
        throw new InternalJobDetailValidationError(
          'El jobId es obligatorio para obtener el detalle interno del puesto.',
        );
      }

      const job = await this.jobsRepository.findById(normalizedJobId);

      if (!job) {
        throw new InternalJobDetailNotFoundError(
          `No se encontró una posición con id ${normalizedJobId}.`,
        );
      }

      return job;
    } catch (error) {
      if (
        error instanceof InternalJobDetailValidationError ||
        error instanceof InternalJobDetailNotFoundError
      ) {
        throw error;
      }

      throw new GetInternalJobDetailServiceError(
        `No se pudo obtener el detalle interno del puesto ${jobId}.`,
        error,
      );
    }
  }
}
