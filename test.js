const express = require('express');
const app = express();
const envMiddleware = require('./index');
const request = require('supertest');

app.use(express.json());
app.use(envMiddleware("Chuksy"))


describe('Middleware setup usage', function() {

    test("Should not set environment variable with unsupported method", (done) => {
        request(app)
            .get('/envset')
            .expect(404)
            .then(function(response){
                expect(response.text).toEqual('Not found');
                done();
            });
    });

    test("Should not set environment variable with object config without authKey field", (done) => {

        try{
            app.use(envMiddleware({
                athKey: ""
            }))
        } catch(exc){
            expect(exc.message).toEqual("Invalid environment variables update config")
            done()
        }
    
    });

    test("Should not set environment variable without auth value", (done) => {
        try{
            app.use(envMiddleware())
        } catch(exc){
            expect(exc.message).toEqual("Invalid environment variables update config")
            done()
        }
    });

    test('Should not set environment variable when auth key is incorrect', function(done) {
        const authKey = "Chuksy"
        app.use(envMiddleware(authKey))
        request(app)
            .post('/envset')
            .send({name: 'john'})
            .set('env_authkey', authKey+'random')
            .expect(403)
            .then(function(response){
                expect(response.text).toEqual('Unauthorized')
                done();
            })
    });

    test('Should not set environment variable when request body is absent', function(done) {
        const authKey = "Chuksy"
        app.use(envMiddleware(authKey))
        request(app)
            .post('/envset')
            .set('env_authkey', authKey)
            .expect(400)
            .then(function(response){
                expect(response.text).toEqual('Invalid process env object')
                done();
            })
    });

    test('Should set environment variable', function(done) {
        const authKey = "Chuksy"
        const envVariables = {
            "FLW_SECRET_KEY": "cHU_384fafafafdADF&*",
            "FLW_PUBLIC_KEY": "pbKey_32AFDjdjaDFAii"
        }

        app.use(envMiddleware(authKey))
        request(app)
            .post('/envset')
            .set('env_authkey', authKey)
            .send({env:envVariables})
            .expect(200)
            .then(function(response){
                for(let key in response.body.data){
                    expect(response.body.data[key]).toEqual(envVariables[key])
                }
                done();
            })
    });

});
