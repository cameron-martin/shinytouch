import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.post('/add-example', (request, response) => {
    // const { calibrationSessionId } = request.params;

    let length = 0;

    request.on('data', (buffer: Buffer) => {
        length += buffer.length;
    });

    request.on('end', () => {
        response.status(200).send(length.toString());
    })
});

app.listen(8080);
