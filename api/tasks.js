const { getTasksCollection } = require('./_db');
module.exports = async (req, res) => {
  const tasks = await getTasksCollection();

  
  if (req.method === 'GET') {
    const allTasks = await tasks.find().toArray();
    res.status(200).json(allTasks);
    return;
  }
  
  if (req.method === 'POST') {
    const { title } = req.body;
    await tasks.insertOne({ title, completed: false });
    res.status(201).json({ message: 'Task added' });
    return;
  }
  res.status(404).json({ error: 'Not found' });
};
