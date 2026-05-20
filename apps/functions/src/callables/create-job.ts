import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import type { CreateJobPayload } from '@ats/shared-types';

import { CreateJobService, CreateJobServiceError } from '../services/create-job-service';
import { validateCreateJobPayload } from '../validators/create-job-validator';

const createJobService = new CreateJobService();

export const createJob = onCall(async (request) => {
  const recruiterId =
    request.auth?.uid ||
    request.auth?.token?.uid ||
    request.auth?.token?.user_id ||
    request.auth?.token?.sub;

  try {
    const payload = request.data as Partial<CreateJobPayload>;

    validateCreateJobPayload(payload);

    return await createJobService.createJob(recruiterId, payload);
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    if (error instanceof CreateJobServiceError) {
      logger.error('Error de negocio creando posición', error);
      throw new HttpsError('internal', error.message);
    }

    logger.error('Error inesperado creando posición', error);

    throw new HttpsError('internal', 'No se pudo crear la posición.');
  }
});
