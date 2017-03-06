/**
 * Error caused when config is malformatted.
 * @private
 */
class BadConfigError extends Error {
    constructor(item) {
        super(`AirMap Auth - unable to initialize due to missing configuration item: ${item}`);
    }
}


module.exports = { BadConfigError }
