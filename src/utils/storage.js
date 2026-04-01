export const getUsers = () => {
  const users = localStorage.getItem('votechain_users');
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('votechain_users', JSON.stringify(users));
};

export const getUserByVoterId = (voterId) => {
  const users = getUsers();
  return users.find(u => u.voterId === voterId);
};

export const hasUserVoted = (voterId) => {
  const chain = JSON.parse(localStorage.getItem('votechain') || '[]');
  return chain.some(block => block.voterId === voterId);
};
