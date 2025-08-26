const app = require('./server/index');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});
const classRoutes = require('./routes/classRoutes');
app.use('/api', classRoutes);
