export interface BadgeQuery {
  logoColor?: string;
  logoPosition?: "left" | "right" | string;
}

export interface BadgeParams {
  label: string;
  message: string;
  messageColor: string;
  labelColor: string;
  logo?: string;
}