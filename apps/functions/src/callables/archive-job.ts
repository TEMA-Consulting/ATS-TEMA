import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import type { ArchiveJobPayload } from '@ats/shared-types';

import {
  JobUpdateNotFoundError,
  UpdateJobService,
  UpdateJobServiceError,
} from '../services/update-job-service';
import { validateArchiveJobPayload } from '../validators/update-job-validator';

const updateJobService = new UpdateJobService();

export const archiveJob = onCall(async (request) => {
  try {
    const payload = request.data as Partial<ArchiveJobPayload>;

    validateArchiveJobPayload(payload);

    return await updateJobService.archiveJob(payload.jobId);
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    if (error instanceof JobUpdateNotFoundError) {
      throw new HttpsError('not-found', error.message);
    }

    if (error instanceof UpdateJobServiceError) {
      logger.error('Error de negocio archivando posición', error);
      throw new HttpsError('internal', error.message);
    }

    logger.error('Error inesperado archivando posición', error);

    throw new HttpsError('internal', 'No se pudo archivar la posición.');
  }
});
