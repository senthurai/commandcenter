
import { LogLevel } from "../LogDelegate";
import { SudokuWorkflow } from "./A2ANodeServer";
import { A2ANodeServerDelegates } from "../model";

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

let s: SudokuWorkflow = new SudokuWorkflow(new A2ANodeServerDelegates());
s.getDelegates().getLogger().setLevel(LogLevel.VERBOSE);
s.handle();
console.log('Done!');
 