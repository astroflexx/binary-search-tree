const Node = require('./Node');

class Tree {
  constructor(array) {
    const sorted = [...new Set(array)].sort((a, b) => a - b);
    this.root = this.buildTree(sorted);
  }

  buildTree(sorted) {
    if (sorted.length === 0) return null;
    const mid = parseInt(sorted.length / 2);
    const root = new Node(
      sorted[mid],
      this.buildTree(sorted.slice(0, mid)),
      this.buildTree(sorted.slice(mid + 1))
    );
    return root;
  }

  static minValue(root) {
    let minv = root.key;
    while (root.left != null) {
      minv = root.left.key;
      root = root.left;
    }
    return minv;
  }

  insert(value, root = this.root) {
    if (root === null) return new Node(value);
    if (root.key === value) return;
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
      root.key = this.minValue(root.right);
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
    if (node === null) return;
    this.inorder(node.left, callback, result);
    callback ? callback(node) : result.push(node.key);
    this.inorder(node.right, callback, result);
    if (result) return result;
  }

  // left right root
  postorder(callback) {
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
    let ans = this.depth(node, root.left, level + 1);
    if (ans !== 0) return ans;
    return this.depth(node, root.right, level + 1);
  }
}

let tree = new Tree([1, 2, 4, 3, 5, 6, 7]);
//console.log(tree.find(6));
//console.log(tree.insert(8));
//console.log(tree.find(8));
console.log(tree);
console.log(tree.levelOrder());
console.log(tree.preorder());
console.log(tree.inorder());
console.log(tree.postorder());
console.log(tree.height(tree.find(5)));
console.log(tree.depth(tree.find(6)));
// console.log(tree.isBalanced());
