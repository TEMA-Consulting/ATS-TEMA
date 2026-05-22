import { logger } from 'firebase-functions';
import { onRequest } from 'firebase-functions/v2/https';

import { HttpAuthError, requireAuthenticatedUser } from '../core/http-auth';
import {
  GetInternalJobDetailService,
  GetInternalJobDetailServiceError,
  InternalJobDetailNotFoundError,
} from '../services/get-internal-job-detail-service';

const getInternalJobDetailService = new GetInternalJobDetailService();

export const getPosition = onRequest(async (request, response) => {
  try {
    if (request.method !== 'GET') {
      response.status(405).json({ error: 'Method Not Allowed.' });
      return;
    }

    await requireAuthenticatedUser(request);

    const id =
      typeof request.query.id === 'string' ? request.query.id.trim() : '';

    if (!id) {
      response.status(400).json({ error: 'El parámetro id es requerido.' });
      return;
    }

    const job = await getInternalJobDetailService.getInternalJobDetail(id);

    response.status(200).json(job);
  } catch (error) {
    if (error instanceof HttpAuthError) {
      response.status(401).json({ error: error.message });
      return;
    }

    if (error instanceof InternalJobDetailNotFoundError) {
      response.status(404).json({ error: 'Posición no encontrada.' });
      return;
    }

    if (error instanceof GetInternalJobDetailServiceError) {
      logger.error('Error de negocio obteniendo posición', error);
      response.status(500).json({ error: error.message });
      return;
    }

    logger.error('Error inesperado obteniendo posición', error);
    response.status(500).json({ error: 'No se pudo obtener la posición.' });
  }
});
