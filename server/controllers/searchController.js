const User= require('../models/User');
const Posts= require('../models/Post');
const { success, error } = require('../utils/responseWrapper');

const searchUser = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.send(error(400, 'Query parameter is required'));
    }

    const userResults = await User.find({
      name: { $regex: query, $options: 'i' }
    }).select('name avatar');

    return res.send(success(200, { users: userResults }));
  } catch (err) {
    return res.send(error(500, err.message));
  }
};

module.exports= {searchUser};
