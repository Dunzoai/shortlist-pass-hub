export interface Service {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Affiliate {
  id: string
  name: string
  email: string | null
  phone: string | null
  payment_type: 'percentage' | 'flat' | null
  payment_amount: number | null
  payment_frequency: 'one_time' | 'monthly' | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  notes: string | null
  affiliate_id: string | null
  created_at: string
  updated_at: string
}

export interface ClientService {
  id: string
  client_id: string
  service_id: string
  monthly_cost: number
  one_time_cost: number
  status: 'active' | 'paused' | 'cancelled'
  start_date: string
  notes: string | null
  created_at: string
  updated_at: string
}

// Extended types with relations
export interface ClientWithRelations extends Client {
  affiliate?: Affiliate | null
  client_services?: (ClientService & { service: Service })[]
}

export interface AffiliateWithClients extends Affiliate {
  clients?: Client[]
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      services: {
        Row: Service
        Insert: Omit<Service, 'id' | 'created_at'>
        Update: Partial<Omit<Service, 'id' | 'created_at'>>
      }
      affiliates: {
        Row: Affiliate
        Insert: Omit<Affiliate, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Affiliate, 'id' | 'created_at' | 'updated_at'>>
      }
      clients: {
        Row: Client
        Insert: Omit<Client, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>
      }
      client_services: {
        Row: ClientService
        Insert: Omit<ClientService, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<ClientService, 'id' | 'created_at' | 'updated_at'>>
      }
    }
  }
}
