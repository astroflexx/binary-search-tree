const Tree = require('./Tree');

const randomArray = (size) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 100));
};

const tree = new Tree(randomArray(30));
console.log('Balanced:', tree.isBalanced());
console.log('Lever Order =>', tree.levelOrder());
console.log('Preorder =>', tree.preorder());
console.log('Inorder =>', tree.inorder());
console.log('Postorder =>', tree.postorder());

tree.insert(Math.floor(Math.random() * 20));
console.log('Balanced:', tree.isBalanced());

tree.rebalance();
console.log('Balanced:', tree.isBalanced());
console.log('Lever Order =>', tree.levelOrder());
console.log('Preorder =>', tree.preorder());
console.log('In-order =>', tree.inorder());
console.log('Post-order =>', tree.postorder());
