import express from "npm:express@4.18.2";
import cors from 'npm:cors'
import jwt from 'npm:jsonwebtoken'
import * as db from './dbConnection.ts'
import "jsr:@std/dotenv/load";
import * as tokenVerification from './tokenVerification.ts'

const port = Deno.env.get("PORT")
const secret = Deno.env.get("SECRET")

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/api/login', async (req, res) => {
	const {identification, passwordHash} = req.body
	let dbResponse
	try{
		dbResponse = await db.login(req.body)
		console.log(dbResponse)
		if(dbResponse.length == 0){
			res.status(404).send('Usuario no encontrado')
		}else if(dbResponse[0].passwordSHA256 != passwordHash){
			res.status(401).send('Contraseña Incorrecta')
		}else if(dbResponse[0].active == false){
			res.status(404).send('Este usuario se encuentra inactivo')
		}else if((dbResponse[0].type != 1) && (dbResponse[0].type != 2)){
			res.status(401).send('Usted no es un profesor o alumno')
		}else{
			const token = jwt.sign({
				id: dbResponse[0].id,
				name: dbResponse[0].name,
				type: dbResponse[0].type,
				exp: Date.now() + 600000
			}, secret)
			res.status(200).send({...dbResponse[0], jwt: token})
		}
	}catch(err){
		console.log(err)
		res.status(500).send('error del servidor')
	}
})

app.get('/api/getDatesList',tokenVerification.forTeachOrStud , async(req, res) => {
	try{
		const tokenData = tokenVerification.getTokenInfo(req)
		const dbResponse = await db.getDateList(tokenData.id)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.get("/api/getHistory/:patientId", tokenVerification.forTeachOrStud, async(req, res) => {
	try{
		const tokenData = tokenVerification.getTokenInfo(req)
		const dbResponse = await db.getHistoryById(tokenData.id)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.listen(port, "0.0.0.0", () => {
	console.log(`Puerto: ${port}`)
})

