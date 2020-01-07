import {Validation as HashingValidation, HashingLogic, Types} from '@bloomprotocol/attestations-lib'
import * as EthU from 'ethereumjs-util'
import {keccak256} from 'js-sha3'

import {genValidateFn, isArrayOfNonEmptyStrings} from './utils'

export const validateAuthSignature = (value: any, data: any) => {
  const creator = data?.proof?.creator
  if (typeof creator !== 'string') return false
  const recoveredSigner = HashingLogic.recoverHashSigner(EthU.toBuffer('0x' + keccak256(HashingLogic.orderedStringify(data.proof))), value)
  return recoveredSigner.toLowerCase() === creator.toLowerCase()
}

export const validateAuthProof = genValidateFn({
  type: HashingValidation.isNotEmptyString,
  created: HashingValidation.isValidRFC3339DateTime,
  creator: EthU.isValidAddress,
  nonce: HashingValidation.isNotEmptyString,
  domain: HashingValidation.isNotEmptyString,
})

export const validateVerifiableAuth = genValidateFn<Types.IVerifiableAuth>({
  context: isArrayOfNonEmptyStrings,
  type: (value: any) => value === 'VerifiableAuth',
  proof: (value: any) => validateAuthProof(value).kind === 'validated',
  signature: [HashingValidation.isValidSignatureString, validateAuthSignature],
})
