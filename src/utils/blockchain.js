import CryptoJS from 'crypto-js';

export const calculateHash = (index, voterId, constituency, party, timestamp, previousHash) => {
  return CryptoJS.SHA256(
    index + voterId + constituency + party + timestamp + previousHash
  ).toString();
};

export const createGenesisBlock = () => {
  const timestamp = Date.now();
  const previousHash = "0";
  const hash = calculateHash(0, "GENESIS", "NONE", "NONE", timestamp, previousHash);
  
  return {
    index: 0,
    voterId: "GENESIS",
    constituency: "NONE",
    party: "NONE",
    timestamp,
    previousHash,
    hash
  };
};

export const getBlockchain = () => {
  const chain = localStorage.getItem('votechain');
  if (!chain) {
    const genesis = [createGenesisBlock()];
    localStorage.setItem('votechain', JSON.stringify(genesis));
    return genesis;
  }
  return JSON.parse(chain);
};

export const addBlock = (voterId, constituency, party) => {
  const chain = getBlockchain();
  const previousBlock = chain[chain.length - 1];
  const index = previousBlock.index + 1;
  const timestamp = Date.now();
  const previousHash = previousBlock.hash;
  const hash = calculateHash(index, voterId, constituency, party, timestamp, previousHash);
  
  const newBlock = {
    index,
    voterId,
    constituency,
    party,
    timestamp,
    previousHash,
    hash
  };
  
  chain.push(newBlock);
  localStorage.setItem('votechain', JSON.stringify(chain));
  return newBlock;
};

export const isValidChain = (chain) => {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];
    
    if (currentBlock.hash !== calculateHash(
      currentBlock.index,
      currentBlock.voterId,
      currentBlock.constituency,
      currentBlock.party,
      currentBlock.timestamp,
      currentBlock.previousHash
    )) {
      return false;
    }
    
    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }
  }
  return true;
};
