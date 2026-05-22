import { logger } from 'firebase-functions';
import { HttpsError, onRequest } from 'firebase-functions/v2/https';

import type { UpdatePositionStatusPayload } from '@ats/shared-types';

import { HttpAuthError, requireAuthenticatedUser } from '../core/http-auth';
import {
  JobUpdateNotFoundError,
  UpdateJobService,
  UpdateJobServiceError,
} from '../services/update-job-service';
import { validateUpdatePositionStatusPayload } from '../validators/update-job-validator';

const updateJobService = new UpdateJobService();

export const updatePositionStatus = onRequest(async (request, response) => {
  try {
    if (request.method !== 'PATCH') {
      response.status(405).json({ error: 'Method Not Allowed.' });
      return;
    }

    await requireAuthenticatedUser(request);

    const payload = request.body as Partial<UpdatePositionStatusPayload>;

    validateUpdatePositionStatusPayload(payload);

    const result = await updateJobService.updatePositionStatus(
      payload.id,
      payload.status,
    );

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

    if (error instanceof JobUpdateNotFoundError) {
      response.status(404).json({ error: 'Posición no encontrada.' });
      return;
    }

    if (error instanceof UpdateJobServiceError) {
      logger.error('Error de negocio actualizando estado de posición', error);
      response.status(500).json({ error: error.message });
      return;
    }

    logger.error('Error inesperado actualizando estado de posición', error);
    response.status(500).json({ error: 'No se pudo actualizar el estado de la posición.' });
  }
});
