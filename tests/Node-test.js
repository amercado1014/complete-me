import { expect } from 'chai';
import Node from '../lib/Node';

describe('Node', () => {
 let node;

 beforeEach(() => {
   node = new Node();
 });

 it('should exist', () => {
    expect(node).to.exist
  });

 it('should start off without a complete word', () => {
    expect(node.completeWord).to.eq(false);
 });
 
 it('should be able to store child nodes', () => {
    expect(node.children).to.deep.equal({});
 });

 it('should start with a popularity of 0', () => {
    expect(node.popularity).to.eq(0);
 });
});