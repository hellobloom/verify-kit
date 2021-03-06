import {HashingLogic, TAttestationTypeNames} from '@bloomprotocol/attestations-lib'
import {IProof} from 'merkletreejs'

/**
 * Based on IProof from `merkletreejs`, but the data property is a string
 * which should contain the hex string representation of a Buffer for
 * compatibility when serializing / deserializing.
 */
interface IMerkleProofShare {
  position: 'left' | 'right'
  data: string
}

type IStages = 'mainnet' | 'rinkeby' | 'ropsten' | 'local'

enum DataVersions {
  legacy = 'legacy',
  onChain = 'onChain',
  batch = 'batch',
  batchProof = 'batchProof',
}

/**
 * Represents the data shared by a user, which has been attested on the Bloom Protocol.
 * Receivers of this data can / should verity this data hasn't been tampered with.
 */
interface IVerifiedDataLegacy {
  version: DataVersions.legacy

  /**
   * Blockchain transaction hash which emits the layer2Hash property
   */
  tx: string

  /**
   * Attestation hash that lives on chain and is formed by hashing the merkle
   * tree root hash with a nonce.
   */
  layer2Hash: string

  /**
   * Merkle tree root hash
   */
  rootHash: string

  /**
   * Nonce used to hash the `rootHash` to create the `layer2Hash`
   */
  rootHashNonce: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: IStages

  /**
   * Data node containing the raw verified data that was requested
   */
  target: HashingLogic.IDataNodeLegacy

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

interface IVerifiedDataOnChain {
  version: DataVersions.onChain

  /**
   * Blockchain transaction hash which emits the layer2Hash property
   */
  tx: string

  /**
   * Attestation hash that lives on chain and is formed by hashing the merkle
   * tree root hash with a nonce.
   */
  layer2Hash: string

  /**
   * Merkle tree root hash
   */
  rootHash: string

  /**
   * Nonce used to hash the `rootHash` to create the `layer2Hash`
   */
  rootHashNonce: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: IStages

  /**
   * Data node containing the raw verified data that was requested
   */
  target: HashingLogic.ISignedClaimNode

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string
}

interface IVerifiedDataBatch {
  version: DataVersions.batch

  /**
   * Attestation hash formed by hashing subject sig with attester sig
   */
  batchLayer2Hash: string

  /**
   * Attester signature of layer2Hash and subject address
   */
  batchAttesterSig: string

  /**
   * Subject signature of attestation agreement
   */
  subjectSig: string

  /**
   * Nonce used in subject sig
   */
  requestNonce: string

  /**
   * Hash of rootHash and rootHashNonce
   */
  layer2Hash: string

  /**
   * Merkle tree root hash
   */
  rootHash: string

  /**
   * Nonce used to hash the `rootHash` to create the `layer2Hash`
   */
  rootHashNonce: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: IStages

  /**
   * Data node containing the raw verified data that was requested
   */
  target: HashingLogic.ISignedClaimNode

  /**
   * Ethereum address of the attester that performed the attestation
   */
  attester: string

  /**
   * Subject of atteststation
   */
  subject: string
}

// Simple proof of batchLayer2Hash inclusion in a block
interface IBatchProof {
  version: DataVersions.batchProof

  /**
   * Blockchain transaction hash which emits the batch root property
   */
  tx: string

  /**
   * Merkle tree leaf proof
   */
  proof: IMerkleProofShare[]

  /**
   * The Ethereum network name on which the tx can be found
   */
  stage: IStages

  /**
   * Root hash embedded in batch tree
   */
  target: string
}

type TVerifiedData = IVerifiedDataLegacy | IVerifiedDataOnChain | IVerifiedDataBatch

interface ICredentialProof {
  // type string describing share kit style proof
  type: string
  // issuance date of the proof
  created: string

  // TODO link within issuer document
  // for now just attester address
  creator: string
  data: TVerifiedData
}

interface IVerifiableCredential {
  // TODO link to docs describing type strings
  id: string
  type: TAttestationTypeNames

  // TODO link to Bloom hosted json doc describing the attester key used to sign creds
  // for now just attester address
  issuer: string

  issuanceDate: string

  credentialSubject: {
    // original subject of attestation
    subject: string
    data: string
    /**
     * Array of signed authorization objects
     * Only included if subject is different from sharer
     * otherwise empty array
     */
    authorization: HashingLogic.ISignedAuthorization[]
  }

  proof: ICredentialProof
}

interface IPresentationProof {
  // type string describing share kit style proof
  type: string
  // recent timestamp in RFC3339 format
  created: string
  /**
   * The Ethereum address of the user sharing their data
   * TODO DID
   */
  creator: string
  // token challenge from recipient
  nonce: string
  // host of recipient endpoint
  domain: string

  // hash of ordered array of layer2Hashes from each credential proof
  credentialHash: string
}

interface IVerifiablePresentation {
  // TODO context document
  context: string[]
  type: 'VerifiablePresentation'
  verifiableCredential: IVerifiableCredential[]
  proof: IPresentationProof

  /**
   * Hex string representation of the `proof` being keccak256 hashed
   */
  packedData: string

  /**
   * Signature of `packedData` by the user with their pk.
   */
  signature: string

  /**
   * Token that should match the one provided to the share-kit QR code.
   * same as nonce in proof
   */
  token: string
}

interface IAuthProof {
  // type string describing share kit style proof
  type: string
  // recent timestamp in RFC3339 format
  created: string
  // The Ethereum address of the user sharing their data
  creator: string
  // token challenge from recipient
  nonce: string
  // host of recipient endpoint
  domain: string
}

interface IVerifiableAuth {
  // TODO context document
  context: string[]
  type: 'VerifiableAuth'
  proof: IAuthProof
  // Signature of keccak256'ed JSON
  signature: string
}

export {
  IProof as IMerkleProofNode,
  IMerkleProofShare,
  IVerifiedDataLegacy,
  IVerifiedDataOnChain,
  IVerifiedDataBatch,
  IBatchProof,
  TVerifiedData,
  ICredentialProof,
  IPresentationProof,
  IVerifiableCredential,
  IVerifiablePresentation,
  IAuthProof,
  IVerifiableAuth,
  DataVersions,
}
