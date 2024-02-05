const { Router } = require('express')
const { authentication } = require('../../middlewars/auth.middleware')
const { usersModel } = require('../../models/users.model')
const { createHash, isValidPassword } = require('../../utils/hashPassword')
const passport = require('passport')
const router = Router()

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}),(req, res)=>{
    res.json({status: 'success', message: 'user created'})

})

router.get('/failregister', (req, res) => {
    console.log('Fail strategy')
    res.send({status: 'error', error: 'Fialed'})
})

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async (req, res)=>{
    if(!req.user) return res.status(400).send({status: 'error', error: 'invalid credential'})
    req.session.user = {
        email: req.user.email,
        first_name: req.user.first_name
    }
    res.send({status: 'success', message: 'login succcess'})
})
router.get('/faillogin', (req, res) => {
    res.send({error: 'failed login'})
})



router.get('/current', authentication, (req, res) => {
    res.send('info sensible que solo puede ver el admin')
})

router.get('/logout', (req, res)=>{
    req.session.destroy(err=>{
        if (err) return res.send({status: 'error', error: err})
    })
    res.send('logout exitoso')
})



module.exports = router

