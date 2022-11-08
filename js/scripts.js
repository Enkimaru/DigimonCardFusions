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

 const specialFusionList = [1, 4]

const resultDiv = document.getElementById('fusionResult');
const firstCardList = document.getElementById('firstCard');
const secondCardList = document.getElementById('secondCard');

var cardList = {};

async function getCardList() {
    const cardList = await fetch('https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/color-fusion/db/cardList.json')
                   .then((response) => response.json())
    return cardList;
}


async function buildPage() {
    cardList = await getCardList();

    cardList.forEach(card => {
            const cardName = `${card.id} - ${card.name}`
            firstCardList.appendChild(new Option(cardName, card.id));
            secondCardList.appendChild(new Option(cardName, card.id));
    });
    
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
    return cardList.find(card => card.id == id);
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

	const sameColorCards = cardList.filter((card) => card.color === newColor);

	return sameColorCards.filter((card) => card.costValue === resultCost);
}

function findColorIndex(card) {
     return colorList.findIndex(function(item, i){
        return item.color === card.color
    });
}

function findColorMaxValue(colorName) {
    return colorList.find(color => color.color == colorName).maxValue;
}

