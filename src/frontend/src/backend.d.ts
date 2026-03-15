import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Announcement {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
}
export interface VlogPost {
    id: bigint;
    title: string;
    thumbnailUrl: string;
    createdAt: bigint;
    description: string;
    category: VlogCategory;
    videoUrl: string;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum VlogCategory {
    vlog = "vlog",
    trading = "trading",
    promo = "promo"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createAnnouncement(title: string, content: string): Promise<void>;
    createVlogPost(title: string, description: string, videoUrl: string, thumbnailUrl: string, category: VlogCategory): Promise<void>;
    deleteAnnouncement(id: bigint): Promise<void>;
    deleteVlogPost(id: bigint): Promise<void>;
    fetchCryptoPrices(): Promise<string>;
    fetchWorldNews(): Promise<string>;
    getAnnouncement(id: bigint): Promise<Announcement>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVlogPost(id: bigint): Promise<VlogPost>;
    getVlogPosts(): Promise<Array<VlogPost>>;
    getVlogPostsByCategory(category: VlogCategory): Promise<Array<VlogPost>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAnnouncement(id: bigint, title: string, content: string): Promise<void>;
    updateVlogPost(id: bigint, title: string, description: string, videoUrl: string, thumbnailUrl: string, category: VlogCategory): Promise<void>;
}
