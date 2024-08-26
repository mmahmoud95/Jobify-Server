const { UnAuthenticatedError } = require("../errors");

const checkPermissions = (reqUser, userJobCreatedId) => {
    if (reqUser === userJobCreatedId.toString()) return;
    throw new UnAuthenticatedError("Not authorized to access this");
};

module.exports = checkPermissions;
