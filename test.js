const axios = require('axios');
const getLeaderboard = async () => {
    const guildId = '709930458086899723';
    try {
        const res = await axios.get(
            `https://mee6.xyz/api/plugins/levels/leaderboard/${guildId}?limit=5?id=361868131997843456`
        );
        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
};

getLeaderboard();
