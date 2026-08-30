CREATE SCHEMA IF NOT EXISTS "CLARIO";

CREATE TABLE "CLARIO"."schema_migrations" (
  "version" NVARCHAR(120) PRIMARY KEY,
  "applied_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP
);

CREATE TABLE "CLARIO"."app_user" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "name" NVARCHAR(160) NOT NULL,
  "email" NVARCHAR(320) NOT NULL UNIQUE,
  "password_hash" NVARCHAR(512) NOT NULL,
  "must_change_password" BOOLEAN NOT NULL DEFAULT TRUE,
  "disabled" BOOLEAN NOT NULL DEFAULT FALSE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP
);

CREATE TABLE "CLARIO"."app_session" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "user_id" NVARCHAR(36) NOT NULL,
  "token_hash" NVARCHAR(128) NOT NULL UNIQUE,
  "expires_at" TIMESTAMP NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  CONSTRAINT "fk_session_user" FOREIGN KEY ("user_id") REFERENCES "CLARIO"."app_user"("id") ON DELETE CASCADE
);

CREATE TABLE "CLARIO"."organization" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "name" NVARCHAR(200) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP
);

CREATE TABLE "CLARIO"."workspace" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "organization_id" NVARCHAR(36) NOT NULL,
  "name" NVARCHAR(200) NOT NULL,
  "sap_url" NVARCHAR(500) NOT NULL,
  "sap_company" NVARCHAR(160) NOT NULL,
  "sap_user" NVARCHAR(160) NOT NULL,
  "sap_password_ciphertext" NCLOB NOT NULL,
  "sap_password_nonce" NVARCHAR(64) NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT TRUE,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  CONSTRAINT "fk_workspace_org" FOREIGN KEY ("organization_id") REFERENCES "CLARIO"."organization"("id") ON DELETE CASCADE
);

CREATE TABLE "CLARIO"."membership" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "organization_id" NVARCHAR(36) NOT NULL,
  "user_id" NVARCHAR(36) NOT NULL,
  "role" NVARCHAR(20) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  UNIQUE ("organization_id", "user_id"),
  CONSTRAINT "fk_membership_org" FOREIGN KEY ("organization_id") REFERENCES "CLARIO"."organization"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_membership_user" FOREIGN KEY ("user_id") REFERENCES "CLARIO"."app_user"("id") ON DELETE CASCADE
);

CREATE TABLE "CLARIO"."conversation" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "workspace_id" NVARCHAR(36) NOT NULL,
  "user_id" NVARCHAR(36) NOT NULL,
  "title" NVARCHAR(500) NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  CONSTRAINT "fk_conversation_workspace" FOREIGN KEY ("workspace_id") REFERENCES "CLARIO"."workspace"("id") ON DELETE CASCADE,
  CONSTRAINT "fk_conversation_user" FOREIGN KEY ("user_id") REFERENCES "CLARIO"."app_user"("id") ON DELETE CASCADE
);

CREATE TABLE "CLARIO"."chat_message" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "conversation_id" NVARCHAR(36) NOT NULL,
  "role" NVARCHAR(20) NOT NULL,
  "content" NCLOB NOT NULL,
  "parts_json" NCLOB NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  CONSTRAINT "fk_message_conversation" FOREIGN KEY ("conversation_id") REFERENCES "CLARIO"."conversation"("id") ON DELETE CASCADE
);

CREATE TABLE "CLARIO"."report_artifact" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "conversation_id" NVARCHAR(36) NOT NULL,
  "payload_json" NCLOB NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP,
  CONSTRAINT "fk_report_conversation" FOREIGN KEY ("conversation_id") REFERENCES "CLARIO"."conversation"("id") ON DELETE CASCADE
);

CREATE TABLE "CLARIO"."audit_event" (
  "id" NVARCHAR(36) PRIMARY KEY,
  "user_id" NVARCHAR(36),
  "workspace_id" NVARCHAR(36),
  "event" NVARCHAR(120) NOT NULL,
  "request_id" NVARCHAR(80) NOT NULL,
  "metadata_json" NCLOB NOT NULL,
  "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_UTCTIMESTAMP
);
