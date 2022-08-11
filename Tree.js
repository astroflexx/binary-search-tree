const Node = require('./Node');

class Tree {
  constructor(array) {
    this.root = this.buildTree(array);
  }

  #sortAndRemoveDupes(array) {
    const sorted = [...new Set(array)].sort((a, b) => a - b);
    return sorted;
  }

  #minValue(root) {
    let minv = root.key;
    while (root.left != null) {
      minv = root.left.key;
      root = root.left;
    }
    return minv;
  }

  buildTree(array) {
    let sorted = this.#sortAndRemoveDupes(array);
    if (sorted.length === 0) return null;
    const mid = parseInt(sorted.length / 2);
    const root = new Node(
      sorted[mid],
      this.buildTree(sorted.slice(0, mid)),
      this.buildTree(sorted.slice(mid + 1))
    );
    return root;
  }

  insert(value, root = this.root) {
    if (root === null) return new Node(value);
    root.key < value
      ? (root.right = this.insert(value, root.right))
      : (root.left = this.insert(value, root.left));
    return root;
  }

  delete(value, root = this.root) {
    if (root === null) return root;
    if (root.key < value) root.right = this.delete(value, root.right);
    else if (root.key > value) root.left = this.delete(value, root.left);
    else {
      if (root.left === null) return root.right;
      else if (root.right === null) return root.left;
      root.key = this.#minValue(root.right);
      root.right = this.delete(value, root.right);
    }
    return root;
  }

  /**
   *  opted to use recursion to find value
   *  requires a node/root parameter
   */
  find(value, root = this.root) {
    const node = root;
    if (node === null) return null;
    if (node.key !== value) {
      return node.key < value
        ? this.find(value, node.right)
        : this.find(value, node.left);
    }
    return node;
  }

  // Breadth First Traversal (level by level)
  // use Queue : First In, First Out
  levelOrder(callback) {
    if (!this.root) return [];
    const queue = [this.root];
    const results = [];
    while (queue.length) {
      let level = [];
      let size = queue.length;
      for (let i = 0; i < size; i++) {
        const node = queue.shift();
        level.push(node.key);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
        if (callback) callback(node);
      }
      results.push(level);
    }
    if (!callback) return results;
  }

  /**
   * 3 methods for depth-first traversal
   * Stack: Last In, First Out
   * Preorder and Postorder uses stack.
   * Inorder uses iteration.
   */

  // root left right
  preorder(callback) {
    if (!this.root) return [];
    const stack = [this.root];
    const results = [];
    while (stack.length) {
      const node = stack.pop();
      if (node.right) stack.push(node.right);
      if (node.left) stack.push(node.left);
      if (callback) callback(node);
      results.push(node.key);
    }
    if (!callback) return results;
  }

  // left root right
  inorder(node = this.root, callback, result = []) {
    if (!this.root) return [];
    if (node === null) return;
    this.inorder(node.left, callback, result);
    callback ? callback(node) : result.push(node.key);
    this.inorder(node.right, callback, result);
    if (result) return result;
  }

  // left right root
  postorder(callback) {
    if (!this.root) return [];
    const stack = [this.root];
    const results = [];
    while (stack.length) {
      const node = stack.pop();
      if (node.left) stack.push(node.left);
      if (node.right) stack.push(node.right);
      if (callback) callback(node);
      results.push(node.key);
    }
    if (!callback) return results.reverse();
  }

  height(node = this.root) {
    if (node === null) return 0;
    const leftHeight = this.height(node.left);
    const rightHeight = this.height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  depth(node, root = this.root, level = 0) {
    if (!node) return null;
    if (root === null) return 0;
    if (root.key === node.key) return level;
    let count = this.depth(node, root.left, level + 1);
    if (count !== 0) return count;
    return this.depth(node, root.right, level + 1);
  }

  isBalanced(node = this.root) {
    if (node === null) return true;
    const heightDiff = Math.abs(
      this.height(node.left) - this.height(node.right)
    );
    return (
      heightDiff <= 1 &&
      this.isBalanced(node.left) &&
      this.isBalanced(node.right)
    );
  }

  rebalance() {
    if (this.root === null) return;
    const sorted = [...new Set(this.inorder().sort((a, b) => a - b))];
    this.root = this.buildTree(sorted);
  }
}

module.exports = Tree;

// TESTS
let tree = new Tree([1, 3, 2, 4]);
tree.insert(8);
tree.insert(10);
tree.insert(9);
tree.delete(9);
console.log(tree.find(9)); // null. deleted
console.log(tree.height()); // root height = 4
console.log(tree.height(tree.find(10))); // height = 1
console.log(tree.depth(tree.find(1))); // depth = 2
console.log(tree.levelOrder()); // [ [ 3 ], [ 2, 4 ], [ 1, 8 ], [ 10 ] ]
console.log(tree.preorder()); // [ 3, 2, 1, 4, 8, 10 ]
console.log(tree.inorder()); // [ 1, 2, 3, 4, 8, 10 ]
console.log(tree.postorder()); // [ 1, 2, 10, 8, 4, 3 ]
console.log(tree.isBalanced()); // false
tree.rebalance();
console.log(tree.isBalanced()); //true;
