import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello Asksuite World!');
});

//TODO implement endpoint here

export default router;
