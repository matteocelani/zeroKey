export const baseRegistrarController = {
  address: '0x4cCb0BB02FCABA27e82a56646E81d8c5bC4119a5',
  abi: [
    {
      inputs: [
        {
          internalType: 'contract BaseRegistrar',
          name: 'base_',
          type: 'address',
        },
        {
          internalType: 'contract IPriceOracle',
          name: 'prices_',
          type: 'address',
        },
        {
          internalType: 'contract IReverseRegistrar',
          name: 'reverseRegistrar_',
          type: 'address',
        },
        { internalType: 'address', name: 'owner_', type: 'address' },
        { internalType: 'bytes32', name: 'rootNode_', type: 'bytes32' },
        { internalType: 'string', name: 'rootName_', type: 'string' },
        { internalType: 'address', name: 'paymentReceiver_', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      inputs: [{ internalType: 'address', name: 'target', type: 'address' }],
      name: 'AddressEmptyCode',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
      name: 'AddressInsufficientBalance',
      type: 'error',
    },
    { inputs: [], name: 'AlreadyInitialized', type: 'error' },
    {
      inputs: [{ internalType: 'address', name: 'sender', type: 'address' }],
      name: 'AlreadyRegisteredWithDiscount',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'uint256', name: 'duration', type: 'uint256' }],
      name: 'DurationTooShort',
      type: 'error',
    },
    { inputs: [], name: 'FailedInnerCall', type: 'error' },
    {
      inputs: [{ internalType: 'bytes32', name: 'key', type: 'bytes32' }],
      name: 'InactiveDiscount',
      type: 'error',
    },
    { inputs: [], name: 'InsufficientValue', type: 'error' },
    {
      inputs: [
        { internalType: 'bytes32', name: 'key', type: 'bytes32' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'InvalidDiscount',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'key', type: 'bytes32' }],
      name: 'InvalidDiscountAmount',
      type: 'error',
    },
    { inputs: [], name: 'InvalidPaymentReceiver', type: 'error' },
    {
      inputs: [
        { internalType: 'bytes32', name: 'key', type: 'bytes32' },
        { internalType: 'address', name: 'validator', type: 'address' },
      ],
      name: 'InvalidValidator',
      type: 'error',
    },
    {
      inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
      name: 'NameNotAvailable',
      type: 'error',
    },
    { inputs: [], name: 'NewOwnerIsZeroAddress', type: 'error' },
    { inputs: [], name: 'NoHandoverRequest', type: 'error' },
    { inputs: [], name: 'ResolverRequiredWhenDataSupplied', type: 'error' },
    {
      inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
      name: 'SafeERC20FailedOperation',
      type: 'error',
    },
    { inputs: [], name: 'TransferFailed', type: 'error' },
    { inputs: [], name: 'Unauthorized', type: 'error' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'registrant',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'discountKey',
          type: 'bytes32',
        },
      ],
      name: 'DiscountApplied',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'discountKey',
          type: 'bytes32',
        },
        {
          components: [
            { internalType: 'bool', name: 'active', type: 'bool' },
            {
              internalType: 'address',
              name: 'discountValidator',
              type: 'address',
            },
            { internalType: 'bytes32', name: 'key', type: 'bytes32' },
            { internalType: 'uint256', name: 'discount', type: 'uint256' },
          ],
          indexed: false,
          internalType: 'struct RegistrarController.DiscountDetails',
          name: 'details',
          type: 'tuple',
        },
      ],
      name: 'DiscountUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'payee',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'price',
          type: 'uint256',
        },
      ],
      name: 'ETHPaymentProcessed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'label',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'expires',
          type: 'uint256',
        },
      ],
      name: 'NameRegistered',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'label',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'expires',
          type: 'uint256',
        },
      ],
      name: 'NameRenewed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'pendingOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipHandoverCanceled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'pendingOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipHandoverRequested',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'oldOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newPaymentReceiver',
          type: 'address',
        },
      ],
      name: 'PaymentReceiverUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newPrices',
          type: 'address',
        },
      ],
      name: 'PriceOracleUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'newReverseRegistrar',
          type: 'address',
        },
      ],
      name: 'ReverseRegistrarUpdated',
      type: 'event',
    },
    {
      inputs: [],
      name: 'MIN_NAME_LENGTH',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'MIN_REGISTRATION_DURATION',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
      name: 'available',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'cancelOwnershipHandover',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'pendingOwner', type: 'address' },
      ],
      name: 'completeOwnershipHandover',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' },
            { internalType: 'address', name: 'resolver', type: 'address' },
            { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
            { internalType: 'bool', name: 'reverseRecord', type: 'bool' },
          ],
          internalType: 'struct RegistrarController.RegisterRequest',
          name: 'request',
          type: 'tuple',
        },
        { internalType: 'bytes32', name: 'discountKey', type: 'bytes32' },
        { internalType: 'bytes', name: 'validationData', type: 'bytes' },
      ],
      name: 'discountedRegister',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'uint256', name: 'duration', type: 'uint256' },
        { internalType: 'bytes32', name: 'discountKey', type: 'bytes32' },
      ],
      name: 'discountedRegisterPrice',
      outputs: [{ internalType: 'uint256', name: 'price', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'registrant', type: 'address' },
      ],
      name: 'discountedRegistrants',
      outputs: [
        {
          internalType: 'bool',
          name: 'hasRegisteredWithDiscount',
          type: 'bool',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'key', type: 'bytes32' }],
      name: 'discounts',
      outputs: [
        { internalType: 'bool', name: 'active', type: 'bool' },
        { internalType: 'address', name: 'discountValidator', type: 'address' },
        { internalType: 'bytes32', name: 'key', type: 'bytes32' },
        { internalType: 'uint256', name: 'discount', type: 'uint256' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'getActiveDiscounts',
      outputs: [
        {
          components: [
            { internalType: 'bool', name: 'active', type: 'bool' },
            {
              internalType: 'address',
              name: 'discountValidator',
              type: 'address',
            },
            { internalType: 'bytes32', name: 'key', type: 'bytes32' },
            { internalType: 'uint256', name: 'discount', type: 'uint256' },
          ],
          internalType: 'struct RegistrarController.DiscountDetails[]',
          name: '',
          type: 'tuple[]',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address[]', name: 'addresses', type: 'address[]' },
      ],
      name: 'hasRegisteredWithDiscount',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'launchTime',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: 'result', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'pendingOwner', type: 'address' },
      ],
      name: 'ownershipHandoverExpiresAt',
      outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'paymentReceiver',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'prices',
      outputs: [
        { internalType: 'contract IPriceOracle', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: '_token', type: 'address' },
        { internalType: 'address', name: '_to', type: 'address' },
        { internalType: 'uint256', name: '_amount', type: 'uint256' },
      ],
      name: 'recoverFunds',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'string', name: 'name', type: 'string' },
            { internalType: 'address', name: 'owner', type: 'address' },
            { internalType: 'uint256', name: 'duration', type: 'uint256' },
            { internalType: 'address', name: 'resolver', type: 'address' },
            { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
            { internalType: 'bool', name: 'reverseRecord', type: 'bool' },
          ],
          internalType: 'struct RegistrarController.RegisterRequest',
          name: 'request',
          type: 'tuple',
        },
      ],
      name: 'register',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'uint256', name: 'duration', type: 'uint256' },
      ],
      name: 'registerPrice',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'uint256', name: 'duration', type: 'uint256' },
      ],
      name: 'renew',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'string', name: 'name', type: 'string' },
        { internalType: 'uint256', name: 'duration', type: 'uint256' },
      ],
      name: 'rentPrice',
      outputs: [
        {
          components: [
            { internalType: 'uint256', name: 'base', type: 'uint256' },
            { internalType: 'uint256', name: 'premium', type: 'uint256' },
          ],
          internalType: 'struct IPriceOracle.Price',
          name: 'price',
          type: 'tuple',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'requestOwnershipHandover',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'reverseRegistrar',
      outputs: [
        {
          internalType: 'contract IReverseRegistrar',
          name: '',
          type: 'address',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rootName',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'rootNode',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          components: [
            { internalType: 'bool', name: 'active', type: 'bool' },
            {
              internalType: 'address',
              name: 'discountValidator',
              type: 'address',
            },
            { internalType: 'bytes32', name: 'key', type: 'bytes32' },
            { internalType: 'uint256', name: 'discount', type: 'uint256' },
          ],
          internalType: 'struct RegistrarController.DiscountDetails',
          name: 'details',
          type: 'tuple',
        },
      ],
      name: 'setDiscountDetails',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'uint256', name: 'launchTime_', type: 'uint256' },
      ],
      name: 'setLaunchTime',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'paymentReceiver_', type: 'address' },
      ],
      name: 'setPaymentReceiver',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract IPriceOracle',
          name: 'prices_',
          type: 'address',
        },
      ],
      name: 'setPriceOracle',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'contract IReverseRegistrar',
          name: 'reverse_',
          type: 'address',
        },
      ],
      name: 'setReverseRegistrar',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'string', name: 'name', type: 'string' }],
      name: 'valid',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'pure',
      type: 'function',
    },
    {
      inputs: [],
      name: 'withdrawETH',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
  ],
} as const;

export const baseL2Resolver = {
  address: '0xC6d566A56A1aFf6508b41f6c90ff131615583BCD',
  abi: [
    {
      inputs: [
        { internalType: 'contract ENS', name: 'ens_', type: 'address' },
        {
          internalType: 'address',
          name: 'registrarController_',
          type: 'address',
        },
        {
          internalType: 'address',
          name: 'reverseRegistrar_',
          type: 'address',
        },
        { internalType: 'address', name: 'owner_', type: 'address' },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    { inputs: [], name: 'AlreadyInitialized', type: 'error' },
    { inputs: [], name: 'CantSetSelfAsDelegate', type: 'error' },
    { inputs: [], name: 'CantSetSelfAsOperator', type: 'error' },
    { inputs: [], name: 'NewOwnerIsZeroAddress', type: 'error' },
    { inputs: [], name: 'NoHandoverRequest', type: 'error' },
    { inputs: [], name: 'Unauthorized', type: 'error' },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'uint256',
          name: 'contentType',
          type: 'uint256',
        },
      ],
      name: 'ABIChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'a',
          type: 'address',
        },
      ],
      name: 'AddrChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'coinType',
          type: 'uint256',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'newAddress',
          type: 'bytes',
        },
      ],
      name: 'AddressChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'operator',
          type: 'address',
        },
        {
          indexed: false,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'ApprovalForAll',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'address',
          name: 'owner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'delegate',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'bool',
          name: 'approved',
          type: 'bool',
        },
      ],
      name: 'Approved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'hash',
          type: 'bytes',
        },
      ],
      name: 'ContenthashChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'name',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'uint16',
          name: 'resource',
          type: 'uint16',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'record',
          type: 'bytes',
        },
      ],
      name: 'DNSRecordChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'name',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'uint16',
          name: 'resource',
          type: 'uint16',
        },
      ],
      name: 'DNSRecordDeleted',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'lastzonehash',
          type: 'bytes',
        },
        {
          indexed: false,
          internalType: 'bytes',
          name: 'zonehash',
          type: 'bytes',
        },
      ],
      name: 'DNSZonehashChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'bytes4',
          name: 'interfaceID',
          type: 'bytes4',
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'implementer',
          type: 'address',
        },
      ],
      name: 'InterfaceChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'name',
          type: 'string',
        },
      ],
      name: 'NameChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'pendingOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipHandoverCanceled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'pendingOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipHandoverRequested',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'oldOwner',
          type: 'address',
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address',
        },
      ],
      name: 'OwnershipTransferred',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'x',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'bytes32',
          name: 'y',
          type: 'bytes32',
        },
      ],
      name: 'PubkeyChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'newRegistrarController',
          type: 'address',
        },
      ],
      name: 'RegistrarControllerUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'newReverseRegistrar',
          type: 'address',
        },
      ],
      name: 'ReverseRegistrarUpdated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: true,
          internalType: 'string',
          name: 'indexedKey',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'key',
          type: 'string',
        },
        {
          indexed: false,
          internalType: 'string',
          name: 'value',
          type: 'string',
        },
      ],
      name: 'TextChanged',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'bytes32',
          name: 'node',
          type: 'bytes32',
        },
        {
          indexed: false,
          internalType: 'uint64',
          name: 'newVersion',
          type: 'uint64',
        },
      ],
      name: 'VersionChanged',
      type: 'event',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'uint256', name: 'contentTypes', type: 'uint256' },
      ],
      name: 'ABI',
      outputs: [
        { internalType: 'uint256', name: '', type: 'uint256' },
        { internalType: 'bytes', name: '', type: 'bytes' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
      name: 'addr',
      outputs: [{ internalType: 'address payable', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'uint256', name: 'coinType', type: 'uint256' },
      ],
      name: 'addr',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'address', name: 'delegate', type: 'address' },
        { internalType: 'bool', name: 'approved', type: 'bool' },
      ],
      name: 'approve',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'cancelOwnershipHandover',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
      name: 'clearRecords',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'pendingOwner', type: 'address' },
      ],
      name: 'completeOwnershipHandover',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
      name: 'contenthash',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes32', name: 'name', type: 'bytes32' },
        { internalType: 'uint16', name: 'resource', type: 'uint16' },
      ],
      name: 'dnsRecord',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'ens',
      outputs: [{ internalType: 'contract ENS', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes32', name: 'name', type: 'bytes32' },
      ],
      name: 'hasDNSRecords',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' },
      ],
      name: 'interfaceImplementer',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'owner', type: 'address' },
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'address', name: 'delegate', type: 'address' },
      ],
      name: 'isApprovedFor',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'account', type: 'address' },
        { internalType: 'address', name: 'operator', type: 'address' },
      ],
      name: 'isApprovedForAll',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes[]', name: 'data', type: 'bytes[]' }],
      name: 'multicall',
      outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'nodehash', type: 'bytes32' },
        { internalType: 'bytes[]', name: 'data', type: 'bytes[]' },
      ],
      name: 'multicallWithNodeCheck',
      outputs: [{ internalType: 'bytes[]', name: 'results', type: 'bytes[]' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
      name: 'name',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'owner',
      outputs: [{ internalType: 'address', name: 'result', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'pendingOwner', type: 'address' },
      ],
      name: 'ownershipHandoverExpiresAt',
      outputs: [{ internalType: 'uint256', name: 'result', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
      name: 'pubkey',
      outputs: [
        { internalType: 'bytes32', name: 'x', type: 'bytes32' },
        { internalType: 'bytes32', name: 'y', type: 'bytes32' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      name: 'recordVersions',
      outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'registrarController',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'renounceOwnership',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'requestOwnershipHandover',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes', name: '', type: 'bytes' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'resolve',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [],
      name: 'reverseRegistrar',
      outputs: [{ internalType: 'address', name: '', type: 'address' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'uint256', name: 'contentType', type: 'uint256' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'setABI',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'uint256', name: 'coinType', type: 'uint256' },
        { internalType: 'bytes', name: 'a', type: 'bytes' },
      ],
      name: 'setAddr',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'address', name: 'operator', type: 'address' },
        { internalType: 'bool', name: 'approved', type: 'bool' },
      ],
      name: 'setApprovalForAll',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes', name: 'hash', type: 'bytes' },
      ],
      name: 'setContenthash',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes', name: 'data', type: 'bytes' },
      ],
      name: 'setDNSRecords',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' },
        { internalType: 'address', name: 'implementer', type: 'address' },
      ],
      name: 'setInterface',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'string', name: 'newName', type: 'string' },
      ],
      name: 'setName',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes32', name: 'x', type: 'bytes32' },
        { internalType: 'bytes32', name: 'y', type: 'bytes32' },
      ],
      name: 'setPubkey',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'registrarController_',
          type: 'address',
        },
      ],
      name: 'setRegistrarController',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        {
          internalType: 'address',
          name: 'reverseRegistrar_',
          type: 'address',
        },
      ],
      name: 'setReverseRegistrar',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'string', name: 'key', type: 'string' },
        { internalType: 'string', name: 'value', type: 'string' },
      ],
      name: 'setText',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'bytes', name: 'hash', type: 'bytes' },
      ],
      name: 'setZonehash',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes4', name: 'interfaceID', type: 'bytes4' }],
      name: 'supportsInterface',
      outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { internalType: 'bytes32', name: 'node', type: 'bytes32' },
        { internalType: 'string', name: 'key', type: 'string' },
      ],
      name: 'text',
      outputs: [{ internalType: 'string', name: '', type: 'string' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
      name: 'transferOwnership',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'node', type: 'bytes32' }],
      name: 'zonehash',
      outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;

export const zeroKeyModule = {
  address: '0x2f06DAd8675AdA13e5124eD8B593876a8fad9d99',
  abi: [
    {
      inputs: [{ internalType: 'address', name: '_verifier', type: 'address' }],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    { inputs: [], name: 'InvalidHash', type: 'error' },
    { inputs: [], name: 'InvalidProof', type: 'error' },
    { inputs: [], name: 'InvalidSender', type: 'error' },
    {
      inputs: [
        { internalType: 'address', name: 'wallet', type: 'address' },
        {
          components: [
            { internalType: 'address', name: 'to', type: 'address' },
            { internalType: 'uint256', name: 'value', type: 'uint256' },
            { internalType: 'bytes', name: 'callData', type: 'bytes' },
          ],
          internalType: 'struct ZeroKeyModule.Transaction',
          name: 'transaction',
          type: 'tuple',
        },
        {
          components: [
            {
              components: [
                { internalType: 'uint256', name: 'X', type: 'uint256' },
                { internalType: 'uint256', name: 'Y', type: 'uint256' },
              ],
              internalType: 'struct IVerifier.G1Point',
              name: 'a',
              type: 'tuple',
            },
            {
              components: [
                { internalType: 'uint256[2]', name: 'X', type: 'uint256[2]' },
                { internalType: 'uint256[2]', name: 'Y', type: 'uint256[2]' },
              ],
              internalType: 'struct IVerifier.G2Point',
              name: 'b',
              type: 'tuple',
            },
            {
              components: [
                { internalType: 'uint256', name: 'X', type: 'uint256' },
                { internalType: 'uint256', name: 'Y', type: 'uint256' },
              ],
              internalType: 'struct IVerifier.G1Point',
              name: 'c',
              type: 'tuple',
            },
          ],
          internalType: 'struct IVerifier.Proof',
          name: 'proof',
          type: 'tuple',
        },
        { internalType: 'uint256[4]', name: 'input', type: 'uint256[4]' },
      ],
      name: 'executeTransactionWithProof',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'address', name: 'wallet', type: 'address' }],
      name: 'getHash',
      outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [{ internalType: 'bytes32', name: 'hash', type: 'bytes32' }],
      name: 'setHash',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'verifier',
      outputs: [
        { internalType: 'contract IVerifier', name: '', type: 'address' },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  ],
} as const;
