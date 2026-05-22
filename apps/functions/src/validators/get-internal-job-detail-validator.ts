import { HttpsError } from 'firebase-functions/v2/https';

import type { GetInternalJobDetailPayload } from '@ats/shared-types';

export function validateGetInternalJobDetailPayload(
  payload: Partial<GetInternalJobDetailPayload>,
): asserts payload is GetInternalJobDetailPayload {
  if (!payload.jobId || payload.jobId.trim().length === 0) {
    throw new HttpsError(
      'invalid-argument',
      'El identificador de la posición (jobId) es obligatorio.',
    );
  }
}
