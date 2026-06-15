export type LegalSectionPart =
  | string
  | {
      kind: 'strong'
      text: string
    }
  | {
      href: string
      kind: 'link'
      text: string
    }
  | {
      kind: 'break'
    }

export interface LegalSection {
  parts: LegalSectionPart[]
}

export const legalSections: LegalSection[] = [
  {
    parts: [
      'Truist Bank, Member FDIC. © 2026 Truist Financial Corporation. Truist, the Truist logo - Truist Purple, LightStream, and the LightStream logo are service marks of Truist Financial Corporation.',
    ],
  },
  {
    parts: ['Truist Bank, Member FDIC and an Equal Housing Lender'],
  },
  {
    parts: [
      { kind: 'strong', text: 'Investment and Insurance Products :' },
      { kind: 'break' },
      '• ARE NOT FDIC OR ANY OTHER GOVERNMENT AGENCY INSURED • ARE NOT BANK GUARANTEED • MAY LOSE VALUE',
    ],
  },
  {
    parts: [
      'Mortgage products and services are offered through Truist Bank. All Truist mortgage professionals are registered on the Nationwide Mortgage Licensing System & Registry (NMLS), which promotes uniformity and transparency throughout the residential real estate industry. ',
      {
        href: 'https://www.nmlsconsumeraccess.org/',
        kind: 'link',
        text: 'Search the NMLS Registry',
      },
      '.',
    ],
  },
  {
    parts: [
      'Services provided by the following affiliates of Truist Financial Corporation: Truist Banking products and services, including loans and deposit accounts, are provided by Truist Bank, Member FDIC. Trust and investment management services are provided by Truist Bank Securities, brokerage accounts and/or annuities are offered by Truist Investment Services, Inc., an SEC registered broker-dealer, and member ',
      { href: 'https://www.finra.org/', kind: 'link', text: 'FINRA' },
      ' and ',
      { href: 'https://www.sipc.org/', kind: 'link', text: 'SIPC' },
      ', and a licensed insurance agency. Investment advisory services are offered by Truist Advisory Services, Inc. and GFO Advisory Services, LLC, SEC registered investment advisers. Some insurance products offered by Truist Investment Services, Inc. Other insurance products offered by Marsh &McLennan Agency, LLC (as successor in interest to McGriff Insurance Services, LLC), CA license # 0H18131, Kensington Vanguard National Land Services and Crump Life Insurance Services. Truist Life Insurance Services is a division of Crump, Arkansas License #100103477. Variable insurance material is for broker-dealer or registered representative use only. Variable products distributed by P.J. Robb Variable, LLC, Arkansas License #100110185. Member ',
      { href: 'https://www.finra.org/', kind: 'link', text: 'FINRA' },
      '.',
    ],
  },
  {
    parts: [
      'Marsh & McLennan Agency LLC, Kensington Vanguard National Land Services, Crump Life Insurance Services, Truist Life Insurance Services and P.J. Robb Variable, LLC are not affiliated with Truist Financial Corporation or any of its subsidiaries.',
    ],
  },
  {
    parts: [
      'Truist Securities is a trademark of Truist Financial Corporation. Truist Securities is a trade name for the corporate and investment banking services of Truist and its subsidiaries. All rights reserved. Securities and strategic advisory services are provided by Truist Securities, Inc., member ',
      { href: 'https://www.finra.org/', kind: 'link', text: 'FINRA' },
      ' and ',
      { href: 'https://www.sipc.org/', kind: 'link', text: 'SIPC' },
      '. Lending, financial risk management, and treasury management and payment services are offered by Truist Bank.',
    ],
  },
  {
    parts: [
      '“Truist Advisors” may be officers and/or associated persons of the following affiliates of Truist: Truist Bank, Truist Investment Services, Inc. and Truist Advisory Services, Inc.',
    ],
  },
  {
    parts: [
      'Truist Wealth, International Wealth, Center for Family Legacy, Business Owner Specialty Group, Sports and Entertainment Group, and Legal and Medical Specialty Groups are trade names used by Truist Bank, Truist Investment Services, Inc., and Truist Advisory Services, Inc.',
    ],
  },
  {
    parts: [
      'Comments regarding tax implications are informational only. Truist and its representatives do not provide tax or legal advice. You should consult your individual tax or legal professional before taking any action that may have tax or legal consequences.',
    ],
  },
  {
    parts: [
      { kind: 'strong', text: 'New York City residents:' },
      ' Translation or other language access services may be available. When calling our office regarding collection activity, if you speak a language other than English and need verbal translation services, be sure to inform the representative. A description and translation of commonly-used debt collection terms is available in multiple languages at ',
      { href: 'http://www.nyc.gov/dca', kind: 'link', text: 'http://www.nyc.gov/dca' },
      '.',
    ],
  },
  {
    parts: [
      { kind: 'strong', text: 'Limited English Proficiency Support:' },
      ' Applications, agreements, disclosures, and other servicing communications provided by Truist Bank and its subsidiary businesses will be provided in English. As a result, it will be necessary for customers to speak, read and understand English or to have an appropriate translator assisting them. Truist offers phone support in Spanish at 844-4TRUIST (844-487-8478), option 9. For assistance in other languages, please speak to a representative directly.',
    ],
  },
  {
    parts: [
      {
        kind: 'strong',
        text: 'Borrowers with Limited English Proficiency (LEP) needing information can use the following resources:',
      },
      ' The Consumer Finance Protection Bureau (CFPB) also provides additional resources for homeowners seeking payment assistance in select languages at: ',
      {
        href: 'https://www.consumerfinance.gov/housing/housing-insecurity/help-for-homeowners/',
        kind: 'link',
        text: 'https://www.consumerfinance.gov/housing/housing-insecurity/help-for-homeowners/',
      },
      '.',
    ],
  },
]
