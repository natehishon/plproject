import express from 'express';
import config from '../config';
import middleware from '../middleware';
import initializeDb from '../db';
import mapper from '../controller/mapper';

let router = express();

initializeDb(db => {
    router.use(middleware({ config, db}))

    router.use('/mapper', mapper({config, db}))

});

export default router;