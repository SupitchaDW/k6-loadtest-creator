export const SUPPORTER_DATA = {
  password: 'password',

  firstName: 'ploy',
  lastName: 'test',
  phoneNumber: '0800000000',

  dateOfBirth: '2001-01-01',
  gender: 'FEMALE',

  address: {
    name: 'ploy test',
    phoneNumber: '0800000000',
    addressDetail: '1/1',
    soiRoad: 'Rama 4',
    subDistrict: 'Rong Mueang',
    district: 'Pathumwan',
    province: 'Bangkok',
    postalCode: '10000',
  },
};

export const CREATOR_INDIVIDUAL_DATA = {
  password: 'password',
  firstName: 'ploy',
  lastName: 'test',
  phoneNumber: '0800000000',
  dateOfBirth: '2001-01-01',
  gender: 'FEMALE',

  businessData: {
    businessProfileType: 'INDIVIDUAL',
    isSeller: true,
    isCreator: false,

    basicInformation: {
      phoneNumber: '0200000000',
      firstName: 'ploy',
      lastName: 'test',
      dateOfBirth: '1995-05-15',
    },

    // requestInformation: {
    //   bankName: 'Kasikorn Bank',
    //   bankAccountName: 'Ploy Test',
    //   bankAccountNumber: '1234567890',

    //   bankFile: {
    //     id: '019e25aa-352d-773d-a2a7-ea64b47b68a6',
    //     filename: '5otn3r.jpg',
    //   },

    //   legalEntityNumber: '1234567890123',

    //   legalEntityDocumentFile: {
    //     id: '019e25aa-3543-7008-a935-5dd101aa9167',
    //     filename: '5otn3r.jpg',
    //   },

    //   legalEntityVerificationFile: {
    //     id: '019e25aa-3544-70ab-9ade-40cfb86f8caf',
    //     filename: '5otn3r.jpg',
    //   },
    // },
  },
};

export const CREATOR_JURISTIC_DATA = {
  password: 'password',
  firstName: 'ploy',
  lastName: 'test',
  phoneNumber: '0800000000',
  dateOfBirth: '2001-01-01',
  gender: 'FEMALE',

  businessData: {
    businessProfileType: 'JURISTIC',
    isSeller: false,
    isCreator: true,

    basicInformation: {
      phoneNumber: '0200000000',
      companyName: 'testcompany',
    },

    // requestInformation: {
    //   bankName: 'Kasikorn Bank',
    //   bankAccountName: 'Ploy Test',
    //   bankAccountNumber: '1234567890',
    //   addressDetail: '99/123 Modern Condo, Floor 15',
    //   soiRoad: 'Soi Sukhumvit 23',
    //   subDistrict: 'Khlong Toei Nuea',
    //   district: 'Watthana',
    //   province: 'Bangkok',
    //   postalCode: '10110',

    //   bankFile: {
    //     id: '019e25aa-352d-773d-a2a7-ea64b47b68a6',
    //     filename: '5otn3r.jpg',
    //   },

    //   legalEntityNumber: '1234567890123',

    //   legalEntityDocumentFile: {
    //     id: '019e25aa-3543-7008-a935-5dd101aa9167',
    //     filename: '5otn3r.jpg',
    //   },
    // },
  },
};