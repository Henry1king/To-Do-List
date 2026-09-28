const { ObjectId } = require('mongodb');
const { getTasksCollection } = require('../_db');

module.exports = async (req, res) => {
  const tasks = await getTasksCollection();
  const { id } = req.query;

  if (req.method === 'DELETE') {
    await tasks.deleteOne({ _id: new ObjectId(id) });
    res.status(200).json({ message: 'Task deleted' });
    return;
  }

  res.status(404).json({ error: 'Not found' });
};
