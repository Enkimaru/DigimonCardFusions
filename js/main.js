const colorMatrix = constants.getColorMatrix();
const colorList = constants.getColorList();

const resultDiv = document.getElementById("fusionResult");
const firstCardList = document.getElementById("firstCard");
const secondCardList = document.getElementById("secondCard");
const availableCardList = document.getElementById("availableCardList");
const firstCardImage = document.getElementById("firstCardImage");
const secondCardImage = document.getElementById("secondCardImage");

var originalCardList = {};
var currentCardList = {};
var specialFusionsList = {};

buildPage();

async function buildPage() {
  originalCardList = await fetchAPI.getCardList();
  currentCardList = JSON.parse(JSON.stringify(originalCardList));
  specialFusionsList = await fetchAPI.getSpecialFusionList();

  buildSelectableCardList(currentCardList);
  buildAvailableCardList(currentCardList);
  fuseCards();
}

function fuseCards() {
  const firstCard = getCard(firstCardList.value);
  const secondCard = getCard(secondCardList.value);

  const cardFusionResult = cardFusion(firstCard, secondCard);

  resultDiv.innerHTML = "";

  cardFusionResult.forEach((card) => {
    resultDiv.innerHTML += `<img src="/db/cardImages/${card.id}.png">`;
    resultDiv.innerHTML += `${card.id} - ${card.name} \n`;
  });
}

function getCard(id) {
  return originalCardList.find((card) => card.id == id);
}

function colorFusion(firstCard, secondCard) {
  return colorMatrix[findColorIndex(firstCard)][findColorIndex(secondCard)];
}

function cardFusion(firstCard, secondCard) {
  let specialFusion = checkForSpecialFusion(firstCard, secondCard);
  if (specialFusion.length > 0) {
    return new Array(getCard(specialFusion[0].resultCard));
  }

  const newColor = colorFusion(firstCard, secondCard);
  let resultCost = firstCard.materialValue + secondCard.materialValue;
  const maxValue = findColorMaxValue(newColor);

  if (resultCost > maxValue) {
    resultCost = maxValue;
  }

  let cardListResult = originalCardList.filter(
    (card) => card.color === newColor
  );
  cardListResult = filterSameCardResult(firstCard, cardListResult);
  cardListResult = filterSameCardResult(secondCard, cardListResult);

  return findResultCostCards(cardListResult, resultCost);
}

function findColorIndex(card) {
  return colorList.findIndex((item) => item.color === card.color);
}

function findColorMaxValue(colorName) {
  return colorList.find((color) => color.color == colorName).maxValue;
}

function filterSameCardResult(card, cardList) {
  if (card.color !== "Option") {
    cardList = cardList.filter((element) => element != card);
  }

  return cardList;
}

function findResultCostCards(cardList, resultCost) {
  let resultList = [];

  while (resultList.length === 0) {
    resultList = cardList.filter((card) => card.costValue === resultCost);
    resultCost++;
  }

  return resultList;
}

function checkForSpecialFusion(firstCard, secondCard) {
  return specialFusionsList.filter(
    (fusion) =>
      (fusion.firstCard === firstCard.id &&
        fusion.secondCard === secondCard.id) ||
      (fusion.firstCard === secondCard.id && fusion.secondCard === firstCard.id)
  );
}

function buildSelectableCardList(list) {
  firstCardList.innerHTML = "";
  secondCardList.innerHTML = "";

  list.forEach((card) => {
    const cardName = `${card.id} - ${card.name}`;
    firstCardList.appendChild(new Option(cardName, card.id));
    secondCardList.appendChild(new Option(cardName, card.id));
  });
}

function buildAvailableCardList(list) {
  availableCardList.innerHTML = "";
  var lastColor = "";

  list.forEach((card) => {
    const cardColor = card.color;
    if (lastColor != cardColor) {
      availableCardList.innerHTML += ` <div class="bg-${cardColor.toLowerCase()} bg-opacity-25 
       d-flex align-items-center highlight-toolbar ps-3 pe-2 py-1 mt-2">
                              <div class="col">${cardColor} Cards</div>
        </div>`;
      lastColor = cardColor;
    }
    availableCardList.innerHTML += `<input type="checkbox" class="btn-check" name="availableCard" id="cardNum${
      card.id
    }" 
        value="${card.id}" autocomplete="off" checked>
        <label class="btn btn-outline-${cardColor.toLowerCase()} mt-2" for="cardNum${
      card.id
    }">${card.id} - ${card.name}</label>`;
  });
  const availableCards = document.getElementsByName("availableCard");
  availableCards.forEach((card) => (card.onclick = updateAvailableCard));
}

function updateAvailableCard(e) {
  const card = getCard(this.value);

  if (this.checked) {
    addCardToCurrentCardList(card);
  } else {
    removeCardFromCurrentCardList(card);
  }
}

function addCardToCurrentCardList(selectedCard) {
  currentCardList.push(selectedCard);
  currentCardList = currentCardList.sort((a, b) => (a.id > b.id ? 1 : -1));
  buildSelectableCardList(currentCardList);
  fuseCards();
}

function removeCardFromCurrentCardList(selectedCard) {
  currentCardList = currentCardList.filter(
    (card) => card.id != selectedCard.id
  );
  buildSelectableCardList(currentCardList);
  fuseCards();
}

function removeAllAvailableCards() {
  currentCardList = [];
  buildSelectableCardList(currentCardList);
  resultDiv.innerHTML = "";
  const availableCards = document.getElementsByName("availableCard");
  availableCards.forEach((card) => (card.checked = false));
}

function addAllAvailableCards() {
  currentCardList = JSON.parse(JSON.stringify(originalCardList));
  buildSelectableCardList(currentCardList);
  const availableCards = document.getElementsByName("availableCard");
  availableCards.forEach((card) => (card.checked = true));
  fuseCards();
}

function updateCard(element) {
  const cardImage = document.getElementById(`${element.id}Image`);
  cardImage.src = `/db/cardImages/${element.value}.png`;
  fuseCards();
}