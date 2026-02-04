export type DefaultRole =
  | "super_admin"
  | "admin"
  | "manager"
  | "support"
  | "customer";

export type Resource =
  | "products"
  | "categories"
  | "coupon"
  | "orders"
  | "transaction"
  | "customers"
  | "report"
  | "audit_logs";

export type Action =
  | "create"
  | "read"
  | "list"
  | "update"
  | "delete"
  | "view"
  | "export"
  | "approve"
  | "reject";

export type PermissionName = `${Resource}:${Action}` | "*:*" | `${Resource}:*`;

export type RoleMapping = {
  [key in DefaultRole]: {
    permission: PermissionName;
    conditions?: Record<string, string>;
  }[];
};

export interface Permission {
  name: PermissionName;
  description: string;
  resource: Resource;
  action: Action;
}

export interface RolePermission {
  role: DefaultRole;
  permission: PermissionName;
  conditions?: Record<string, string>;
}
