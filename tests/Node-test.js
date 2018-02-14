import { expect } from 'chai';
import Node from '../lib/Node';

describe('Node', () => {
 let node;

 beforeEach(() => {
   node = new Node();
 });

 it('should be a thing', () => {
    expect(node).to.exist
  });
 
 it('should be able to store child nodes', () => {
  expect(node.children).to.deep.equal({});
 });
});