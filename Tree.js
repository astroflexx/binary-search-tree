const Node = require('./Node');

class Tree {
  constructor(array) {
    const sorted = [...array].sort((a, b) => a - b);
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

  insert(value, root = this.root) {
    let node = root;
    if (node === null) {
      node = new Node(value);
      return this.root;
    }
    return node.key < value
      ? this.insert(value, node.right)
      : this.insert(value, node.left);
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
}

let tree = new Tree([1, 2, 4, 3, 5, 6, 7]);
console.log(tree.find(6));
console.log(tree.insert(8));
console.log(tree.find(8));
