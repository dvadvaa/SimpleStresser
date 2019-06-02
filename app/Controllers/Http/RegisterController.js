'use strict'
const User              = use('App/Models/User')

const { validate }      = use('Validator')
const { validateAll }   = use('Validator')

class RegisterController {
    async create({request, session, response}){
        const data      = request.only(['username', 'email', 'password'])

        const rules     = {
            username:   'required',
            email:      'required|email|unique:users',
            password:   'required|min:6'
        }

        const messages  = {
            'username.required' : 'Username is required to continue',
            'email.required'    : 'Email is required to continue',
            'password.required' : 'Password is required to continue',
            'password.min'      : 'Minimum 6 characters',
        }
        
        const validation = await validateAll(data, rules, messages)

        if (validation.fails()) {
            session
                .withErrors(validation.messages())
                .flashExcept(['password'])

            return response.redirect('back')
        }else{
            await User.create({
                username:   request.input('username'),
                email:      request.input('email'),
                password:   request.input('password'),
                plan:       '0',
                role:       'user',
            })
            session.flash({ notification: 'Account successfully created!' })
            return response.route('signin')
        }

    }
}

module.exports = RegisterController
