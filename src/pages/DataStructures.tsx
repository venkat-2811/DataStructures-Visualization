import React, { useState } from 'react';
import { Typography, Paper, Grid, Card, CardContent, Button, TextField, Select, MenuItem } from '@mui/material';
import { Search } from 'lucide-react';

interface Node {
  value: number;
  next: Node | null;
}

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
}

const DataStructures = () => {
  const [dataStructure, setDataStructure] = useState('linkedList');
  const [inputValue, setInputValue] = useState('');
  const [positionValue, setPositionValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [linkedList, setLinkedList] = useState<Node | null>(null);
  const [binaryTree, setBinaryTree] = useState<TreeNode | null>(null);
  const [stack, setStack] = useState<number[]>([]);
  const [queue, setQueue] = useState<number[]>([]);

  // Linked List Operations
  const addToLinkedList = (value: number, position?: number) => {
    const newNode: Node = { value, next: null };
    
    if (position === 0 || !linkedList) {
      newNode.next = linkedList;
      setLinkedList(newNode);
      return;
    }

    let current = linkedList;
    let index = 0;
    
    if (position === undefined) {
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    } else {
      while (current.next && index < position - 1) {
        current = current.next;
        index++;
      }
      newNode.next = current.next;
      current.next = newNode;
    }
    
    setLinkedList({ ...linkedList });
  };

  const removeFromLinkedList = (position?: number) => {
    if (!linkedList) return;
    
    if (position === 0) {
      setLinkedList(linkedList.next || null);
      return;
    }

    let current = linkedList;
    let index = 0;
    
    if (position === undefined) {
      // Remove from end
      while (current.next && current.next.next) {
        current = current.next;
      }
      if (current.next) {
        current.next = null;
      }
    } else {
      // Remove from specific position
      while (current.next && index < position - 1) {
        current = current.next;
        index++;
      }
      if (current.next) {
        current.next = current.next.next;
      }
    }
    
    setLinkedList({ ...linkedList });
  };

  const searchLinkedList = (value: number) => {
    let current = linkedList;
    let position = 0;
    
    while (current) {
      if (current.value === value) {
        setSearchResult(`Found at position ${position}`);
        return;
      }
      current = current.next;
      position++;
    }
    
    setSearchResult('Not found');
  };

  // Binary Tree Operations
  const addToBinaryTree = (value: number) => {
    const newNode: TreeNode = { value, x: 0, y: 0, left: null, right: null };
    
    if (!binaryTree) {
      newNode.x = 300;
      newNode.y = 50;
      setBinaryTree(newNode);
      return;
    }

    const insert = (node: TreeNode, level: number): void => {
      if (value < node.value) {
        if (node.left) {
          insert(node.left, level + 1);
        } else {
          node.left = {
            value,
            x: node.x - 100 / level,
            y: node.y + 60,
            left: null,
            right: null,
          };
        }
      } else {
        if (node.right) {
          insert(node.right, level + 1);
        } else {
          node.right = {
            value,
            x: node.x + 100 / level,
            y: node.y + 60,
            left: null,
            right: null
          };
        }
      }
    };

    insert(binaryTree, 1);
    setBinaryTree({ ...binaryTree });
  };

  const searchBinaryTree = (value: number) => {
    const search = (node: TreeNode | null): boolean => {
      if (!node) return false;
      if (node.value === value) return true;
      return value < node.value ? search(node.left) : search(node.right);
    };

    setSearchResult(search(binaryTree) ? 'Found in tree' : 'Not found');
  };

  const removeFromBinaryTree = (value: number) => {
    const remove = (node: TreeNode | null, value: number): TreeNode | null => {
      if (!node) return null;

      if (value < node.value) {
        node.left = remove(node.left, value);
      } else if (value > node.value) {
        node.right = remove(node.right, value);
      } else {
        if (!node.left) return node.right;
        if (!node.right) return node.left;

        let minNode = node.right;
        while (minNode.left) minNode = minNode.left;
        node.value = minNode.value;
        node.right = remove(node.right, minNode.value);
      }

      return node;
    };

    setBinaryTree(remove(binaryTree, value));
  };

  // Stack Operations
  const pushToStack = (value: number) => {
    setStack([...stack, value]);
  };

  const popFromStack = () => {
    if (stack.length > 0) {
      setStack(stack.slice(0, -1));
    }
  };

  const peekStack = () => {
    if (stack.length > 0) {
      setSearchResult(`Top element: ${stack[stack.length - 1]}`);
    } else {
      setSearchResult('Stack is empty');
    }
  };

  const searchStack = (value: number) => {
    const index = stack.lastIndexOf(value);
    setSearchResult(index !== -1 ? `Found at position ${stack.length - 1 - index} from top` : 'Not found');
  };

  // Queue Operations
  const enqueue = (value: number) => {
    setQueue([...queue, value]);
  };

  const dequeue = () => {
    if (queue.length > 0) {
      setQueue(queue.slice(1));
    }
  };

  const peekQueue = () => {
    if (queue.length > 0) {
      setSearchResult(`Front element: ${queue[0]}`);
    } else {
      setSearchResult('Queue is empty');
    }
  };

  const searchQueue = (value: number) => {
    const index = queue.indexOf(value);
    setSearchResult(index !== -1 ? `Found at position ${index}` : 'Not found');
  };

  const handleAdd = () => {
    const value = parseInt(inputValue);
    const position = parseInt(positionValue);
    if (isNaN(value)) return;

    switch (dataStructure) {
      case 'linkedList':
        addToLinkedList(value, isNaN(position) ? undefined : position);
        break;
      case 'binaryTree':
        addToBinaryTree(value);
        break;
      case 'stack':
        pushToStack(value);
        break;
      case 'queue':
        enqueue(value);
        break;
    }

    setInputValue('');
    setPositionValue('');
  };

  const handleRemove = () => {
    const position = parseInt(positionValue);
    
    switch (dataStructure) {
      case 'linkedList':
        removeFromLinkedList(isNaN(position) ? undefined : position);
        break;
      case 'binaryTree':
        removeFromBinaryTree(parseInt(inputValue));
        break;
      case 'stack':
        popFromStack();
        break;
      case 'queue':
        dequeue();
        break;
    }
    
    setPositionValue('');
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (isNaN(value)) return;

    switch (dataStructure) {
      case 'linkedList':
        searchLinkedList(value);
        break;
      case 'binaryTree':
        searchBinaryTree(value);
        break;
      case 'stack':
        searchStack(value);
        break;
      case 'queue':
        searchQueue(value);
        break;
    }
  };

  const handlePeek = () => {
    switch (dataStructure) {
      case 'stack':
        peekStack();
        break;
      case 'queue':
        peekQueue();
        break;
    }
  };

  // Rendering functions remain the same as in your original code
  const renderLinkedList = () => {
    const nodes: Node[] = [];
    let current = linkedList;
    while (current) {
      nodes.push(current);
      current = current.next;
    }

    return (
      <div className="flex items-center space-x-2 overflow-x-auto p-4">
        {nodes.map((node, index) => (
          <React.Fragment key={index}>
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white">
              {node.value}
            </div>
            {node.next && (
              <div className="flex-shrink-0 w-8 h-1 bg-gray-300"></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderBinaryTree = () => {
    const drawNode = (node: TreeNode) => (
      <g key={`${node.value}-${node.x}-${node.y}`}>
        {node.left && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="#666"
            strokeWidth="2"
          />
        )}
        {node.right && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="#666"
            strokeWidth="2"
          />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="20"
          fill="#3b82f6"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          fill="white"
        >
          {node.value}
        </text>
        {node.left && drawNode(node.left)}
        {node.right && drawNode(node.right)}
      </g>
    );

    return (
      <svg width="600" height="400" className="mx-auto">
        {binaryTree && drawNode(binaryTree)}
      </svg>
    );
  };

  const renderStack = () => {
    return (
      <div className="flex flex-col-reverse items-center space-y-2 p-4">
        {stack.map((value, index) => (
          <div 
            key={index} 
            className="w-full h-12 bg-blue-500 flex items-center justify-center text-white rounded"
          >
            {value}
          </div>
        ))}
      </div>
    );
  };

  const renderQueue = () => {
    return (
      <div className="flex items-center space-x-2 overflow-x-auto p-4">
        {queue.map((value, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 w-12 h-12 bg-green-500 flex items-center justify-center text-white rounded"
          >
            {value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Typography variant="h4" component="h1" className="mb-6">
        Data Structures Visualization
      </Typography>

      <Paper className="p-6">
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div className="flex flex-wrap gap-4 mb-6">
              <Select
                value={dataStructure}
                onChange={(e) => setDataStructure(e.target.value)}
                className="w-48"
              >
                <MenuItem value="linkedList">Linked List</MenuItem>
                <MenuItem value="binaryTree">Binary Tree</MenuItem>
                <MenuItem value="stack">Stack</MenuItem>
                <MenuItem value="queue">Queue</MenuItem>
              </Select>

              <div className="flex gap-2">
                <TextField
                  label="Value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  type="number"
                  className="w-24"
                />
                {['linkedList'].includes(dataStructure) && (
                  <TextField
                    label="Position"
                    value={positionValue}
                    onChange={(e) => setPositionValue(e.target.value)}
                    type="number"
                    className="w-24"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="contained" onClick={handleAdd}>
                  Add
                </Button>
                <Button variant="outlined" onClick={handleRemove}>
                  Remove
                </Button>
                {['stack', 'queue'].includes(dataStructure) && (
                  <Button variant="outlined" onClick={handlePeek}>
                    Peek
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <TextField
                  label="Search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  type="number"
                  className="w-24"
                />
                <Button 
                  variant="outlined" 
                  onClick={handleSearch}
                  startIcon={<Search className="w-4 h-4" />}
                >
                  Search
                </Button>
              </div>
            </div>

            {searchResult && (
              <div className="mb-4 p-2 bg-blue-300 rounded flex justify-between items-center">
                <span>{searchResult}</span>
                <button
                  onClick={() => setSearchResult(null)}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  ×
                </button>
              </div>
            )}


            <Card className="mb-6">
              <CardContent>
                {dataStructure === 'linkedList' && renderLinkedList()}
                {dataStructure === 'binaryTree' && renderBinaryTree()}
                {dataStructure === 'stack' && renderStack()}
                {dataStructure === 'queue' && renderQueue()}
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" className="mb-4">
                  Data Structure Details
                </Typography>
                <Typography variant="body1">
                  {dataStructure === 'linkedList' ? (
                  <>
                    A Linked List is a linear data structure where elements are stored in nodes,
                    and each node points to the next node in the sequence. It allows dynamic memory allocation
                    and efficient insertion/deletion at both ends.
                    Key operations:
                    • Insert at start/end: O(1)
                    • Insert at position: O(n)
                    • Delete from start: O(1)
                    • Delete from position: O(n)
                    • Search: O(n)
                    • Traverse: O(n)
                  </>
                  ) : dataStructure === 'binaryTree' ? (
                  <>
                    A Binary Search Tree is a hierarchical data structure where each node has at most
                    two children. Left subtree contains smaller values and right subtree contains
                    larger values. Useful for maintaining sorted data and efficient searching.
                    Key operations:
                    • Insert: O(log n) average, O(n) worst
                    • Delete: O(log n) average, O(n) worst
                    • Search: O(log n) average, O(n) worst
                    • In-order traversal gives sorted elements
                  </>
                  ) : dataStructure === 'stack' ? (
                  <>
                    A Stack follows Last-In-First-Out (LIFO) principle where elements are added and removed
                    from the same end (top). Used in function calls, undo operations, and expression evaluation.
                    Key operations:
                    • Push (add): O(1)
                    • Pop (remove): O(1)
                    • Peek (top element): O(1)
                    • Search: O(n)
                    • IsEmpty: O(1)
                  </>
                  ) : (
                  <>
                    A Queue follows First-In-First-Out (FIFO) principle where elements are added at rear
                    and removed from front. Used in breadth-first search, print spooling, and process scheduling.
                    Key operations:
                    • Enqueue (add): O(1)
                    • Dequeue (remove): O(1)
                    • Peek (front element): O(1)
                    • Search: O(n)
                    • IsEmpty: O(1)
                  </>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default DataStructures;
