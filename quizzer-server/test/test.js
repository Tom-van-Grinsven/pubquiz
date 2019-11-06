// to configure the sequence in which mocha should run the tests

require('./routes/accounts');
require('./routes/sessions');
require('./routes/quizzes');
require('./routes/quizzes-subroutes/teams');
require('./routes/categories');
require('./routes/quizzes-subroutes/categories');
require('./routes/quizzes-subroutes/categories-questions');
require('./routes/quizzes-subroutes/score');
require('./routes/quizzes-subroutes/active-questions');
