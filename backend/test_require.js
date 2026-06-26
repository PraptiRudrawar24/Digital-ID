try {
    console.log('Attempting to require ./routes/authRoutes...');
    require('./routes/authRoutes');
    console.log('Successfully required ./routes/authRoutes');
} catch (error) {
    console.error('Error requiring module:', error.message);
    if (error.stack) {
        console.error(error.stack);
    }
}
