import Airtable from 'airtable'
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
)

export const shareTable = base(process.env.AIRTABLE_SHARE_TABLE_NAME)
export const userTable = base(process.env.AIRTABLE_USER_TABLE_NAME)

export const minifyRecord = (record) => {
    if (!record.fields.completed) record.fields.completed = false
    return {
        id: record.id,
        fields: record.fields,
    }
}

export const getDiscordUserById = async (id) => {
    const records = minifyRecords(
        await userTable
            .select({
                maxRecords: 1,
                filterByFormula: `{discordId} = "${id}"`,
            })
            .firstPage()
    )

    if (records.length !== 1) {
        return null
    }
    return records[0]
}

export const getShareRecordToTweet = async () => {
    const records = minifyRecords(
        await shareTable
            .select({
                maxRecords: 1,
                filterByFormula: `AND({tweetable} = "1", {tweeted} != "1")`,
            })
            .firstPage()
    )
    if (records.length !== 1) return null
    return records[0]
}

export const minifyRecords = (records) =>
    records.map((record) => minifyRecord(record))

export const deleteUserRecord = async (discordId) => {
    return userTable.destroy([discordId])
}
