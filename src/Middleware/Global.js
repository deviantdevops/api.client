module.exports = {

    /**
     * This is a middleware template. 
     */
    nullWare: (req, res, next) => {
        console.log('GLOBAL NULLWARE MIDDLEWARE ACTIVE')
        next();
    } 


}