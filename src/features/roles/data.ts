import { Permission, RoleMapping } from "./type";

export const permissionsList: Permission[] = [
  // ========== USERS ==========
  {
    resource: "customers",
    action: "list",
    name: "customers:list",
    description: "List customers",
  },
  {
    resource: "customers",
    action: "create",
    name: "customers:create",
    description: "Create new customers",
  },
  {
    resource: "customers",
    action: "read",
    name: "customers:read",
    description: "View customer information",
  },
  {
    resource: "customers",
    action: "update",
    name: "customers:update",
    description: "Update customer information",
  },
  {
    resource: "customers",
    action: "delete",
    name: "customers:delete",
    description: "Delete customers",
  },
  {
    resource: "customers",
    action: "export",
    name: "customers:export",
    description: "Export customer data",
  },

  // ========== PRODUCTS ==========
  {
    resource: "products",
    action: "list",
    name: "products:list",
    description: "List products",
  },
  {
    resource: "products",
    action: "create",
    name: "products:create",
    description: "Create new products",
  },
  {
    resource: "products",
    action: "read",
    name: "products:read",
    description: "View products",
  },
  {
    resource: "products",
    action: "update",
    name: "products:update",
    description: "Update products",
  },
  {
    resource: "products",
    action: "delete",
    name: "products:delete",
    description: "Delete products",
  },
  {
    resource: "products",
    action: "export",
    name: "products:export",
    description: "Export product data",
  },

  // ========== CATEGORIES ==========
  {
    resource: "categories",
    action: "list",
    name: "categories:list",
    description: "List categories",
  },
  {
    resource: "categories",
    action: "create",
    name: "categories:create",
    description: "Create categories",
  },
  {
    resource: "categories",
    action: "read",
    name: "categories:read",
    description: "View categories",
  },
  {
    resource: "categories",
    action: "update",
    name: "categories:update",
    description: "Update categories",
  },
  {
    resource: "categories",
    action: "delete",
    name: "categories:delete",
    description: "Delete categories",
  },

  // ========== ORDERS ==========
  {
    resource: "orders",
    action: "list",
    name: "orders:list",
    description: "List orders",
  },
  {
    resource: "orders",
    action: "create",
    name: "orders:create",
    description: "Create orders",
  },
  {
    resource: "orders",
    action: "read",
    name: "orders:read",
    description: "View orders",
  },
  {
    resource: "orders",
    action: "update",
    name: "orders:update",
    description: "Update order status",
  },
  {
    resource: "orders",
    action: "delete",
    name: "orders:delete",
    description: "Cancel/delete orders",
  },
  {
    resource: "orders",
    action: "export",
    name: "orders:export",
    description: "Export order data",
  },
  {
    resource: "orders",
    action: "approve",
    name: "orders:approve",
    description: "Approve orders",
  },
  {
    resource: "orders",
    action: "reject",
    name: "orders:reject",
    description: "Reject/cancel orders",
  },

  // ========== TRANSACTIONS ==========
  {
    resource: "transactions",
    action: "list",
    name: "transactions:list",
    description: "List transactions",
  },
  {
    resource: "transactions",
    action: "read",
    name: "transactions:read",
    description: "View transaction information",
  },
  {
    resource: "transactions",
    action: "export",
    name: "transactions:export",
    description: "Export transaction data",
  },

  // ========== COUPONS ==========
  {
    resource: "coupons",
    action: "list",
    name: "coupons:list",
    description: "List coupons",
  },
  {
    resource: "coupons",
    action: "create",
    name: "coupons:create",
    description: "Create coupons",
  },
  {
    resource: "coupons",
    action: "read",
    name: "coupons:read",
    description: "View coupon",
  },
  {
    resource: "coupons",
    action: "update",
    name: "coupons:update",
    description: "Update coupons",
  },
  {
    resource: "coupons",
    action: "delete",
    name: "coupons:delete",
    description: "Delete coupons",
  },

  // ========== REPORTS ==========
  {
    resource: "reports",
    action: "list",
    name: "reports:list",
    description: "List reports",
  },
  {
    resource: "reports",
    action: "export",
    name: "reports:export",
    description: "Export reports",
  },

  // ========== AUDIT LOGS ==========
  {
    resource: "audit_logs",
    action: "list",
    name: "audit_logs:list",
    description: "List audit logs",
  },
  {
    resource: "audit_logs",
    action: "read",
    name: "audit_logs:read",
    description: "Read audit logs",
  },
  {
    resource: "audit_logs",
    action: "export",
    name: "audit_logs:export",
    description: "Export audit logs",
  },
];

export const roleMapping: RoleMapping = {
  super_admin: [
    {
      permission: "*:*",
    },
  ],
  admin: [
    {
      permission: "staff:*",
      conditions: {
        role: ["manager", "support"],
      },
    },
    {
      permission: "customers:*",
    },
    {
      permission: "products:*",
    },
    {
      permission: "categories:*",
    },
    {
      permission: "orders:*",
    },
    {
      permission: "transactions:*",
    },
    {
      permission: "coupons:*",
    },
    {
      permission: "reports:*",
    },
    {
      permission: "audit_logs:*",
    },
  ],
  manager: [
    {
      permission: "customers:list",
    },
    {
      permission: "customers:read",
    },
    {
      permission: "products:*",
    },
    {
      permission: "categories:*",
    },
    {
      permission: "orders:*",
    },
    {
      permission: "transactions:list",
    },
    {
      permission: "transactions:read",
    },
    {
      permission: "coupons:list",
    },
    {
      permission: "coupons:read",
    },
  ],
  support: [
    {
      permission: "customers:read",
    },
    {
      permission: "customers:update",
    },
    {
      permission: "products:read",
    },
    {
      permission: "categories:read",
    },
    {
      permission: "orders:read",
    },
    {
      permission: "orders:update",
    },
    {
      permission: "transactions:read",
    },
    {
      permission: "coupons:read",
    },
  ],
  customer: [
    {
      permission: "products:list",
    },
    {
      permission: "products:read",
    },
    {
      permission: "customers:read",
      conditions: {
        owner: "${userId}",
      },
    },
    {
      permission: "customers:update",
      conditions: {
        owner: "${userId}",
      },
    },
    {
      permission: "orders:list",
      conditions: {
        owner: "${userId}",
      },
    },
    {
      permission: "orders:read",
      conditions: {
        owner: "${userId}",
      },
    },
    {
      permission: "orders:update",
      conditions: {
        owner: "${userId}",
      },
    },
  ],
};
