const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');

const graphqlHTTP = require('express-graphql');
const { auth } = require('./middleware/authenticate');

const app = express();
var cors = require('cors')
const userrouter = require('./routes/user');
const questionRouter = require('./routes/questions');
const answerRouter = require('./routes/answers');

const questionSchema = require('./routes/questionsGraphQl');
app.use(cors());

app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


app.use('/graphql', graphqlHTTP({
  schema: questionSchema,
  graphiql: true,
}));

app.use(userrouter);
app.use(questionRouter);
app.use(answerRouter);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(process.env.PORT || 8080);