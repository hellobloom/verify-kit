import {HashingLogic, Types} from '@bloomprotocol/attestations-lib'
import * as EthU from 'ethereumjs-util'

import {formatMerkleProofForShare, hashCredentials} from './utils'

export const buildOnChainCredentialProof = (
  tx: string,
  stage: 'mainnet' | 'rinkeby' | 'local',
  components: HashingLogic.IBloomMerkleTreeComponents,
  target: HashingLogic.ISignedClaimNode,
): Types.ICredentialProof => {
  const bloomMerkleTree = HashingLogic.getMerkleTreeFromComponents(components)
  const proof = formatMerkleProofForShare(
    bloomMerkleTree.getProof(EthU.toBuffer(HashingLogic.hashMessage(target.attesterSig))) as Types.IProof[],
  )
  return {
    type: 'Bloom-On-Chain-Proof-1.0.0',
    created: target.claimNode.issuance.issuanceDate,
    creator: components.attester,
    data: {
      version: Types.DataVersions.onChain,
      tx,
      layer2Hash: components.layer2Hash,
      rootHash: components.rootHash,
      rootHashNonce: components.rootHashNonce,
      proof,
      stage,
      target,
      attester: components.attester,
    },
  }
}

export const buildOnChainCredential = (
  subject: string,
  authorization: HashingLogic.ISignedAuthorization[],
  tx: string,
  stage: 'mainnet' | 'rinkeby' | 'local',
  components: HashingLogic.IBloomMerkleTreeComponents,
  target: HashingLogic.ISignedClaimNode,
): Types.IVerifiableCredential => {
  return {
    // TODO link to docs describing type strings
    id: 'placeholder',
    type: target.claimNode.type.type,
    issuer: components.attester,
    issuanceDate: target.claimNode.issuance.issuanceDate,
    credentialSubject: {
      subject: subject,
      data: target.claimNode.data.data,
      // authorization only needed if sender of presentation != subject
      authorization: authorization,
    },
    proof: buildOnChainCredentialProof(tx, stage, components, target),
  }
}

export const buildBatchCredentialProof = (
  stage: 'mainnet' | 'rinkeby' | 'local',
  components: HashingLogic.IBloomBatchMerkleTreeComponents,
  target: HashingLogic.ISignedClaimNode,
): Types.ICredentialProof => {
  const bloomMerkleTree = HashingLogic.getMerkleTreeFromComponents(components)
  const proof = formatMerkleProofForShare(
    bloomMerkleTree.getProof(EthU.toBuffer(HashingLogic.hashMessage(target.attesterSig))) as Types.IProof[],
  )
  return {
    type: 'Bloom-Batch-Proof-1.0.0',
    created: target.claimNode.issuance.issuanceDate,
    creator: components.attester,
    data: {
      version: Types.DataVersions.batch,
      batchLayer2Hash: components.batchLayer2Hash,
      batchAttesterSig: components.batchAttesterSig,
      subjectSig: components.subjectSig,
      requestNonce: components.requestNonce,
      layer2Hash: components.layer2Hash,
      rootHash: components.rootHash,
      rootHashNonce: components.rootHashNonce,
      proof,
      stage,
      target,
      attester: components.attester,
      subject: components.subject,
    },
  }
}

export const buildBatchCredential = (
  authorization: HashingLogic.ISignedAuthorization[],
  stage: 'mainnet' | 'rinkeby' | 'local',
  components: HashingLogic.IBloomBatchMerkleTreeComponents,
  target: HashingLogic.ISignedClaimNode,
): Types.IVerifiableCredential => {
  return {
    // TODO link to docs describing type strings
    id: 'placeholder',
    type: target.claimNode.type.type,
    issuer: components.attester,
    issuanceDate: target.claimNode.issuance.issuanceDate,
    credentialSubject: {
      subject: components.subject,
      data: target.claimNode.data.data,
      // authorization only needed if sender of presentation != subject
      authorization: authorization,
    },
    proof: buildBatchCredentialProof(stage, components, target),
  }
}

export const buildPresentationProof = (
  creator: string,
  nonce: string,
  domain: string,
  credential: Types.IVerifiableCredential[],
): Types.IPresentationProof => {
  return {
    type: 'Bloom-Presentation-1.0.0',
    created: new Date().toISOString(),
    creator,
    nonce,
    domain,
    credentialHash: hashCredentials(credential),
  }
}

export const buildVerifiablePresentation = (
  token: string,
  credential: Types.IVerifiableCredential[],
  proof: Types.IPresentationProof,
  signature: string,
): Types.IVerifiablePresentation => {
  return {
    context: ['placeholder'],
    type: 'VerifiablePresentation',
    verifiableCredential: credential,
    proof,
    packedData: HashingLogic.hashMessage(HashingLogic.orderedStringify(proof)),
    signature,
    token,
  }
}

export const buildAuthProof = (creator: string, nonce: string, domain: string): Types.IAuthProof => {
  return {
    type: 'Bloom-Auth-1.0.0',
    created: new Date().toISOString(),
    creator,
    nonce,
    domain,
  }
}

export const buildVerifiableAuth = (proof: Types.IAuthProof, signature: string): Types.IVerifiableAuth => {
  return {
    context: ['placeholder'],
    type: 'VerifiableAuth',
    proof,
    signature,
  }
}
