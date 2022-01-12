import authentication from './Authentication'
import planboard from './planboard'

export default (app) => {
    authentication(app)
    planboard(app)
    return app

}