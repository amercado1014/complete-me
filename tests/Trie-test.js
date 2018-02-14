import { expect } from 'chai';
import Node from '../lib/Node';
import Trie from '../lib/Trie';
import fs from 'fs';

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')


describe('Trie', () => {
 let trie;

 beforeEach(() => {
   trie = new Trie();
 });

 it('should instantiate our good friend Trie', () => {
  expect(trie).to.exist;
 });

 it('should track the count', () => {
  expect(trie.count).to.equal(0);
 });

 it('should store child nodes', () => {
  expect(trie.children).to.deep.equal({});
 });

 describe('Insert', () => {
  it('should be able to increment count', () => {
    expect(trie.count).to.equal(0);
    
    trie.insert('pizza');

    expect(trie.count).to.equal(1);
  });

  it('should create keys in children object of first letter', () => {
    trie.insert('tacocat');
    trie.insert('pizza');
    trie.insert('piano');

    expect(Object.keys(trie.children)).to.deep.eq(['t','p']);
  });
 });

 describe('SUGGEST', () => {
  
   beforeEach(() => {
     trie.insert('pizza');
     trie.insert('pizzas');
     trie.insert('piano');
     trie.insert('dog');
     trie.insert('dogs');
   });

  it('should be a method, suggest', () => {
    expect(trie.suggest('p')).to.be.a.function;
  });

  it('should return an array of suggested words', () => {
   let results = trie.suggest('piz');
   let check1 = results.some(result => result === 'pizza');
   let check2 = results.some(result => result === 'pizzas');
   let check3 = results.some(result => result === 'piano');
   let check4 = results.some(result => result === 'dog');

   expect(check1).to.be.true;
   expect(check2).to.be.true;
   expect(check3).to.be.false;
   expect(check4).to.be.false;
     // console.log(check4);
     // console.log(JSON.stringify(trie, null, 4))
   });
  
  it('should suggest words form dictionary', () => {
    trie.populate(dictionary);

    expect(trie.suggest('piz')).to.deep.eq(['pizza','pizzas', 'pizzeria', 'pizzicato', 'pizzle', 'pize']);
  });
 });

 describe('Populate', () => {
  it('should populate array of words', () => {
    let array = ['piano', 'cat', 'dog', 'pizza'];

    expect(trie.count).to.equal(0);

    trie.populate(array);
    // console.log(JSON.stringify(trie, null, 4))
    expect(trie.count).to.equal(4);
  });

  it('should populate a dictionary of words', () => {
    expect(trie.count).to.equal(0);

    trie.populate(dictionary);

    expect(trie.count).to.equal(235886);
  });
 });

 describe('Select', () => {
  it('should priortize selected words', () => {
    let array = ['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']

    trie.populate(array);

    expect(trie.suggest('piz')).to.deep.eq(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);

    trie.select('pizzeria');
    // console.log(JSON.stringify(trie, null, 4))

    expect(trie.suggest('piz')).to.deep.eq(['pizzeria','pize', 'pizza', 'pizzicato', 'pizzle'])
  });

  it('should priortize selected words', () => {
    trie.populate(dictionary);

    expect(trie.suggest('piz')).to.deep.eq(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);

    trie.select('pizzeria');


    expect(trie.suggest('piz')).to.deep.eq(['pizzeria','pize', 'pizza', 'pizzicato', 'pizzle'])
  });
 });

 describe('Delete', () => {
  it('should remove deleted word from suggestions ', () => {
    trie.populate(dictionary);

    expect(trie.suggest('piz')).to.deep.eq(['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);

    trie.delete('pizzeria');


    expect(trie.suggest('piz')).to.deep.eq(['pize', 'pizza', 'pizzicato', 'pizzle'])    

  });
 });

});