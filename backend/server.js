require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const formRoutes = require('./routes/formRoutes');
const responseRoutes = require('./routes/responseRoutes');

const app = express();

const _dirname = path.resolve();
// In your server.js file, update CORS:
app.use(cors({
  
 origin: "http://localhost:3000" ,
    
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api/forms', formRoutes);
app.use('/api/responses', responseRoutes);

// app.get('/', (req, res) => res.send('API Running'));

app.use(express.static(path.join(_dirname, 'frontend', 'build')));  // Changed dist → build
app.get('*', (req, res) => {
  res.sendFile(path.resolve(_dirname, 'frontend', 'build', 'index.html'));
});
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });