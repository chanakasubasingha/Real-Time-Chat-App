const moment = require('moment');

const generateMessage = (text, username) => {
    return {
        type: 'msg',
        username,
        res: text,
        createdAt: moment().format("hh:mm a")
    };
};

const generateLocation = ({ latitude, longitude }, username) => {
    return {
        type: 'loc',
        username,
        res: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().format("hh:mm a")
    };
};

module.exports = {
    generateMessage,
    generateLocation
};