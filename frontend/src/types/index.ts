export interface User {
  id: string | number;
  name: string;
  email: string;
  role: 'admin' | 'secretario' | 'socio';
  member_id?: number | null;
  member_company_name?: string | null;
  avatar?: string;
  status: 'active' | 'inactive';
}

export interface Settings {
  site_name?: string;
  site_acronym?: string;
  contact_email?: string;
  trade_email?: string;
  phone_primary?: string;
  phone_secondary?: string;
  address_street?: string;
  address_city?: string;
  address_country?: string;
  office_hours?: string;
  social_linkedin?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_instagram?: string;
  meta_description?: string;
  meta_keywords?: string;
  [key: string]: string | undefined;
}

export interface InstitutionalSection {
  id: number;
  section_key: string;
  title: string;
  subtitle?: string;
  content: string;
  image_url?: string;
  icon_name?: string;
  order_num: number;
  is_active: number | boolean;
  updated_at?: string;
}

export interface Authority {
  id: number;
  name: string;
  role_title: string;
  category: 'directiva' | 'honorario' | 'comite';
  company?: string;
  bio?: string;
  photo_url?: string;
  linkedin_url?: string;
  order_num: number;
  is_active: number | boolean;
}

export interface Alliance {
  id: number;
  name: string;
  slug: string;
  category: string;
  description?: string;
  website_url?: string;
  logo_url?: string;
  highlight_text?: string;
  order_num: number;
  is_active: number | boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  type: 'news' | 'events' | 'members' | 'opportunities';
}

export interface Article {
  id: number;
  category_id?: number;
  category_name?: string;
  category_slug?: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  image_url?: string;
  author: string;
  published_at: string;
  is_featured: number | boolean;
  status: 'published' | 'draft';
  created_at?: string;
}

export interface EventItem {
  id: number;
  category_id?: number;
  category_name?: string;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  end_date?: string;
  location_type: 'presencial' | 'virtual' | 'hibrido';
  location_address?: string;
  registration_url?: string;
  image_url?: string;
  organizer: string;
  is_featured: number | boolean;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Member {
  id: number;
  company_name: string;
  slug: string;
  sector: string;
  description?: string;
  services?: string;
  logo_url?: string;
  website_url?: string;
  contact_email?: string;
  contact_phone?: string;
  country: string;
  is_featured: number | boolean;
  status: 'active' | 'inactive';
}

export interface CommercialOpportunity {
  id: number;
  title: string;
  slug: string;
  type: 'export' | 'import' | 'investment' | 'partnership' | 'een_node';
  origin_country: string;
  target_country: string;
  sector: string;
  description: string;
  requirements?: string;
  contact_person?: string;
  contact_email?: string;
  status: 'open' | 'in_negotiation' | 'closed';
  deadline?: string;
  created_at?: string;
}

export interface MembershipApplication {
  id: number;
  company_name: string;
  contact_name: string;
  contact_role?: string;
  email: string;
  phone: string;
  cuit_rut?: string;
  sector: string;
  website?: string;
  interests?: string;
  comments?: string;
  status: 'pending' | 'in_review' | 'approved' | 'contacted' | 'rejected';
  notes?: string;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: number | boolean;
  status: 'new' | 'responded' | 'archived';
  created_at: string;
}

export interface PartnerResource {
  id: number;
  title: string;
  category: 'informe_mercado' | 'guia_legal' | 'minuta_asamblea' | 'circular_comercial';
  description?: string;
  file_url: string;
  file_type: string;
  file_size: string;
  downloads: number;
  is_active: number | boolean;
  created_at: string;
}

export interface PartnerBenefit {
  id: number;
  title: string;
  provider_company: string;
  category: string;
  discount_description: string;
  how_to_claim?: string;
  logo_url?: string;
  valid_until?: string;
  is_active: number | boolean;
  created_at: string;
}

export interface PartnerDashboardData {
  user: User;
  member_info?: Member | null;
  stats: {
    total_resources: number;
    total_benefits: number;
    total_opportunities: number;
    total_members: number;
  };
  latest_resources: PartnerResource[];
  active_benefits: PartnerBenefit[];
  vip_opportunities: CommercialOpportunity[];
  upcoming_events: EventItem[];
}

export interface HomeData {
  settings: Settings;
  mision?: InstitutionalSection;
  historia?: InstitutionalSection;
  alliances: Alliance[];
  featured_articles: Article[];
  upcoming_events: EventItem[];
  featured_members: Member[];
  opportunities: CommercialOpportunity[];
  stats: {
    years_active: number;
    binational_cams: number;
    een_coverage: string;
    eurocamara_since: string;
  };
}
