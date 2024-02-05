const passport  = require('passport');
const local = require('passport-local');
const { isValidPassword, createHash } = require('../utils/hashPassword');
const UserDaoMongo = require('../dao/usersDaoMongo.js');
const localStrategy = local.Strategy

const userservice = new UserDaoMongo();

exports.initializePassport = () => {
    passport.use('register',new localStrategy({
        passReqToCallback:true,
        usernameField:'email',
        passwordField:'password'
      },async (req, email, password, done) =>{

        try {
            const {first_name,last_name,role} = req.body;
            let usuario = await userservice.getUser({email:email});
            if(usuario) return done(null,false);
                       
            const newUser = {
                first_name,
                last_name,
                email,
                password:createHash(password),
                role
            }
            let result = await userservice.createUser(newUser);
            return done(null,result);
        } catch (error) {
            return done('Error al Crear el usuario'+ error);
        }
      }));


    passport.use('login',new localStrategy({
        usernameField:'email',
        passwordField:'password'
      },async (email, password, done) =>{
        try {
            const user = await userservice.getUser({email:email});
            if(!user){
                return done(null,false);
            }
            if(!isValidPassword(password,user.password)){
                return done(null,false);
            }
            return done(null,user);
        } catch (error) {
            return done(error);
        }
      }));
};

passport.serializeUser((user,done)=>{
    done(null,user._id);
} );

passport.deserializeUser( async (id,done) =>{
    try {
        const user = await userservice.getUser({_id:id})
        done(null,user);
    } catch (error) {
        done(error);
    }
});

