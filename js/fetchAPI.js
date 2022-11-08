const fetchAPI = {
  async getCardList() {
    return await fetch(
      "https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/color-fusion/main/cardList.json"
    ).then((response) => response.json());
  },

  async getSpecialFusionList() {
    return await fetch(
      "https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/color-fusion/main/specialFusions.json"
    ).then((response) => response.json());
  },
};
