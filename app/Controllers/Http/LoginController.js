'use strict'
const User              = use('App/Models/User')

const Database          = use('Database')

const { validate }      = use('Validator')

const { validateAll }   = use('Validator')

class LoginController {
    async login({request, session, response, auth}){
        const data      = request.only(['email', 'password'])

        const rules     = {
            email:      'required|email',
            password:   'required|min:6'
        }

        const messages  = {
            'email.required'    : 'Email is required to continue',
            'password.required' : 'Password is required to continue',
        }
        
        const validation = await validateAll(data, rules, messages)

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashExcept(['password'])

            return response.redirect('back')
        }else{
            await auth.attempt(request.input('email'), request.input('password'))
            const userplan = await User.query().with('userPlan').where('email', request.input('email')).fetch()
            const user_info_json = userplan.toJSON()
            if(parseInt((new Date(user_info_json[0].expire).getTime() / 1000).toFixed(0)) < Math.round((new Date()).getTime() / 1000))
            {
                const nulledPlan = await Database
                    .table('users')
                    .where('email', request.input('email'))
                    .update('plan', '0')  
            }
            session.flash({ notification: 'You have logged in succssfully!' })
            return response.redirect('/dashboard')
        }
    }
    async logout({request, session, response, auth}){
        await auth.logout()
        return response.redirect('/')
    }

}

module.exports = LoginController
