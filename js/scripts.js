const colorMatrix =[ 
["option","green","green","yellow","blue","red"],
["green","option","yellow","red","green","blue"],
["black","yellow","option","blue","black","green"],
["yellow","red","blue","option","red","black"],
["blue","green","black","red","option","yellow"],
["red","blue","green","black","yellow","option"]
]

const colorList = ["red","blue","green","black","yellow","option"];

console.log("ok");
fetch('https://raw.githubusercontent.com/Enkimaru/DigimonCardFusions/color-fusion/js/cardList.json')
    .then((response) => response.json())
    .then((json) => console.log(json));

function colorFusion (card1, card2){
	card1Color = colorList.indexOf(card1.color);
	card2Color = colorList.indexOf(card2.color);

	return colorMatrix[card1Color][card2Color];
}

function cardFusion (card1, card2){
	const newColor = colorFusion(card1, card2);
	const resultCost = card1.material + card2.material;

	const sameColorCards = cardList.filter((card) => card.color === newColor);

	return sameColorCards.filter((card) => card.cost === resultCost);
}

