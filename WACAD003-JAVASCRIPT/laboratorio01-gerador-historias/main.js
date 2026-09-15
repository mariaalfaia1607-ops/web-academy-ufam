
const customName = document.getElementById('customname');
const randomize = document.querySelector('.randomize');
const story = document.querySelector('.story');

function randomValueFromArray(array){
  const random = Math.floor(Math.random()*array.length);
  return array[random];
}
const storyText = "Estava fazendo 94 fahrenheit lá fora, então Bob resolveu assistir :insertx:. Quando chegou em :inserty:, ficou parado olhando horrorizado por alguns instantes, e então :insertz:. Bob viu tudo aquilo, mas não ficou surpreso, pois pesa 300 pounds, e fazia um dia quente.";
const insertX = ["Round 6 de Round 6", "o último episódio de Round 9", "a maratona de Stranger Beach"];

const insertY = ["a cena do cliffhanger", "o final de temporada", "o episódio especial de Natal"];

const insertZ = ["gritou tão alto que o vizinho bateu na parede", "derrubou a pipoca inteira no sofá", "esqueceu de dar pausa e perdeu o jantar"];
randomize.addEventListener('click', result);
function result() {
  let newStory = storyText;

  const xItem = randomValueFromArray(insertX);
  const yItem = randomValueFromArray(insertY);
  const zItem = randomValueFromArray(insertZ);
 newStory = newStory.replace(':insertx:', xItem);
 newStory = newStory.replace(':inserty:', yItem);
 newStory = newStory.replace(':insertz:', zItem);

if(customName.value !== '') {
  const name = customName.value;
  newStory = newStory.replace('Bob', name);
  newStory = newStory.replace('Bob', name);
}

if(document.getElementById("uk").checked) {
  const weight = Math.round(300 / 14) + ' stone';
  const temperature = Math.round((94 - 32) * 5 / 9) + ' centigrade';
  newStory = newStory.replace('94 fahrenheit', temperature);
  newStory = newStory.replace('300 pounds', weight);
}

 story.textContent = newStory;
 story.style.visibility = 'visible';
}