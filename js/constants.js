const constants = {
  getColorList() {
    return [
      { color: "Red", maxValue: 35 },
      { color: "Blue", maxValue: 35 },
      { color: "Green", maxValue: 32 },
      { color: "Black", maxValue: 35 },
      { color: "Yellow", maxValue: 33 },
      { color: "Option", maxValue: 35 },
    ];
  },

  getColorMatrix() {
    return [
      ["Option", "Green", "Black", "Yellow", "Blue", "Red"],
      ["Green", "Option", "Yellow", "Red", "Green", "Blue"],
      ["Black", "Yellow", "Option", "Blue", "Black", "Green"],
      ["Yellow", "Red", "Blue", "Option", "Red", "Black"],
      ["Blue", "Green", "Black", "Red", "Option", "Yellow"],
      ["Red", "Blue", "Green", "Black", "Yellow", "Option"],
    ];
  },
};
