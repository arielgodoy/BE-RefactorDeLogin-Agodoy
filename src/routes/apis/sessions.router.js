const { Router } = require("express");
const { usersModel } = require("../../dao/models/users.model.js");
const authentication = require("../../middlewares/auth.middleware.js");
const { isValidPassword, createHash } = require("../../utils/hashPassword.js");
const passport = require("passport");
const router = Router();
//const userservice = require('../../services/users.service.js')
router
    .post('/register',passport.authenticate('register',{failregister:'/api/sessions/failregister'}))
    .get('/failregister',(req,res)=>{
        res.send('Usuario ya existe')
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

    .post('/login', async (req, res) => {
        //si email o password no estan en el body recuperar de params
        const email = req.body.email || req.query.email;
        const password = req.body.password || req.query.password;
        console.log(email, password);
        try {
            const user = await usersModel.findOne({ email });
            if (!isValidPassword(password, { password: user.password })) {
                return res.status(401).send({ status: 'error', message: 'Usuario o contraseña incorrectos' });
            }
            //una vez Validado el usuario y passsword aqui guardamos el objeto de usuario en la session
            req.session.user = {
                user_id: user._id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'role': user.role
            }
            res.send({
                status: 'success',
                payload: 'Login Success'
            })

        } catch (error) {
            console.error('Login Internal Server Error:', error);
            res.status(500).send({ message: 'Login Internal Server Error' });
        }
    })
module.exports = router
