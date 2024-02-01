const { Router } = require("express");
const { usersModel } = require("../../dao/models/users.model.js");
const authentication = require("../../middlewares/auth.middleware.js");
const router = Router();
//const userservice = require('../../services/users.service.js')
router
    .get('/current', authentication, (req,res)=>{
        res.send('info actual del usuario pasado por seguridad')
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
        const { email, password } = req.body;
        console.log(email,password);
    
        try {
            const user = await usersModel.findOne({ email });
            
    
            if (!user || user.password !== password) {
                return res.status(401).send({ status: 'error', message: 'Usuario o contraseña incorrectos' });
            }    
            req.session.user = user;
            req.session.email = email;
            req.session.admin = user.role === 'admin';
            res.send({ message: 'Logged in' });
    
        } catch (error) {
            console.error('Error en el login:', error);
            res.status(500).send({ message: 'Internal Server Error' });
        }
    })
    

    .post('/register', async (req, res) => {
        const { first_name, last_name, email, password } = req.body;    
        console.log(first_name,last_name,email,password)
        if(first_name ==='' || last_name ==='' || email ==='' || password ===''){
            return res.status(400).send({ message: 'Faltan datos para Registro' });
        }
        try {            
            const existingUser = await usersModel.findOne({ email });    
            if (existingUser) {
                return res.status(400).send({ message: 'Usuario ya existe' });
            }
            const newUser = await usersModel.create({ first_name, last_name, email, password });                
            req.session.user = newUser;    
            console.log('Registro Exitoso')
            res.send({ message: 'Registro Exitoso' });
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

// router de cookies
// router
// .get('/setCookie',(req,res)=>{
//     console.log('setcookie')
//     res.cookie('Micookie','esta es una cookie',{maxAge:60*60*24,signed:true}).send('Cookies seteadas')
// })
// .get('/getCookie',(req,res)=>{
//     console.log('getcookie')    
//     res.send(req.signedCookies)
// })
// .get('/deleteCookie',(req,res)=>{
//     console.log('Micookie deleted')
//     res.clearCookie('Micookie').send('Cookie Borrada')
// })

// .post('/login',async (req,res)=>{
//     //const {email,password} = req.body
//     //const user = await userservice.getUser({email})
//     //if(!user) return res.status(401).send({status:'error',message:'usuario no exisre'})    
// })
// // post de register
// .post('/register',(req,res)=>{
//     const {first_name,last_name,email,password} = req.body
//     console.log(username,password)
//     if(username && password){
//         req.session.user = username
//         res.send({message:'Registered'})
//     }else{
//         res.send({message:'Missing credentials'})
//     }
// })
// //post de logout
// .post('/logout',(req,res)=>{
//     req.session.destroy()
//     res.send({message:'Logged out'})
// })


module.exports = router
