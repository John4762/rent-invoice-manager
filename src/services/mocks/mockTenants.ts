import { Tenant } from "@/types/tenant";
export const mockTenants: Tenant[] = [
  {
    id: "tenant-001",
    tenantName: "CP Traders",
    tenantCode: "CP",
    tenantGstin: "32ABCDE1234F1Z5",
    tenantAddress:
      "CP Traders, 2nd Floor, Metro Plaza, MG Road, Kochi, Kerala - 682016",
    locationAddress:
      "Shop No. 12, Ground Floor, AJ Commercial Complex, Edappally, Kochi, Kerala - 682024",
    rentAmount: 25000,
    cgstPercent: 9,
    sgstPercent: 9,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tenant-002",
    tenantName: "XYZ Enterprises",
    tenantCode: "XYZ",
    tenantGstin: "32XYZDE5678G1Z2",
    tenantAddress:
      "XYZ Enterprises, 4th Floor, Skyline Towers, Marine Drive, Kochi, Kerala - 682031",
    locationAddress:
      "Unit No. 8, AJ Commercial Complex, Edappally, Kochi, Kerala - 682024",
    rentAmount: 40000,
    cgstPercent: 9,
    sgstPercent: 9,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
  {
    id: "tenant-003",
    tenantName: "ABC Associates",
    tenantCode: "ABC",
    tenantGstin: "32ABCAA9999K1Z8",
    tenantAddress:
      "ABC Associates, 1st Floor, Business Hub, Kakkanad, Kochi, Kerala - 682030",
    locationAddress:
      "Unit No. 15, AJ Commercial Complex, Edappally, Kochi, Kerala - 682024",
    rentAmount: 18000,
    cgstPercent: 9,
    sgstPercent: 9,
    active: true,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
  },
];
