import {Types} from '@bloomprotocol/attestations-lib'

import {validateVerifiableAuth} from './structure/auth'
import {ValidationResponse} from './utils'

export const validateVerifiableAuthResponse = (data: any): ValidationResponse<Types.IVerifiableAuth> => {
  const outcome = validateVerifiableAuth(data)

  if (outcome.kind === 'invalid_param') {
    return {
      kind: 'invalid',
      errors: [{key: outcome.kind, message: outcome.message}],
    }
  }

  return {
    kind: 'validated',
    data: outcome.data,
  }
}
