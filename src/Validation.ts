import * as EthU from 'ethereumjs-util'
import {genValidateFn, TUnvalidated, IValidatorOpts} from './validator'
import {Validation as HashingValidation, HashingLogic} from '@bloomprotocol/attestations-lib'
import {
  DataVersions,
  IVerifiableCredential,
  ICredentialProof,
  IPresentationProof,
  IVerifiablePresentation,
  IMerkleProofShare,
  IMerkleProofNode,
  TVerifiedData,
  IVerifiedDataBatch,
} from './types'
import {hashCredentials} from './util'

export const isValidPositionString = (value: any): boolean => {
  return ['left', 'right'].indexOf(value) > -1
}

export const isValidStageString = (value: any): boolean => {
  return ['mainnet', 'rinkeby', 'local'].indexOf(value) > -1
}

export const validateProofShare = genValidateFn([
  ['position', isValidPositionString, false, 'Valid merkle proof position'],
  ['data', HashingValidation.isValidHash, false, 'Valid merkle leaf data format'],
])

export const isValidMerkleProofArray = (value: any, opts: IValidatorOpts = {verbose: false}): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateProofShare(v, opts).kind === 'validated')
}

export const isValidLegacyDataNode = (value: any): boolean => HashingValidation.validateDataNodeLegacy(value).kind === 'validated'

export const validateVerifiedDataLegacy = genValidateFn([
  ['version', (value: any) => value === DataVersions.legacy, false, `Valid data node version: ${DataVersions.legacy}`],
  ['tx', HashingValidation.isValidHash, false, 'Valid transaction hash format'],
  ['layer2Hash', HashingValidation.isValidHash, false, 'Valid layer 2 hash format'],
  ['rootHash', HashingValidation.isValidHash, false, 'Valid root hash format'],
  ['rootHashNonce', HashingValidation.isValidHash, false, 'Valid root hash nonce format'],
  ['proof', isValidMerkleProofArray, false, 'Valid Merkle proof array'],
  ['stage', isValidStageString, false, 'Valid network stage'],
  ['target', isValidLegacyDataNode, false, 'Valid data node'],
  ['attester', EthU.isValidAddress, false, 'Valid attester address format'],
])

export const isValidClaimNode = (value: any): boolean => HashingValidation.validateClaimNode(value).kind === 'validated'

export const validateVerifiedDataOnChain = genValidateFn([
  ['version', (value: any) => value === DataVersions.onChain, false, `Valid data node version: ${DataVersions.onChain}`],
  ['tx', HashingValidation.isValidHash, false, 'Valid transaction hash format'],
  ['layer2Hash', HashingValidation.isValidHash, false, 'Valid layer 2 hash format'],
  ['rootHash', HashingValidation.isValidHash, false, 'Valid root hash format'],
  ['rootHashNonce', HashingValidation.isValidHash, false, 'Valid root hash nonce format'],
  ['proof', isValidMerkleProofArray, false, 'Valid Merkle proof array'],
  ['stage', isValidStageString, false, 'Valid network stage'],
  ['target', isValidClaimNode, false, 'Valid data node'],
  ['attester', EthU.isValidAddress, false, 'Valid attester address format'],
])

export const validateBatchAttesterSig = (batchAttesterSig: string, params: TUnvalidated<IVerifiedDataBatch>) => {
  const recoveredSigner = HashingLogic.recoverHashSigner(
    EthU.toBuffer(
      HashingLogic.hashMessage(
        HashingLogic.orderedStringify({
          subject: params.subject,
          rootHash: params.layer2Hash,
        }),
      ),
    ),
    batchAttesterSig,
  )
  return recoveredSigner.toLowerCase() === params.attester.toLowerCase()
}

export const validateVerifiedDataBatch = genValidateFn([
  ['version', (value: any) => value === DataVersions.batch, false, `Valid data node version: ${DataVersions.batch}`],
  ['batchLayer2Hash', HashingValidation.isValidHash, false, 'Valid batch layer 2 hash format'],
  ['batchAttesterSig', HashingValidation.isValidSignatureString, false, 'Valid batch attestation signature format'],
  ['batchAttesterSig', validateBatchAttesterSig, true, 'Valid batch attestation signature'],
  ['subjectSig', HashingValidation.isValidSignatureString, false, 'Valid subject signature format'],
  ['requestNonce', HashingValidation.isValidHash, false, 'Valid request nonce format'],
  ['layer2Hash', HashingValidation.isValidHash, false, 'Valid layer 2 hash format'],
  ['rootHash', HashingValidation.isValidHash, false, 'Valid root hash format'],
  ['rootHashNonce', HashingValidation.isValidHash, false, 'Valid root hash nonce format'],
  ['proof', isValidMerkleProofArray, false, 'Valid Merkle proof array'],
  ['stage', isValidStageString, false, 'Valid network stage'],
  ['target', isValidClaimNode, false, 'Valid data node'],
  ['attester', EthU.isValidAddress, false, 'Valid attester address format'],
  ['subject', EthU.isValidAddress, false, 'Valid subject address format'],
])

export const isValidVerifiedData = (value: any, opts: IValidatorOpts = {verbose: false}): boolean => {
  if (validateVerifiedDataLegacy(value, opts).kind === 'validated') return true
  if (validateVerifiedDataOnChain(value, opts).kind === 'validated') return true
  if (validateVerifiedDataBatch(value, opts).kind === 'validated') return true
  return false
}

export const isOptionalArrayOfAuthorizations = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  return true
  // TODO add authorization validation
}

export const formatMerkleProofForVerify = (proof: IMerkleProofShare[]): IMerkleProofNode[] => {
  return proof.map(node => {
    return {
      position: node.position,
      data: EthU.toBuffer(node.data),
    }
  })
}

export const verifyCredentialMerkleProof = (value: TVerifiedData): boolean => {
  const proof = formatMerkleProofForVerify(value.proof)
  let targetNode: Buffer
  switch (value.version) {
    case DataVersions.legacy:
      targetNode = EthU.toBuffer(HashingLogic.hashMessage(value.target.signedAttestation))
      break
    case DataVersions.onChain:
    case DataVersions.batch:
      targetNode = EthU.toBuffer(HashingLogic.hashMessage(value.target.attesterSig))
      break
    default:
      return false
  }
  const root = EthU.toBuffer(value.rootHash)

  return HashingLogic.verifyMerkleProof(proof, targetNode, root)
}

export const validateCredentialProof = genValidateFn([
  ['type', HashingValidation.isNotEmptyString, false, 'Type string is present'],
  ['created', HashingValidation.isValidRFC3339DateTime, false, 'Created timestamp is valid RFC3339 format'],
  ['creator', EthU.isValidAddress, false, 'Creator is valid address format'],
  ['data', isValidVerifiedData, false, 'Verified data passed validation'],
  ['data', verifyCredentialMerkleProof, false, 'Merkle proof passed validation'],
])

export const isValidCredentialProof = (value: any, opts: IValidatorOpts = {verbose: false}): boolean =>
  validateCredentialProof(value, opts).kind === 'validated'

export const validateCredentialSubject = genValidateFn([
  ['subject', EthU.isValidAddress, false, 'Subject is valid address format'],
  ['data', HashingValidation.isNotEmptyString, false, 'Credential data is present'],
  ['authorization', isOptionalArrayOfAuthorizations, false, 'Authorization array is valid or omitted'],
])

export const isValidCredentialSubject = (value: any, opts: IValidatorOpts = {verbose: false}): boolean =>
  validateCredentialSubject(value, opts).kind === 'validated'

export const proofMatchesSubject = (proof: ICredentialProof, params: TUnvalidated<IVerifiableCredential>) => {
  switch (proof.data.version) {
    case DataVersions.legacy:
      return proof.data.target.attestationNode.data.data === params.credentialSubject.data
    case DataVersions.onChain:
    case DataVersions.batch:
      return proof.data.target.claimNode.data.data === params.credentialSubject.data
    default:
      return false
  }
}

export const isArrayOfNonEmptyStrings = (value: any): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => HashingValidation.isNotEmptyString(v))
}

export const validateVerifiableCredential = genValidateFn([
  ['id', HashingValidation.isNotEmptyString, false, 'Credential ID is present'],
  ['type', HashingValidation.isNotEmptyString, false, 'Credential type is valid string'],
  ['issuer', EthU.isValidAddress, false, 'Issuer is valid address format'],
  ['issuanceDate', HashingValidation.isValidRFC3339DateTime, false, 'Issuance date is valid RFC3339 format'],
  ['credentialSubject', isValidCredentialSubject, false, 'Credential subject passed validation'],
  ['proof', isValidCredentialProof, false, 'Credential proof passed validation'],
  ['proof', proofMatchesSubject, true, 'Credential proof subject matches embedded subject'],
])

export const isArrayOfVerifiableCredentials = (value: any, opts: IValidatorOpts = {verbose: false}): boolean => {
  if (!Array.isArray(value)) return false
  if (value.length === 0) return false
  return value.every(v => validateVerifiableCredential(v, opts).kind === 'validated')
}

export const validatePresentationProof = genValidateFn([
  ['type', HashingValidation.isNotEmptyString, false, 'Presentation type is present'],
  ['created', HashingValidation.isValidRFC3339DateTime, false, 'Presentation creaded date is valid RFC3339 format'],
  ['creator', EthU.isValidAddress, false, 'Creator is valid address format'],
  ['nonce', HashingValidation.isNotEmptyString, false, 'Nonce is present'],
  ['domain', HashingValidation.isNotEmptyString, false, 'Domain is present'],
  ['credentialHash', HashingValidation.isValidHash, false, 'Credential hash is valid format'],
])

export const isValidPresentationProof = (value: any, opts: IValidatorOpts = {verbose: false}): boolean =>
  validatePresentationProof(value, opts).kind === 'validated'

export const proofMatchesCredential = (proof: IPresentationProof, params: TUnvalidated<IVerifiablePresentation>) => {
  return proof.credentialHash.toLowerCase() === hashCredentials(params.verifiableCredential)
}

export const packedDataMatchesProof = (packedData: string, params: TUnvalidated<IVerifiablePresentation>) => {
  return packedData.toLowerCase() === HashingLogic.hashMessage(HashingLogic.orderedStringify(params.proof))
}

export const tokenMatchesProof = (token: string, params: TUnvalidated<IVerifiablePresentation>) => {
  return token.toLowerCase() === params.proof.nonce.toLowerCase()
}

export const validatePresentationSignature = (signature: string, params: TUnvalidated<IVerifiablePresentation>) => {
  const recoveredSigner = HashingLogic.recoverHashSigner(EthU.toBuffer(params.packedData), signature)
  return recoveredSigner.toLowerCase() === params.proof.creator.toLowerCase()
}

export const validateVerifiablePresentation = genValidateFn([
  ['context', isArrayOfNonEmptyStrings, false, 'Presentation context is present'],
  ['type', (value: any) => value === 'VerifiablePresentation', false, 'Presentation type is correct'],
  ['verifiableCredential', isArrayOfVerifiableCredentials, false, 'Validated array of Verifiable Credentials'],
  ['proof', isValidPresentationProof, false, 'Validated presentation proof'],
  ['proof', proofMatchesCredential, true, 'Embedded credential hash matches the computed credential hash'],
  ['packedData', packedDataMatchesProof, true, 'Signature digest matches the computed credential hash'],
  ['signature', HashingValidation.isValidSignatureString, false, 'Signature string is formatted correctly'],
  ['signature', validatePresentationSignature, true, 'Signature matches the proof creator'],
  ['token', tokenMatchesProof, true, 'Token matches the proof nonce'],
])

export const isValidVerifiablePresentation = (value: any, opts: IValidatorOpts = {verbose: false}): boolean =>
  validateVerifiablePresentation(value, opts).kind === 'validated'
