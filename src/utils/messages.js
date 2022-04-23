const moment = require('moment');

const generateMessage = (text) => {
    return {
        type: 'msg',
        res: text,
        createdAt: moment().format("hh:mm a")
    };
};

const generateLocation = ({ latitude, longitude }) => {
    return {
        type: 'loc',
        res: `https://google.com/maps?q=${latitude},${longitude}`,
        createdAt: moment().format("hh:mm a")
    };
};

module.exports = {
    generateMessage,
    generateLocation
};