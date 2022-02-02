// Languages
const trLanguage = require("../../languages/tr.json");
const enLanguage = require("../../languages/en.json");

module.exports = class LanguageService {
  constructor(language) {
    switch (language) {
      case "tr":
        this.language = trLanguage;
        break;

      default:
        this.language = enLanguage;
        break;
    }
  }

  getCommands(key) {
    return this.language["commands"][key];
  }

  get(key) {
    if (key.includes(".")) {
      const keys = key.split(".");
      return this.get(keys[0])[keys[1]];
    }

    return this.language[key];
  }
};
