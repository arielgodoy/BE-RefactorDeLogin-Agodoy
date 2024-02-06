const passport  = require('passport');
const local = require('passport-local');
const { isValidPassword, createHash } = require('../utils/hashPassword');
const UserDaoMongo = require('../dao/usersDaoMongo.js');
const localStrategy = local.Strategy

const userservice = new UserDaoMongo();

exports.initializePassport = () => {
  passport.use('register', new localStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
}, async (req, email, password, done) => {
    try {
        
        const { first_name, last_name, email, role } = req.body;
        const existingUser = await userservice.findByEmail(email);
        
        
        if (existingUser) {
            return done(null, false, { message: 'User with this email already exists.' });
        }

        // Create a new user
        
        const newUser = {
            first_name,
            last_name,
            email,
            password: createHash(password),
            role
        };

        const result = await userservice.createUser(newUser);
        return done(null, result);
    } catch (error) {
        console.error('Error during user registration:', error);
        return done('Error during user registration.');
    }
}));



      passport.use('login', new localStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true, // Add this line
      }, async (req, email, password, done) => {
        try {
            const user = await userservice.findByEmail(email);
            if (!user) {
              console.log('Usuario no encontrado');
              return done(null, false);
            }
            //console.log('Es un usuario valido')            
            if (!isValidPassword(password, user.password)) {
              return done(null, false);
            }
            return done(null, user);
            

        } catch (error) {
          return done(error);
        }
      }));
      


      }

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

