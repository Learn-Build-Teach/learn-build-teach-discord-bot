const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
);

const shareTable = base(process.env.AIRTABLE_SHARE_TABLE_NAME);
const userTable = base(process.env.AIRTABLE_USER_TABLE_NAME);

const minifyRecord = (record) => {
    if (!record.fields.completed) record.fields.completed = false;
    return {
        id: record.id,
        fields: record.fields,
    };
};

const minifyRecords = (records) =>
    records.map((record) => minifyRecord(record));

module.exports = { shareTable, minifyRecord, minifyRecords, userTable };
