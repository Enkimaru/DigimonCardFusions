const fetchAPI = {
  async getCardList() {
    return await fetch(
      "https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/main/db/cardList.json"
    ).then((response) => response.json());
  },

  async getSpecialFusionList() {
    return await fetch(
      "https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/main/db/specialFusions.json"
    ).then((response) => response.json());
  },
};
