const { Router } = require("express");
const authentication = require("../../middlewares/auth.middleware.js");
const { isValidPassword, createHash } = require("../../utils/hashPassword.js");
const passport = require("passport");
const router = Router();
router
    .get('/github', passport.authenticate('github', { scope: ['user:email'] }))


    .get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
        req.session.user = req.user;
        res.redirect('/products');
    })

    .post('/register', (req, res, next) => {
        console.log('Entering register route'); // Log statement
        passport.authenticate('register', { failureRedirect: '/api/sessions/failregister' })(req, res, next);
    }, (req, res) => {
        // Logic for a successful registration
        console.log('Registration successful')
        //res.send('Registration successful');
        res.redirect('/login');
    })
    .get('/failregister',(req,res)=>{
        console.log('Error en la estrategia de registro')
        res.send('error al registrar el usuario')
    })

    .post('/login',passport.authenticate('login',{failureRedirect:'/api/seasions/faillogin'}), async (req,res)=>{
        if(!req.user) return res.status(400).send({status:'error',eroor :'Usuario no encontrado'})
        req.session.user = req.user;  //guardamos los datos del user en una sesion
        console.log('Usuario logueado')
        console.log('Before redirection to /products');
        res.redirect('/products');
        console.log('After redirection to /products');

    }
    )   
    .get('/faillogin',(req,res)=>{
        console.log('Error en la estrategia de login')
        res.send('error al loguear el usuario')
    })


    .get('/current', authentication, (req, res) => {
        res.send(req.session.user)
    })
    .get('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) return res.send({ status: 'error', message: 'Error al cerrar la sesión' })
        })
        res.redirect('/login');
    })

    .get('/', (req, res) => {
        if (req.session.counter) {
            req.session.counter++;
            res.send({ message: 'Ha ingresado al E-Commerce X', counter: req.session.counter });
        } else {
            req.session.counter = 1;
            res.send({ message: 'Bienvenido al E-Commerce', counter: 1 });
        }
    })

  
module.exports = router
