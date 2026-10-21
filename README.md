# Confo — Video Conference Rooms

Confo is a small video-conferencing hobby project built with Next.js, NextAuth, Prisma, MySQL and Stream Video. Users can create rooms, invite members, manage room membership, and start or schedule meetings.

## Run locally

1. Install Node.js (use a current LTS release) and MySQL.
2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Create `.env` with the following fields:
   - `DATABASE_URL`: your MySQL connection string.
   - `AUTH_SECRET`: a long random secret.
   - `NEXT_PUBLIC_STREAM_API_KEY` and `STREAM_SECRET_KEY`: Stream Video credentials. Keep the secret key server-side; 
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are optional. Google login is hidden until both are set.

4. Generate Prisma Client:

   ```bash
   npx prisma generate
   ```

5. Check the migration state before applying migrations:

   ```bash
   npx prisma migrate status
   ```

   For a brand-new database, `npx prisma migrate deploy` applies the migration history. **For an existing database, make a backup first and inspect pending migrations before deploying.** One older migration in this repository drops historical `Meetings` tables and columns. Do not apply pending historical migrations to a database with data until you have confirmed that migration is already applied or have reviewed a safe migration plan.

6. Start the app:

   ```bash
   npm run dev
   ```

   Open `http://localhost:3000`.


## Authentication and room access

- Email/password accounts are stored with a bcrypt password hash.
- NextAuth uses JWT sessions; the database user ID is used as the application identity.
- Google sign-in is optional and creates or updates a matching local user record.
- Room APIs check the current user on the server. Room details and deletion require the room admin; member management is also admin-only.
- New rooms store the admin's database user ID. A migration converts older display-name admin values only when a single matching room member can be identified. Ambiguous old records are deliberately left unchanged instead of granting admin rights to the wrong account.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npx prisma generate
```

## Notes

Stream Video is an external service, so meeting creation, joining, and recording retrieval need valid Stream credentials to be tested end-to-end. Recordings only appear when Stream has recordings available for the account/calls. Per-room call history now relies on the `roomId` custom field, so older Stream calls created before this fix may not appear or open through a room link. Do not commit `.env` or real credentials.
