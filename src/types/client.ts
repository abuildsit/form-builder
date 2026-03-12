export interface ClientAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface ClientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  manager: string;
  industry: string;
  revenueTier: 'Small' | 'Mid-Market' | 'Enterprise';
  address: ClientAddress;
  contractStartDate: string;
}
