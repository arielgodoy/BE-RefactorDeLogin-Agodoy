const { Router } = require("express");
const { usersModel } = require("../../dao/models/users.model.js");
const authentication = require("../../middlewares/auth.middleware.js");
const { isValidPassword, createHash } = require("../../utils/hashPassword.js");
const router = Router();
//const userservice = require('../../services/users.service.js')
router
    .get('/current', authentication, (req, res) => {
        res.send(req.session.user)
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
            if(!isValidPassword(password,{password:user.password}) ) {
                return res.status(401).send({ status: 'error', message: 'Usuario o contraseña incorrectos' });
            }
            //una vez Validado el usuario y passsword aqui guardamos el objeto de usuario en la session
            req.session.user = {
                user_id:user._id,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'email': user.email,
                'role': user.role
            }         
            res.send({
                status:'success',
                payload:'Login Success'                                   
            })
            
        } catch (error) {
            console.error('Login Internal Server Error:', error);
            res.status(500).send({ message: 'Login Internal Server Error' });
        }
    })

    .post('/register', async (req, res) => {
        const { first_name, last_name, email, password, role } = req.body;
        console.log(first_name, last_name, email, password, role);
        
    
        if (first_name === '' || last_name === '' || email === '' || password === '' || role === '') {
            return res.status(400).send({ message: 'Faltan datos para Registro' });
        }
    
        try {
            const existingUser = await usersModel.findOne({ email });
    
            if (existingUser) {
                return res.status(400).send({ message: 'Usuario ya existe' });
            }
    
            const newUser = await usersModel.create({ first_name, last_name, email, password:createHash(password), role });
            //creando una sesion con los datos del nuevo usuario
            const result = await newUser.save();
            res.send({
                status:'success',
                payload:{
                    id:result._id,
                    first_name:result.first_name,
                    last_name:result.last_name,
                    email:result.email,
                    role:result.role
                }
            })            
            res.redirect('/login');
    
        } catch (error) {
            console.error('Error en el registro:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    })
    


    .get('/logout', (req, res) => {
        req.session.destroy(err => {
            if (err) return res.send({ status: 'error', message: 'Error al cerrar la sesión' })
        })
        res.redirect('/login');

    })


module.exports = router
