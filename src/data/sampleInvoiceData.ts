import type { LandlordInfo, TenantInfo } from "@/lib/invoiceEngine";

export type TenantRentalData = TenantInfo & {
  rentAmount: number;
  sacCode?: string;
  cgstRate?: number;
  sgstRate?: number;
};

export const landlordInfo: LandlordInfo = {
  name: "Mrs. ABCD 1234",
  pan: "AABBCCDD",
  gstin: "32...",
  addressLines: [
    "Example House",
    "Place P.O., Town",
    "Cochin - 666666, Kerala",
  ],
  signatureImageSrc: "/signature.jpg",
};

export const tenantRentalData: TenantRentalData[] = [
  {
    tenantId: 1,
    tenantCode: "CP",
    name: "Essex Plastics",
    gstin: "32...",
    billingAddressLines: [
      "Essex Plastics",
      "Booga Buildings",
      "Door No.XXXX/333",
      "Place Road, Town",
      "Pin - 676767",
    ],
    locationAddressLines: [
      "Essex Plastics",
      "Booga Buildings",
      "Door No.XXXX/333",
      "Place Road, Town",
    ],
    rentAmount: 105680,
    sacCode: "997212",
    cgstRate: 9,
    sgstRate: 9,
  },
  {
    tenantId: 2,
    tenantCode: "TL",
    name: "Torchlight",
    gstin: "32...",
    billingAddressLines: [
      "Torchlight",
      "Sample Buildings",
      "Door No.XX/222",
      "Market Road",
      "Town - 676767",
    ],
    locationAddressLines: [
      "Torchlight",
      "Sample Buildings",
      "Door No.XX/222",
      "Market Road, Town",
    ],
    rentAmount: 75000,
    sacCode: "997212",
    cgstRate: 9,
    sgstRate: 9,
  },
];