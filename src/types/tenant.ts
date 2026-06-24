export interface Tenant {
  id: string;
  tenantName: string;
  tenantCode: string;
  tenantGstin: string;
  tenantAddress: string;
  locationAddress: string;
  rentAmount: number;
  cgstPercent: number;
  sgstPercent: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}