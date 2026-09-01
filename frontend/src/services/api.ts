import axios from 'axios';
import type {
  Article,
  EventItem,
  Member,
  CommercialOpportunity,
  Alliance,
  InstitutionalSection,
  Authority,
  Settings,
  HomeData,
  MembershipApplication,
  ContactMessage,
  User,
  PartnerResource,
  PartnerBenefit,
  PartnerDashboardData,
  Banner,
  Blog,
  PhotoAlbum,
  GalleryPhoto,
} from '../types';

// URL Base de la API del Backend (Modificar manualmente aquí para producción)
//const API_BASE_URL = 'http://127.0.0.1:8080/index.php/api';
const API_BASE_URL = 'https://api.cicha.com.ar/index.php/api';


export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('cicha_jwt_token');
  if (token) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['X-Authorization'] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token expiry handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if ((window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/portal-socios')) && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('cicha_jwt_token');
        localStorage.removeItem('cicha_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API Service (Visitante)
export const publicApi = {
  getHomeData: () => apiClient.get<{ status: number; data: HomeData }>('/public/home').then((res) => res.data.data),
  getBanners: () => apiClient.get<{ status: number; data: Banner[] }>('/public/banners').then((res) => res.data.data),
  
  getInstitutional: () =>
    apiClient
      .get<{ status: number; data: { sections: InstitutionalSection[]; authorities: Authority[]; alliances: Alliance[] } }>(
        '/public/institutional'
      )
      .then((res) => res.data.data),

  getArticles: (category?: string, search?: string) =>
    apiClient
      .get<{ status: number; data: { articles: Article[]; categories: Array<{ id: number; name: string; slug: string }> } }>(
        '/public/articles',
        { params: { category, q: search } }
      )
      .then((res) => res.data.data),

  getArticleBySlug: (slug: string) =>
    apiClient
      .get<{ status: number; data: { article: Article; related: Article[] } }>(`/public/articles/${slug}`)
      .then((res) => res.data.data),

  getBlogs: (category?: string, search?: string) =>
    apiClient
      .get<{ status: number; data: { blogs: Blog[]; categories: string[] } }>(
        '/public/blogs',
        { params: { category, q: search } }
      )
      .then((res) => res.data.data),

  getBlog: (slug: string) =>
    apiClient.get<{ status: number; data: { blog: Blog; related: Blog[] } }>(`/public/blogs/${slug}`).then((res) => res.data.data),

  getGallery: (category?: string) =>
    apiClient
      .get<{ status: number; data: { albums: PhotoAlbum[]; all_photos: GalleryPhoto[]; categories: string[] } }>(
        '/public/gallery',
        { params: { category } }
      )
      .then((res) => res.data.data),

  getAlbum: (slug: string) =>
    apiClient.get<{ status: number; data: PhotoAlbum }>(`/public/gallery/${slug}`).then((res) => res.data.data),

  getEvents: (filter?: 'upcoming' | 'past' | 'all') =>
    apiClient.get<{ status: number; data: EventItem[] }>('/public/events', { params: { filter } }).then((res) => res.data.data),

  getMembers: (sector?: string, search?: string) =>
    apiClient
      .get<{ status: number; data: Member[] }>('/public/members', { params: { sector, q: search } })
      .then((res) => res.data.data),

  getOpportunities: (type?: string) =>
    apiClient
      .get<{ status: number; data: CommercialOpportunity[] }>('/public/opportunities', { params: { type } })
      .then((res) => res.data.data),

  getAlliances: () =>
    apiClient.get<{ status: number; data: Alliance[] }>('/public/alliances').then((res) => res.data.data),

  getSettings: () =>
    apiClient.get<{ status: number; data: Settings }>('/public/settings').then((res) => res.data.data),

  submitContact: (data: { name: string; email: string; phone?: string; subject: string; message: string }) =>
    apiClient.post<{ status: number; message: string }>('/public/contact', data).then((res) => res.data),

  submitApplication: (data: {
    company_name: string;
    contact_name: string;
    contact_role?: string;
    email: string;
    phone: string;
    cuit_rut?: string;
    sector: string;
    website?: string;
    interests?: string | string[];
    comments?: string;
  }) => apiClient.post<{ status: number; message: string }>('/public/apply', data).then((res) => res.data),
};

// Exclusive Partner Portal API Service (Role: socio, admin, secretario)
export const partnerApi = {
  getDashboard: () =>
    apiClient.get<{ status: number; data: PartnerDashboardData }>('/partner/dashboard').then((res) => res.data.data),

  getResources: (category?: string) =>
    apiClient
      .get<{ status: number; data: PartnerResource[] }>('/partner/resources', { params: { category } })
      .then((res) => res.data.data),

  downloadResource: (id: number) =>
    apiClient
      .post<{ status: number; url: string; title: string; message: string }>(`/partner/resources/${id}/download`)
      .then((res) => res.data),

  getOpportunities: (type?: string) =>
    apiClient
      .get<{ status: number; data: CommercialOpportunity[] }>('/partner/opportunities', { params: { type } })
      .then((res) => res.data.data),

  getBenefits: () =>
    apiClient.get<{ status: number; data: PartnerBenefit[] }>('/partner/benefits').then((res) => res.data.data),

  getDirectory: (search?: string, sector?: string) =>
    apiClient
      .get<{ status: number; data: Member[] }>('/partner/directory', { params: { q: search, sector } })
      .then((res) => res.data.data),
};

// Admin API Service (Roles: admin, secretario)
export const adminApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient
      .post<{ status: number; message: string; token: string; user: User }>('/auth/login', credentials)
      .then((res) => res.data),

  getMe: () => apiClient.get<{ status: number; user: User }>('/auth/me').then((res) => res.data.user),

  updateProfile: (data: { name?: string; avatar?: string; password?: string }) =>
    apiClient.post<{ status: number; message: string; user: User }>('/auth/profile', data).then((res) => res.data),

  getDashboard: () =>
    apiClient
      .get<{
        status: number;
        data: {
          stats: {
            total_articles: number;
            total_events: number;
            total_members: number;
            total_opportunities: number;
            pending_applications: number;
            unread_messages: number;
          };
          recent_applications: MembershipApplication[];
          recent_messages: ContactMessage[];
          recent_articles: Article[];
        };
      }>('/admin/dashboard')
      .then((res) => res.data.data),

  // Users (Admin only)
  getUsers: () => apiClient.get<{ status: number; data: User[] }>('/admin/users').then((res) => res.data.data),
  createUser: (data: Partial<User> & { password?: string }) => apiClient.post('/admin/users', data).then((res) => res.data),
  updateUser: (id: number | string, data: Partial<User> & { password?: string }) =>
    apiClient.put(`/admin/users/${id}`, data).then((res) => res.data),
  deleteUser: (id: number | string) => apiClient.delete(`/admin/users/${id}`).then((res) => res.data),

  // Articles (Admin & Secretario)
  getArticles: () => apiClient.get<{ status: number; data: Article[] }>('/admin/articles').then((res) => res.data.data),
  getArticle: (id: number) => apiClient.get<{ status: number; data: Article }>(`/admin/articles/${id}`).then((res) => res.data.data),
  createArticle: (data: Partial<Article>) => apiClient.post('/admin/articles', data).then((res) => res.data),
  updateArticle: (id: number, data: Partial<Article>) => apiClient.put(`/admin/articles/${id}`, data).then((res) => res.data),
  deleteArticle: (id: number) => apiClient.delete(`/admin/articles/${id}`).then((res) => res.data),

  // Blogs (Admin & Secretario)
  getBlogs: () => apiClient.get<{ status: number; data: Blog[] }>('/admin/blogs').then((res) => res.data.data),
  getBlog: (id: number) => apiClient.get<{ status: number; data: Blog }>(`/admin/blogs/${id}`).then((res) => res.data.data),
  createBlog: (data: Partial<Blog>) => apiClient.post('/admin/blogs', data).then((res) => res.data),
  updateBlog: (id: number, data: Partial<Blog>) => apiClient.put(`/admin/blogs/${id}`, data).then((res) => res.data),
  deleteBlog: (id: number) => apiClient.delete(`/admin/blogs/${id}`).then((res) => res.data),

  // Gallery / Photo Albums (Admin & Secretario)
  getAlbums: () => apiClient.get<{ status: number; data: PhotoAlbum[] }>('/admin/gallery').then((res) => res.data.data),
  getAlbum: (id: number) => apiClient.get<{ status: number; data: PhotoAlbum }>(`/admin/gallery/${id}`).then((res) => res.data.data),
  createAlbum: (data: Partial<PhotoAlbum> & { photos?: Array<{ image_url: string; caption?: string } | string> }) =>
    apiClient.post('/admin/gallery', data).then((res) => res.data),
  updateAlbum: (id: number, data: Partial<PhotoAlbum> & { photos?: Array<{ image_url: string; caption?: string } | string> }) =>
    apiClient.put(`/admin/gallery/${id}`, data).then((res) => res.data),
  deleteAlbum: (id: number) => apiClient.delete(`/admin/gallery/${id}`).then((res) => res.data),
  addAlbumPhoto: (albumId: number, data: { image_url: string; caption?: string; order_num?: number }) =>
    apiClient.post(`/admin/gallery/${albumId}/photos`, data).then((res) => res.data),
  deleteAlbumPhoto: (photoId: number) => apiClient.delete(`/admin/gallery/photos/${photoId}`).then((res) => res.data),

  // Home Banners / Portadas (Admin & Secretario)
  getBanners: () => apiClient.get<{ status: number; data: Banner[] }>('/admin/banners').then((res) => res.data.data),
  getBanner: (id: number) => apiClient.get<{ status: number; data: Banner }>(`/admin/banners/${id}`).then((res) => res.data.data),
  createBanner: (data: Partial<Banner>) => apiClient.post('/admin/banners', data).then((res) => res.data),
  updateBanner: (id: number, data: Partial<Banner>) => apiClient.put(`/admin/banners/${id}`, data).then((res) => res.data),
  deleteBanner: (id: number) => apiClient.delete(`/admin/banners/${id}`).then((res) => res.data),

  // Events (Admin & Secretario)
  getEvents: () => apiClient.get<{ status: number; data: EventItem[] }>('/admin/events').then((res) => res.data.data),
  getEvent: (id: number) => apiClient.get<{ status: number; data: EventItem }>(`/admin/events/${id}`).then((res) => res.data.data),
  createEvent: (data: Partial<EventItem>) => apiClient.post('/admin/events', data).then((res) => res.data),
  updateEvent: (id: number, data: Partial<EventItem>) => apiClient.put(`/admin/events/${id}`, data).then((res) => res.data),
  deleteEvent: (id: number) => apiClient.delete(`/admin/events/${id}`).then((res) => res.data),

  // Members (Admin & Secretario)
  getMembers: () => apiClient.get<{ status: number; data: Member[] }>('/admin/members').then((res) => res.data.data),
  getMember: (id: number) => apiClient.get<{ status: number; data: Member }>(`/admin/members/${id}`).then((res) => res.data.data),
  createMember: (data: Partial<Member>) => apiClient.post('/admin/members', data).then((res) => res.data),
  updateMember: (id: number, data: Partial<Member>) => apiClient.put(`/admin/members/${id}`, data).then((res) => res.data),
  deleteMember: (id: number) => apiClient.delete(`/admin/members/${id}`).then((res) => res.data),

  // Opportunities (Admin & Secretario)
  getOpportunities: () =>
    apiClient.get<{ status: number; data: CommercialOpportunity[] }>('/admin/opportunities').then((res) => res.data.data),
  getOpportunity: (id: number) =>
    apiClient.get<{ status: number; data: CommercialOpportunity }>(`/admin/opportunities/${id}`).then((res) => res.data.data),
  createOpportunity: (data: Partial<CommercialOpportunity>) => apiClient.post('/admin/opportunities', data).then((res) => res.data),
  updateOpportunity: (id: number, data: Partial<CommercialOpportunity>) =>
    apiClient.put(`/admin/opportunities/${id}`, data).then((res) => res.data),
  deleteOpportunity: (id: number) => apiClient.delete(`/admin/opportunities/${id}`).then((res) => res.data),

  // Partner Resources (Admin & Secretario)
  getPartnerResources: () =>
    apiClient.get<{ status: number; data: PartnerResource[] }>('/admin/partner-resources').then((res) => res.data.data),
  createPartnerResource: (data: Partial<PartnerResource>) =>
    apiClient.post('/admin/partner-resources', data).then((res) => res.data),
  updatePartnerResource: (id: number, data: Partial<PartnerResource>) =>
    apiClient.put(`/admin/partner-resources/${id}`, data).then((res) => res.data),
  deletePartnerResource: (id: number) =>
    apiClient.delete(`/admin/partner-resources/${id}`).then((res) => res.data),

  // Partner Benefits (Admin & Secretario)
  getPartnerBenefits: () =>
    apiClient.get<{ status: number; data: PartnerBenefit[] }>('/admin/partner-benefits').then((res) => res.data.data),
  createPartnerBenefit: (data: Partial<PartnerBenefit>) =>
    apiClient.post('/admin/partner-benefits', data).then((res) => res.data),
  updatePartnerBenefit: (id: number, data: Partial<PartnerBenefit>) =>
    apiClient.put(`/admin/partner-benefits/${id}`, data).then((res) => res.data),
  deletePartnerBenefit: (id: number) =>
    apiClient.delete(`/admin/partner-benefits/${id}`).then((res) => res.data),

  // Authorities (Admin only)
  getAuthorities: () => apiClient.get<{ status: number; data: Authority[] }>('/admin/authorities').then((res) => res.data.data),
  createAuthority: (data: Partial<Authority>) => apiClient.post('/admin/authorities', data).then((res) => res.data),
  updateAuthority: (id: number, data: Partial<Authority>) => apiClient.put(`/admin/authorities/${id}`, data).then((res) => res.data),
  deleteAuthority: (id: number) => apiClient.delete(`/admin/authorities/${id}`).then((res) => res.data),

  // Institutional Sections (Admin only)
  getInstitutional: () =>
    apiClient.get<{ status: number; data: InstitutionalSection[] }>('/admin/institutional').then((res) => res.data.data),
  updateInstitutional: (id: number, data: Partial<InstitutionalSection>) =>
    apiClient.put(`/admin/institutional/${id}`, data).then((res) => res.data),

  // Alliances (Admin only)
  getAlliances: () => apiClient.get<{ status: number; data: Alliance[] }>('/admin/alliances').then((res) => res.data.data),
  createAlliance: (data: Partial<Alliance>) => apiClient.post('/admin/alliances', data).then((res) => res.data),
  updateAlliance: (id: number, data: Partial<Alliance>) => apiClient.put(`/admin/alliances/${id}`, data).then((res) => res.data),
  deleteAlliance: (id: number) => apiClient.delete(`/admin/alliances/${id}`).then((res) => res.data),

  // Applications (Admin & Secretario)
  getApplications: (status?: string) =>
    apiClient.get<{ status: number; data: MembershipApplication[] }>('/admin/applications', { params: { status } }).then((res) => res.data.data),
  updateApplication: (id: number, data: { status?: string; notes?: string }) =>
    apiClient.put(`/admin/applications/${id}`, data).then((res) => res.data),
  deleteApplication: (id: number) => apiClient.delete(`/admin/applications/${id}`).then((res) => res.data),

  // Messages (Admin & Secretario)
  getMessages: (status?: string) =>
    apiClient.get<{ status: number; data: ContactMessage[] }>('/admin/messages', { params: { status } }).then((res) => res.data.data),
  getMessage: (id: number) => apiClient.get<{ status: number; data: ContactMessage }>(`/admin/messages/${id}`).then((res) => res.data.data),
  updateMessage: (id: number, data: { is_read?: number; status?: string }) =>
    apiClient.put(`/admin/messages/${id}`, data).then((res) => res.data),
  deleteMessage: (id: number) => apiClient.delete(`/admin/messages/${id}`).then((res) => res.data),

  // Settings (Admin only)
  getSettings: () => apiClient.get<{ status: number; data: Settings }>('/admin/settings').then((res) => res.data.data),
  updateSettings: (settings: Settings) => apiClient.post('/admin/settings', { settings }).then((res) => res.data),

  // Upload
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient
      .post<{ status: number; url: string; message: string }>('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => res.data);
  },
};
