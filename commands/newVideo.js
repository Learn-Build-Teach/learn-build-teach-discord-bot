module.exports = {
    callback: async (msg) => {
        //TODO:Check message comes from mee6 bot
        //TODO: find metadata for video - link, image, creator
        //TODO: add to share table in airtabl
        console.log(msg);
        console.log(msg.author);
        console.log(msg.content);
        console.log('Logging example YouTube video notification');
    },
};
