import {HashingLogic, Types} from '@bloomprotocol/attestations-lib'

export const formatMerkleProofForShare = (proof: Types.IProof[]): Types.IMerkleProofShare[] =>
  proof.map(({position, data}) => ({
    position: position,
    data: '0x' + data.toString('hex'),
  }))

// todo does this make any sense
export const hashCredentials = (credential: Types.IVerifiableCredential[]): string => {
  const credentialProofSorted = credential.map(c => c.proof.data.layer2Hash).sort()
  return HashingLogic.hashMessage(JSON.stringify(credentialProofSorted))
}
