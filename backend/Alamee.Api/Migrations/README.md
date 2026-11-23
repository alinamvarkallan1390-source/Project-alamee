# Migrations

The EF Core migration for the initial schema is generated with:

```bash
cd backend/Alamee.Api
dotnet ef migrations add InitialCreate
dotnet ef database update
```

The schema mirrors the Supabase PostgreSQL database used by the live deployment
(`website_settings`, `website_sections`, `projects`, `project_images`, `services`,
`media_files`, `three_d_models`, `contact_messages`, `seo_settings`,
`audit_logs`, `content_versions`, `admin_users` / Identity tables).
