// Algorithm for trending posts
const upvoteWeight = 1.5;
const commentWeight = 1.0;

const calculateScore = (upvotes, comments) => {
  return upvotes * upvoteWeight + comments * commentWeight;
};

const recencyBoost = (postCreatedAt) => {
  const trendingDurationHours = 48;
  const trendingDurationMilliseconds = trendingDurationHours * 3600 * 1000;
  const decayFactor = Math.log(2) / trendingDurationMilliseconds;

  const timeDifference = Date.now() - new Date(postCreatedAt).getTime();
  return Math.exp(-decayFactor * timeDifference);
};

const calculateTrendingScore = (upvotes, comments, postCreatedAt) => {
  const score = calculateScore(upvotes, comments);
  const recencyBoostFactor = recencyBoost(postCreatedAt);
  return score * recencyBoostFactor;
};

module.exports = {
    calculateTrendingScore
}