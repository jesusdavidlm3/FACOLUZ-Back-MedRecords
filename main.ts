import express from "npm:express@4.18.2";
import cors from 'npm:cors'
import jwt from 'npm:jsonwebtoken'
import * as db from './dbConnection.ts'
import "jsr:@std/dotenv/load";
import verification, { getTokenInfo } from './tokenVerification.ts'

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
		}else if(dbResponse[0].type != 2){
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

app.get('/api/getDatesList', verification, async(req, res) => {
	try{
		const tokenData = getTokenInfo(req)
		const dbResponse = await db.getDateList(tokenData.id)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.get("/api/getHistory/:patientId", verification, async(req, res) => {
	try{
		const patientId = req.params.patientId
		const dbResponse = await db.getHistoryById(patientId)
		res.status(200).send(dbResponse)
	}catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

app.post('/api/setDateData', verification, async(req, res) => {
	try{
		const dbResponse = await db.setDateData(req.body)
		console.log(dbResponse)
		res.status(200).send("Registrado")
	}catch(err){
		console.log(err)
		res.status(500).send("error del servidor")
	}
})

// app.post('/api/finishDate', verification, async(req, res) => {
// 	try{
// 		const dbResponse = await db.addDateReg(req.body)
// 		console.log(dbResponse)
// 		// ejecutar tambien las querys para actualizar datos y almacenar odontograma y otros datos cambiantes parcialmente
// 		res.status(200).send("Registrado")
// 	}catch(err){
// 		console.log(err)
// 		res.status(500).send("error del servidor")
// 	}
// })

app.listen(port, "0.0.0.0", () => {
	console.log(`Puerto: ${port}`)
})

