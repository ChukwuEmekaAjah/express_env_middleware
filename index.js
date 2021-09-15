function envset(config){

    return function(req, res, next){

        if(req.method.toLowerCase() !== "post"){
            return res.status(404).send('Not found')
        }

        let authKey = null;
        if(typeof config === 'string' && config.trim()){// developer only wants to set the auth key string
            authKey = config;
        } 

        if(typeof config === 'object'){ // developer wants to add other configurations
            if(!config.authKey || typeof config.authKey !== "string" || !config.authKey.trim()){
                return res.status(403).send("Unauthorized");
            }
            authKey = config.authKey;
        }

        if(!authKey){
            return res.status(403).send("Unauthorized");
        }

        if(req.headers['env_authkey'] !== authKey){
            return res.status(403).send("Unauthorized");
        }

        if(!req.body.env || typeof req.body.env !== 'object'){
            return res.status(400).send("Invalid process env object")
        }

        let env = Object.assign({}, req.body.env, process.env);
        process.env = env;

        const responseBody = {}

        for(let key in req.body.env){
            responseBody[key] = process.env[key]
        }

        return res.status(200).send({message:"Environment variables set", status:"success", data: responseBody})
    }
    
}

module.exports = envset;