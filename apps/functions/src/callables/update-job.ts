import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import type { UpdateJobPayload } from '@ats/shared-types';

import {
  JobUpdateNotFoundError,
  UpdateJobService,
  UpdateJobServiceError,
} from '../services/update-job-service';
import { validateUpdateJobPayload } from '../validators/update-job-validator';

const updateJobService = new UpdateJobService();

export const updateJob = onCall(async (request) => {
  try {
    const payload = request.data as Partial<UpdateJobPayload>;

    validateUpdateJobPayload(payload);

    return await updateJobService.updateJob(payload);
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    if (error instanceof JobUpdateNotFoundError) {
      throw new HttpsError('not-found', error.message);
    }

    if (error instanceof UpdateJobServiceError) {
      logger.error('Error de negocio actualizando posición', error);
      throw new HttpsError('internal', error.message);
    }

    logger.error('Error inesperado actualizando posición', error);

    throw new HttpsError('internal', 'No se pudo actualizar la posición.');
  }
});
