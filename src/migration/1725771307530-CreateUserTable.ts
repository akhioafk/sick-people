import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTableAndSeedUsers1725771307530
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'user') THEN
                    CREATE TABLE "user" (
                        "id" SERIAL NOT NULL,
                        "firstName" character varying NOT NULL,
                        "lastName" character varying NOT NULL,
                        "age" integer NOT NULL,
                        "gender" character varying NOT NULL,
                        "problems" boolean NOT NULL DEFAULT false,
                        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                    );
                END IF;
            END
            $$;
        `);

    const usersData = this.generateUsers(10);

    const batchSize = 10000;
    for (let i = 0; i < usersData.length; i += batchSize) {
      const batch = usersData.slice(i, i + batchSize);
      const values = batch
        .map(
          (user) =>
            `('${user.firstName}', '${user.lastName}', ${user.age}, '${user.gender}', ${user.problems})`,
        )
        .join(', ');

      await queryRunner.query(`
                INSERT INTO "user" ("firstName", "lastName", "age", "gender", "problems")
                VALUES ${values};
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
  }

  private generateUsers(count: number) {
    const users = [];
    const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Michael', 'Sarah'];
    const lastNames = ['Doe', 'Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
    const genders = ['male', 'female'];

    for (let i = 0; i < count; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const age = Math.floor(Math.random() * 82) + 18;
      const gender = genders[Math.floor(Math.random() * genders.length)];
      const problems = Math.random() < 0.5;

      users.push({
        firstName,
        lastName,
        age,
        gender,
        problems,
      });
    }

    return users;
  }
}
