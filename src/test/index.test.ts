
import { A2ANodeServerWO } from "./A2ANodeServer";
import { A2ANodeServerDelegates } from "./model";

console.log('Hello, World!');

// const express = require('express');
// const app = express();
// const port = 3000;

// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

let s: A2ANodeServerWO = new A2ANodeServerWO(new A2ANodeServerDelegates());
//s.handle();