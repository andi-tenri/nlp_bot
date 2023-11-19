const { Controller } = require("pepesan")

class MainControlller extends Controller {

    async index() {
        return "Oh, Hello!"
    }
}

module.exports = MainControlller