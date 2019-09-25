import {HashingLogic} from '@bloomprotocol/attestations-lib'
import * as EthU from 'ethereumjs-util'

const ethereumjsWallet = require('ethereumjs-wallet')

import * as Validation from '../src/Validation'
import {getBatchCredential, getPresentationProof, getVerifiablePresentation} from '../src/util'

const bobWallet = ethereumjsWallet.fromPrivateKey(new Buffer('ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f', 'hex'))

const bobPrivkey = bobWallet.getPrivateKey()
const bobAddress = bobWallet.getAddressString()

const NDIComponents: HashingLogic.IBloomBatchMerkleTreeComponents = {
  attesterSig:
    '0x41db1d3acec870ad07c2d77abca50b78c13867d4047715801ee0b4e8403a06ae754255c0ebe07262a000badb2fbb1ccab14a7ca3f0963003ab1ad2c1c77170181c',
  batchAttesterSig:
    '0x3f77e8c80e9db19ea40d606dc5cf056e483ef2bdca676d57d98084da9777a7fc2712e03a442dd27cf170cceab6b13ecb27b807d2d89befb99595a06e635899611b',
  batchLayer2Hash: '0xbb8b1fc361bd3460de6bb1f961c785343e2fe7b4ab5fd46621a06493cd14bcdd',
  checksumSig:
    '0xcf68cc9d2b19d129b4403a7296aa520d39fbe823ac71c7510114020af637d63f37c72b91f5c7c6d6c25856eba36a50fc23993d3a622656244465f60e794dc8401c',
  claimNodes: [
    {
      claimNode: {
        data: {
          data: '{"lastupdated":"2019-09-17","source":"1","classification":"C","value":"TAN XIAO HUI"}',
          nonce: '0x3b228aff2450e3356cfccfe4c361dfb4629ec91f60a822a5f3be18a3f1adc8aa',
          version: '3.0.0',
        },
        type: {type: 'full-name', provider: 'NDI', nonce: '0xed2643bb322afbe075da364af723a8a842616d1492dbf8e6b316e555a192e516'},
        aux: '0x0cc2e4483009029f0f43adf88795c779118c9c3e9bc35f4104d1e3613eed843c',
        issuance: {
          localRevocationToken: '0xa00c295805a9789f5ff31c802570cd378607f5857536b1f7ba48ea2243d0d4dd',
          globalRevocationToken: '0xa3c5b2d6e93f8298b8cbe18119913e6ebc1d302a399d03db7a1eba13cd98ea14',
          dataHash: '0xa5e7d98993dc28e271cf1c8bab732bfd77548387e17a770a97aefe532c1a77da',
          typeHash: '0x572223c7d11bb048188c268e0e32844de7b12a594a5c31abffbba0d2118e7791',
          issuanceDate: '2018-02-01T00:00:00.000Z',
          expirationDate: '2020-02-01T00:00:00.000Z',
        },
      },
      attester: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      attesterSig:
        '0xe4a188a47ccbb44a7688c5db7373f62b4bc46550432e6f408ce8d0b935ed70fb14f7574e72784269c2634605befbca7ae5b205fa6ef9c090f6866f96795278741b',
    },
    {
      claimNode: {
        data: {
          data:
            '{"country":{"code":"SG","desc":"SINGAPORE"},"unit":{"value":"128"},"street":{"value":"BEDOK NORTH AVENUE 4"},"lastupdated":"2019-09-17","block":{"value":"102"},"source":"2","postal":{"value":"460102"},"classification":"C","floor":{"value":"9"},"type":"SG","building":{"value":"PEARL GARDEN"}}',
          nonce: '0x676701aff5c1c8971f56763bce98b8397a5b2ca093344746c7e3c18b1ca506d2',
          version: '3.0.0',
        },
        type: {type: 'address', provider: 'NDI', nonce: '0x668ade1704f13cced9fbd9cb399174815f74184545faba4f0bc49b9d6ffb645d'},
        aux: '0xcf553c4c3fffa2cde7629eacbbdb6d5e628479084e6b3418979aace037868d98',
        issuance: {
          localRevocationToken: '0x3dad691ef8aeed927784aa001c20e30062e121d11da03ff39c5f01446746064a',
          globalRevocationToken: '0xa3c5b2d6e93f8298b8cbe18119913e6ebc1d302a399d03db7a1eba13cd98ea14',
          dataHash: '0x8815e1c180039271feafa8adefb2d093d3ce7babb7ffdd0da0e86d7927839e52',
          typeHash: '0xbae44eb1df792be0e504cbd414b032508efa654f2100be7e02d0f6c582f1b516',
          issuanceDate: '2018-02-01T00:00:00.000Z',
          expirationDate: '2020-02-01T00:00:00.000Z',
        },
      },
      attester: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      attesterSig:
        '0x6fa5953bac754055737bcf36a56111b1ffff4f36e1f6dbb90d95de495daf50894a967c83df6b215db80f56ec8b5a514f60ff3d587a5dc9245626f731f3f96f6c1c',
    },
    {
      claimNode: {
        data: {
          data: '{"lastupdated":"2019-09-17","source":"2","classification":"C","value":"myinfotesting@gmail.com"}',
          nonce: '0x11fae6c815db249290ae59268feb09207f3c91da64da6d7cfaa3c5ca6452d1e8',
          version: '3.0.0',
        },
        type: {type: 'email', provider: 'NDI', nonce: '0x3c4c524b8c99ca2be8105b66e053f29540b128d78fefdd2f4a05b38c81ee5027'},
        aux: '0xe1b4bcfc7d057e71bb1a494c638205af5b5e6c35a846c21d3c95cd76cb9b7af9',
        issuance: {
          localRevocationToken: '0xc8fa244fe2ea038099aaaddbe76f5d9c15a0095e909785d7684662c9a7fe511f',
          globalRevocationToken: '0xa3c5b2d6e93f8298b8cbe18119913e6ebc1d302a399d03db7a1eba13cd98ea14',
          dataHash: '0xf3d64565b745d9957e3e5017e93f52acb2efa650932d89504f4b7ca528c126e4',
          typeHash: '0x238d2cd9e0c60dfda85d7146210858bcd7812289d60694d368e465b5c6f96428',
          issuanceDate: '2018-02-01T00:00:00.000Z',
          expirationDate: '2020-02-01T00:00:00.000Z',
        },
      },
      attester: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      attesterSig:
        '0xd589aa56d08967c66967a3a6b9ad69deedbf959f8616add43b87a4c1ad52d3392c8bf391c3e41988b6ea936609f6eb51dea693d1d2a5ddcd8dd1d47dc233b1201c',
    },
    {
      claimNode: {
        data: {
          data:
            '{"lastupdated":"2019-09-17","source":"2","classification":"C","areacode":{"value":"65"},"prefix":{"value":"+"},"nbr":{"value":"97399245"}}',
          nonce: '0xdc8a3dcc0e0897ba184db2206977d1a52b9708450ea8fcedf673afcb185e58bc',
          version: '3.0.0',
        },
        type: {type: 'phone', provider: 'NDI', nonce: '0xedd7d5192de0e7113cf39184d35cfeb3333a74ad3c2790c53f3ca3055fc5e8cf'},
        aux: '0xac1cc5927052ea43407cf65e117a91ae6d3971e3e6e2dc1a8011cd18aaf21539',
        issuance: {
          localRevocationToken: '0xc3bf7d94a8ead3b3899f16ccf0f1da5240e3cec073a581c8a46cdba1ef8d9732',
          globalRevocationToken: '0xa3c5b2d6e93f8298b8cbe18119913e6ebc1d302a399d03db7a1eba13cd98ea14',
          dataHash: '0x29816a0c96008880d763178850087251ae478a301618aabf261823f6080e0ba6',
          typeHash: '0x898a12f16e8e5302bfe6d445b977539fa329854fe6afd701df5202de577cb577',
          issuanceDate: '2018-02-01T00:00:00.000Z',
          expirationDate: '2020-02-01T00:00:00.000Z',
        },
      },
      attester: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      attesterSig:
        '0xd09d2b61ece7bb56337cf7b814bedd3c39546504c50fc7c2b8d49c1ea90d51ed161933d974469fb366b4772e6893ef488e1b40ee586252efe81603e5ce64494b1b',
    },
    {
      claimNode: {
        data: {
          data: '{"lastupdated":"2019-09-17","high":{"value":4999},"source":"2","classification":"C","low":{"value":4000}}',
          nonce: '0x23b3676225702561854d2d50fef23bde36da958891d58d340bfd0e968310f70d',
          version: '3.0.0',
        },
        type: {type: 'income', provider: 'NDI', nonce: '0x029c690e5c101571458688a5bdc109c3c9d895d690c2435fa775c8ba178c54ab'},
        aux: '0xd884ff85fb901e2c8a12ccf1566f4b2439d1d7f95b6237fd2da6ae9b24b7fc6d',
        issuance: {
          localRevocationToken: '0xc1e2af0b71b84fb9a43bc777804bef067e23db2fa1bcff12269627a0b1e444d5',
          globalRevocationToken: '0xa3c5b2d6e93f8298b8cbe18119913e6ebc1d302a399d03db7a1eba13cd98ea14',
          dataHash: '0xc68faa6f44ec0df9099bd08b26581c715bad982d68dd27d579b71d62fc348685',
          typeHash: '0xe7bf7d25ea75b5122fbf705b66e5f9b21509fa19d2e251930bae255ee1a2fea1',
          issuanceDate: '2018-02-01T00:00:00.000Z',
          expirationDate: '2020-02-01T00:00:00.000Z',
        },
      },
      attester: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
      attesterSig:
        '0x706f41e8507ae56e732169f00e97bf38ff92bc2418a55f9f9b145ffba9d032b6340febbd114f67fec83d3a6874fb0cee16534e38654e8ee1b6eef000e32ba4401c',
    },
  ],
  contractAddress: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  layer2Hash: '0x77a92eadd9b93371c8acfafb619fe8f8f3f248791ab58803530729c97641b488',
  paddingNodes: [
    '0xc0f23218285f50f3dfb1858b0c9a7d6deb614af3586c447175b55861d7fd3997',
    '0xfc57c55511f4ea9ccb1aa77eac9788cc17abbf6a40b50473fb3b6fb3ec32b425',
    '0xa42e1478a733a0e3b0cd51c90f509a1ff2f5a7ff57762f5564dd65b3c17c7281',
    '0x60bf8a6525b2c530e5aae49c57abd33a2bd7fba10d5516d8c2ac3f49b91d3621',
    '0x19670489a238336402f2447efcb68e44dbc34b448987f679a7b583cafd620b17',
    '0x70b1b1a9a0684f3714ba20d36a4ddc6441ee15dbfc01d90250300082fd869b09',
    '0xfe5143747fb9cc84b6dcd85d66c5b3e5df983942194d8207f6184c39960690d6',
    '0x3a129e64575ada0d276b5ae0cb4183d0efd2526242952868c6ad8fdf56033de0',
    '0xcc06f5f892a4c04e63ab11dccac182186c0422ff3cad0680837aa57da9c8acd0',
    '0xc9f2a3571194a1615f253683b27fd48bef10191b47731b11910bb4de6e195e92',
  ],
  requestNonce: '0x2f5aeafb3d087704ea62275c0d40c77b3d0a9f3d508f25b9a830098b4fc77b67',
  rootHash: '0xdb23b6aa065e4415a3bc00ae326f5c3e1d30db9ee1e0034e2bd8f83a2b884e7d',
  rootHashNonce: '0xd68c5cb35de595f347ca1776747b214e25928601bd58f1c0a1119badbbaf0f1f',
  attester: '0x627306090abab3a6e1400e9345bc60c78a8bef57',
  subject: '0xf17f52151ebef6c7334fad080c5704d77216b732',
  subjectSig:
    '0x94fc9e53fb3219eb201f6c6ff06fe03f8af46a67179499c68e066eb030b258d27fae7f62910ef35aae8280364297582fa3cccdca78b9f04a06537dfc35726ecd1b',
  version: 'Batch-Attestation-Tree-1.0.0',
}

const batchCredential = getBatchCredential([], 'mainnet', NDIComponents, NDIComponents.claimNodes[4])

const presentationToken = HashingLogic.generateNonce()
const presentationDomain = 'https://bloom.co/receiveData'
const presentationProof = getPresentationProof(bobAddress, presentationToken, presentationDomain, [batchCredential])
const presentationSig = HashingLogic.signHash(
  EthU.toBuffer(HashingLogic.hashMessage(HashingLogic.orderedStringify(presentationProof))),
  bobPrivkey,
)
const presentation = getVerifiablePresentation(presentationToken, [batchCredential], presentationProof, presentationSig)

test('Validation.isValidVerifiablePresentation', () => {
  console.log(JSON.stringify(presentation))
  expect(Validation.isValidVerifiablePresentation(presentation)).toBeTruthy()
})
