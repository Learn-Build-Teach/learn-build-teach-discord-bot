const Airtable = require('airtable');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID
);

const shareTable = base(process.env.AIRTABLE_SHARE_TABLE_NAME);
const userTable = base(process.env.AIRTABLE_USER_TABLE_NAME);

const minifyRecord = (record) => {
  return {
    id: record.id,
    fields: record.fields,
  };
};

const migrateUsersToPlanetScale = async () => {
  try {
    const records = minifyRecords(
      await userTable
        .select({
          maxRecords: 100,
        })
        .firstPage()
    );
    const usersToMigrate = records.map(({ fields }) => ({
      id: fields.discordId,
      twitter: fields.twitter,
      youtube: fields.youtube,
      username: fields.discordUsername,
    }));
    await prisma.user.createMany({
      data: usersToMigrate,
    });
    console.info(`Migrated ${records.length} users`);
  } catch (err) {
    console.error(err);
  }
};

const migrateSharesToPlanetScale = async () => {
  try {
    const records = minifyRecords(
      await shareTable
        .select({
          maxRecords: 300,
        })
        .firstPage()
    );
    const sharesToMigrate = records
      .filter(
        (record) =>
          record.fields.discordId &&
          record.fields.title &&
          record.fields.link &&
          record.fields.description &&
          record.fields.description.length < 500
      )
      .map(({ fields }) => ({
        title: fields.title,
        link: fields.link,
        description: fields.description,
        emailed: fields.emailed || false,
        emailable: fields.emailable || false,
        tweetable: fields.tweetable || false,
        tweeted: fields.tweeted || false,
        imageUrl: fields.image,
        userId: fields.discordId,
      }));

    await prisma.share.createMany({
      data: sharesToMigrate,
    });
    console.info(`Migrated ${sharesToMigrate.length} shares`);
  } catch (err) {
    console.error(err);
  }
};

const minifyRecords = (records) =>
  records.map((record) => minifyRecord(record));

const migrate = async () => {
  const { count } = await prisma.share.deleteMany();
  console.info(`Deleted ${count} shares`);

  const { count: kudoCount } = await prisma.kudo.deleteMany();
  console.info(`Deleted ${kudoCount} kudos`);

  const { count: userCount } = await prisma.user.deleteMany();
  console.info(`Deleted ${userCount} users`);

  await migrateUsersToPlanetScale();
  await migrateSharesToPlanetScale();
};

migrate();
