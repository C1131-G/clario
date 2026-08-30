import { AppError } from "@/lib/server/errors";

export const workspaceRoles = ["owner", "admin", "analyst", "viewer"] as const;
export type WorkspaceRole = (typeof workspaceRoles)[number];

const permissions = {
  adminUsers: ["owner"],
  configureSap: ["owner", "admin"],
  deleteConversation: ["owner", "admin", "analyst"],
  generateReport: ["owner", "admin", "analyst"],
  readReport: ["owner", "admin", "analyst", "viewer"],
} as const satisfies Record<string, readonly WorkspaceRole[]>;

export const assertPermission = (
  role: WorkspaceRole,
  permission: keyof typeof permissions
) => {
  // SAFETY: every permission list contains only WorkspaceRole literals.
  if (!(permissions[permission] as readonly string[]).includes(role)) {
    throw new AppError(
      "FORBIDDEN",
      "You do not have access to this action.",
      403
    );
  }
};

export const isWorkspaceRole = (value: string): value is WorkspaceRole =>
  // SAFETY: the membership check narrows the string to the literal role union.
  workspaceRoles.includes(value as WorkspaceRole);
