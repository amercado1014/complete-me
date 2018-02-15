import Node from './Node';

export default class Trie {
  constructor() {
    this.count = 0;
    this.children = {};
  }

  insert(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;

    while (lettersArray.length) {
      let currentLetter = lettersArray.shift();

      if (!currentNode[currentLetter]) {
        currentNode[currentLetter] = new Node();
      }

      if (!lettersArray.length && !currentNode[currentLetter].completeWord) {
        this.count++;
        currentNode[currentLetter].completeWord = word;
      }
      currentNode = currentNode[currentLetter].children;
    }
  }

  findNode(word) {
    let lettersArray = word.split('');
    let currentNode = this.children;

    while (lettersArray.length) { 
      let currentLetter = lettersArray.shift();
      let foundLetter = Object.keys(currentNode).find(letter => 
        letter === currentLetter);

      if (foundLetter) {
        currentNode = currentNode[currentLetter].children;
      } 
    }
    return currentNode;
  }

  suggest(word) { 
    const currentNode = this.findNode(word);
    let suggestions = [];
    let nodeKeys = Object.keys(currentNode);

    const searchWords = (array, level) => {
      array.forEach(letter => {
        let nodeObject = level;

        if (nodeObject[letter].completeWord) {
          if (nodeObject[letter].popularity === 0) {
            suggestions.push(nodeObject[letter].completeWord);
          } else {
            suggestions.unshift(nodeObject[letter].completeWord);
          }
        }

        if (Object.keys(nodeObject[letter].children).length) {
          nodeObject = nodeObject[letter].children;
          searchWords(Object.keys(nodeObject), nodeObject);
        }
      });
    };

    searchWords(nodeKeys, currentNode);
    return suggestions;
  }

  populate(array) {
    array.forEach( word => {
      this.insert(word);
    });
  }

  transverseDown(lettersArray) {
    let currentNode = this.children;

    while (lettersArray.length > 1) { 
      let currentLetter = lettersArray.shift();
      let foundLetter = Object.keys(currentNode).find(letter => 
        letter === currentLetter);

      if (foundLetter) {
        currentNode = currentNode[currentLetter].children;
      }
    }
    return currentNode;
  }

  select(word) {
    let lettersArray = word.split('');
    let lastLetter = this.transverseDown(lettersArray);

    lastLetter[lettersArray].popularity++;
  }

  delete(word) {
    let lettersArray = word.split('');
    let lastLetter = this.transverseDown(lettersArray);

    this.count--;
    lastLetter[lettersArray].completeWord = false;
  }
}

