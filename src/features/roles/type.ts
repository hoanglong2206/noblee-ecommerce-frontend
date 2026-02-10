export const resources = [
  "user",
  "product",
  "order",
  "payment",
  "voucher",
  "category",
  "inventory",
  "report",
  "setting",
  "staff",
  "customer",
  "review",
  "log",
];

export const actions = [
  "manage",
  "create",
  "read",
  "update",
  "delete",
  "approve",
  "reject",
  "export",
];

export type Permission = {
  id: string;
  displayName: string;
  description: string;
  resource: string;
  action: string;
  isActive: boolean;
};

export type Role = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  color: string;
  userCount: number;
  isActive: boolean;
};

export type Attribute = {
  id: string;
  name: string;
  type: "user" | "resource" | "environment";
  dataType: "string" | "number" | "boolean" | "enum" | "ip_range";
  possibleValues?: string[];
  description: string;
  isSystem: boolean;
};

export type PolicyCondition = {
  attribute: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "in"
    | "between";
  value: string;
};

export type Policy = {
  id: string;
  name: string;
  description: string;
  effect: "allow" | "deny";
  resource: string;
  action: string;
  priority: number;
  roles: string[];
  conditions: PolicyCondition[];
  isActive: boolean;
};
