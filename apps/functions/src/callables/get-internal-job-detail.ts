import { logger } from 'firebase-functions';
import { HttpsError, onCall } from 'firebase-functions/v2/https';

import type { GetInternalJobDetailPayload } from '@ats/shared-types';

import {
  GetInternalJobDetailService,
  GetInternalJobDetailServiceError,
  InternalJobDetailNotFoundError,
  InternalJobDetailValidationError,
} from '../services/get-internal-job-detail-service';
import { validateGetInternalJobDetailPayload } from '../validators/get-internal-job-detail-validator';

const getInternalJobDetailService = new GetInternalJobDetailService();

export const getInternalJobDetail = onCall(async (request) => {
  try {
    const payload = request.data as Partial<GetInternalJobDetailPayload>;

    validateGetInternalJobDetailPayload(payload);

    return await getInternalJobDetailService.getInternalJobDetail(payload.jobId);
  } catch (error) {
    if (error instanceof HttpsError) {
      throw error;
    }

    if (error instanceof InternalJobDetailValidationError) {
      throw new HttpsError('invalid-argument', error.message);
    }

    if (error instanceof InternalJobDetailNotFoundError) {
      throw new HttpsError('not-found', error.message);
    }

    logger.error('Error inesperado obteniendo detalle interno de posición', error);

    if (error instanceof GetInternalJobDetailServiceError) {
      throw new HttpsError('internal', error.message);
    }

    throw new HttpsError(
      'internal',
      'No se pudo obtener el detalle interno del puesto.',
    );
  }
});
