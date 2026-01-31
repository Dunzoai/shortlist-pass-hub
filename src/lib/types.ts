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

export interface Service {
  id: string
  name: string
  description: string | null
  created_at: string
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
  is_active: boolean
  created_at: string
  updated_at: string
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

export interface Invoice {
  id: string
  client_id: string
  invoice_number: string
  amount: number
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  due_date: string | null
  paid_at: string | null
  stripe_payment_intent_id: string | null
  stripe_invoice_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  invoice_id: string
  client_id: string
  amount: number
  stripe_payment_intent_id: string | null
  payment_method_last4: string | null
  status: 'pending' | 'succeeded' | 'failed'
  paid_at: string | null
  created_at: string
}

export interface RecurringBilling {
  id: string
  client_id: string
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  status: 'active' | 'cancelled' | 'paused'
  next_billing_date: string | null
  created_at: string
}
