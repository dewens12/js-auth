/** class for doing something */

class Core {

    constructor() {
        // settings
        this._name = 'doody'
    }

    /**
     *  Logs greeting to the console
     *  @public
     *  @return this
     */
    log() {
        console.log(`howdy ${this._name}`)
        return this
    }

}


module.exports = Core
