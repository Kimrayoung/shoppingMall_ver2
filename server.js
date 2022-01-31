const express = require('express');
const path = require('path');
const itemsRouter = require('./routes/items');
const usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const putheart = require('./util/temp');

const app = express();
app.set('port',8080);

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded( {extended: false}));
app.use(express.json());

app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
}));

app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
})

app.use('/items',itemsRouter);
app.use('/users',usersRouter);


app.get('/dummy.html', (req,res) => {
    res.sendFile(path.join(__dirname, 'dummy.html'));
});

app.get('/:type/:img',(req,res,next) => {
    const type = req.params.type;
    const imgname = req.params.img;
    res.sendFile(path.join(__dirname,`../shopping_mall/datafile/${type}/${imgname}`));
})
  
app.get('/', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('mall', {
            userId: req.session.userId
        })
    }else {
        res.render('mall', {
            userId: '로그인'
        })
    }
});

app.get('/onepiece.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('onepiece', {
            userId: req.session.userId
        })
    }else {
        res.render('onepiece', {
            userId: '로그인'
        })
    }
});

app.get('/mypage.html',(req, res) => {
    if(req.session.userId !== undefined) {
        res.render('mypage', {
            userId : req.session.userId
        })
    } else {
        res.redirect('/login.html');
    }
})

app.get('/bottom.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('bottom', {
            userId: req.session.userId
        })
    }else {
        res.render('bottom', {
            userId: '로그인'
        })
    }
});

app.get('/fitness.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('fitness', {
            userId: req.session.userId
        })
    }else {
        res.render('fitness', {
            userId: '로그인'
        })
    }
});

app.get('/homewear.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('homewear', {
            userId: req.session.userId
        })
    }else {
        res.render('homewear', {
            userId: '로그인'
        })
    }
});

app.get('/setsale.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('setsale', {
            userId: req.session.userId
        })
    }else {
        res.render('setsale', {
            userId: '로그인'
        })
    }
});

app.get('/top.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('top', {
            userId: req.session.userId
        })
    }else {
        res.render('top', {
            userId: '로그인'
        })
    }
});

app.get('/underwear.html', (req,res) => {
    console.log('session 확인',req.session.userId);
    if(req.session.userId !== undefined) {
        res.render('underwear', {
            userId: req.session.userId
        })
    }else {
        res.render('underwear', {
            userId: '로그인'
        })
    }
});

app.get('/login.html', (req, res) => {
    if(req.session.userId !== undefined) {
        res.render('login', {
            userId: req.session.userId
        })
    }else {
        res.render('login', {
            userId: '로그인'
        })
    }
})

app.get('/signup.html',(req, res) => {
    res.sendFile(path.join(__dirname, '/views/signup.html'));
})

app.get('/management.html', (req,res) => {
    res.sendFile(path.join(__dirname,'/management.html'));
});

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url}라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    console.log('SERVER ERROR -=-=-=-=-=-=-', err.message, err);
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });


app.listen(app.get('port'), () => {
    console.log(app.get('port'),'번 포트에서 쇼핑몰 대기 중');
});