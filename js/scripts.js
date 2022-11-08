const colorMatrix =[ 
["Option","Green","Black","Yellow","Blue","Red"],
["Green","Option","Yellow","Red","Green","Blue"],
["Black","Yellow","Option","Blue","Black","Green"],
["Yellow","Red","Blue","Option","Red","Black"],
["Blue","Green","Black","Red","Option","Yellow"],
["Red","Blue","Green","Black","Yellow","Option"]
]
const colorList = [{"color": "Red", "maxValue": 35},
 {"color":"Blue", "maxValue": 35}, {"color":"Green", "maxValue": 32}, 
 {"color":"Black", "maxValue": 35}, {"color":"Yellow", "maxValue": 33}, 
 {"color":"Option", "maxValue": 35}];


const resultDiv = document.getElementById('fusionResult');
const firstCardList = document.getElementById('firstCard');
const secondCardList = document.getElementById('secondCard');

var originalCardList = {};
var specialFusionsList = {};

async function getCardList() {
    return await fetch('https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/color-fusion/db/cardList.json')
                   .then((response) => response.json())
}

async function getSpecialFusionList() {
    return await fetch('https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/color-fusion/db/specialFusions.json')
                   .then((response) => response.json())
}


async function buildPage() {
    originalCardList = await getCardList();
    specialFusionsList = await getSpecialFusionList();

    originalCardList.forEach(card => {
            const cardName = `${card.id} - ${card.name}`
            firstCardList.appendChild(new Option(cardName, card.id));
            secondCardList.appendChild(new Option(cardName, card.id));
    });

    fuseCards();
    
}
 
buildPage();


function fuseCards() {
    const firstCard = getCard(firstCardList.value);
    const secondCard = getCard(secondCardList.value);

    const cardFusionResult = cardFusion(firstCard, secondCard);

    resultDiv.innerText = "";

    cardFusionResult.forEach(card => {
        resultDiv.innerText += `${card.id} - ${card.name} \n`
    });
    
}

function getCard(id) {
    return originalCardList.find(card => card.id == id);
}

function colorFusion (firstCard, secondCard){ 
	return colorMatrix[findColorIndex(firstCard)][findColorIndex(secondCard)];
}

function cardFusion (firstCard, secondCard){
	const newColor = colorFusion(firstCard, secondCard);
	let resultCost = firstCard.materialValue + secondCard.materialValue;
    const maxValue = findColorMaxValue(newColor);

    if (resultCost > maxValue) {
        resultCost = maxValue;
    }

    let specialFusion = checkForSpecialFusion(firstCard, secondCard);
    if (specialFusion.length > 0) {
        return new Array(getCard(specialFusion[0].resultCard));
    }

	let cardListResult = originalCardList.filter((card) => card.color === newColor);
    cardListResult = filterSameCardResult(firstCard, cardListResult);
    cardListResult = filterSameCardResult(secondCard, cardListResult);

	return findResultCostCards(cardListResult, resultCost);
}

function findColorIndex(card) {
     return colorList.findIndex(function(item){
        return item.color === card.color
    });
}

function findColorMaxValue(colorName) {
    return colorList.find(color => color.color == colorName).maxValue;
}

function filterSameCardResult(card, cardList) {
    if(card.color !== 'Option') {
        cardList = cardList.filter(element => element != card);
    }
    return cardList;
}

function findResultCostCards(cardList, resultCost) {
    let resultList = [];
    while(resultList.length === 0){
        resultList = cardList.filter((card) => card.costValue === resultCost);
        resultCost++;
    }
    return resultList;
}

function checkForSpecialFusion(firstCard, secondCard) {
    return specialFusionsList.filter(fusion => (fusion.firstCard === firstCard.id && fusion.secondCard === secondCard.id)
                    || (fusion.firstCard === secondCard.id && fusion.secondCard === firstCard.id));
}
