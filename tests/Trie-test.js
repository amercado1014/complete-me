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

  it('should not increment count for duplicate words', () => {
    expect(trie.count).to.equal(0);
    
    trie.insert('pizza');

    expect(trie.count).to.equal(1);

    trie.insert('pizza');

    expect(trie.count).to.equal(1);
  });

  it('should create keys in children object of first letter', () => {
    trie.insert('tacocat');
    trie.insert('pizza');
    trie.insert('piano');

    expect(Object.keys(trie.children)).to.deep.eq(['t','p']);
  });

  it('should add word', () => {
     trie.insert('pizza');
     trie.insert('pizzas');
     trie.insert('piano');
     trie.insert('dog');
     trie.insert('dogs');

     expect(trie.children['d']).to.exit;
     expect(trie.children['d'].children['o']).to.exit;
     expect(trie.children['d'].children['o'].children['g']).to.exist;
     expect(trie.children['d'].children['o'].children['g'].completeWord).to.equal('dog');
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

    expect(trie.count).to.equal(4);
  });

  it('should populate a dictionary of words', () => {
    expect(trie.count).to.equal(0);

    trie.populate(dictionary);

    expect(trie.count).to.equal(235886);
  });
 });

 describe('Select', () => {
  it('should increase the popularity of a word each time it gets selected', () =>{
      trie.populate(dictionary);

      expect(trie.children['d'].children['o'].children['g'].popularity).to.equal(0);

      trie.select('dog');

      expect(trie.children['d'].children['o'].children['g'].popularity).to.equal(1);
    });

  it('should priortize selected words from dictionary', () => {
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

   it('should be able to remove word from count once deleted ', () => {    
    trie.insert('pizza');

    expect(trie.count).to.equal(1);

    trie.delete('pizza');

    expect(trie.count).to.equal(0);
  });
 });

});