import { logger } from 'firebase-functions';
import { HttpsError, onRequest } from 'firebase-functions/v2/https';

import type { CreateJobPayload } from '@ats/shared-types';

import { HttpAuthError, requireAuthenticatedUser } from '../core/http-auth';
import {
  CreateJobService,
  CreateJobServiceError,
} from '../services/create-job-service';
import { validateCreateJobPayload } from '../validators/create-job-validator';

const createJobService = new CreateJobService();

export const createJob = onRequest(async (request, response) => {
  try {
    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method Not Allowed.' });
      return;
    }

    const recruiterId = await requireAuthenticatedUser(request);
    const payload = request.body as Partial<CreateJobPayload>;

    validateCreateJobPayload(payload);

    const result = await createJobService.createJob(recruiterId, payload);

    response.status(200).json(result);
  } catch (error) {
    if (error instanceof HttpAuthError) {
      response.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof HttpsError) {
      response.status(400).json({ error: error.message });
      return;
    }

    if (error instanceof CreateJobServiceError) {
      logger.error('Error de negocio creando posición', error);
      response.status(500).json({ error: error.message });
      return;
    }

    logger.error('Error inesperado creando posición', error);
    response.status(500).json({ error: 'No se pudo crear la posición.' });
  }
});
