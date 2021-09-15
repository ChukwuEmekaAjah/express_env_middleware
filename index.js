function envset(config){
    let setup = {
        url: "/envset",
        method: "post"
    }

    let authKey = null;
    if(typeof config === 'string' && config.trim()){// developer only wants to set the auth key string
        setup.authKey = config;
    }

    if(typeof config === 'object'){ // developer wants to add other configurations
        if(config.authKey && typeof config.authKey === "string" && config.authKey.trim()){
            setup.authKey = config.authKey
        }
        setup = Object.assign(setup, config)
    }

    if(!setup.authKey){
        throw new Error("Invalid environment variables update config")
    }
    
    return function(req, res, next){
        
        if(req.url !== setup.url){
            return next();
        }

        if(req.method.toLowerCase() !== setup.method){
            return res.status(404).send('Not found')
        }

        if(req.headers['env_authkey'] !== setup.authKey){
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