'use strict'
const Database  = use('Database')

const Method    = use('App/Models/Method')

const User      = use('App/Models/User')

const Attack    = use('App/Models/Attack')

class HubController {

	toUNIXDays(timeStr) {
		return Math.round( parseInt( (new Date(timeStr)).getTime() / 1000 ).toFixed(0) )
	}

	async main({view, auth}){
		const methodsL7 = await Method.query().where('type', '7').where('status', '1').fetch()
		const methodsL4 = await Method.query().where('type', '4').where('status', '1').fetch()

		const plan      = await User.query().with('userPlan').where('id', auth.user.id).fetch()
		const userJson  = plan.toJSON()[0]

		const attacks   = await Attack.query().with('methodInfo').where('user_id', auth.user.id).where('stopped', '0').orderBy('id', 'desc').limit(5).fetch()
        
	

		return view.render('attacks.new',{
			methodsL7: methodsL7.toJSON(),
			methodsL4: methodsL4.toJSON(),
			plan: plan.toJSON(),
			attacks: attacks.toJSON(),
			date: Math.round((new Date()).getTime() / 1000),
		})
	}
}

module.exports = HubController
