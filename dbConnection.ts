import mariadb from 'npm:mariadb'
import * as t from './structures/interfaces.ts'
import "jsr:@std/dotenv/load";

const db = mariadb.createPool({
	host: Deno.env.get("BDD_HOST"),
	user: Deno.env.get("BDD_USER"),
	password: Deno.env.get("BDD_PASSWORD"),
	database: Deno.env.get("BDD_DATABASE"),
	port: Number(Deno.env.get("BDD_PORT")),
	acquireTimeout: Number(Deno.env.get("BDD_TIMEOUT")),
	connectionLimit: Number(Deno.env.get("BDD_CONECTION_LIMITS"))
})

async function query(query: string, params?: object) {
	let connection
	try{
		connection = await db.getConnection()
		const res = await connection.query(query, params)
		return res
	}catch(err){
		console.log(err)
		throw err
	}finally{
		connection?.release()
	}
}

async function execute(query: string, params?: object) {
	let connection
	try{
		connection = await db.getConnection()
		const res = await connection.execute(query, params)
		return res
	}catch(err){
		console.log(err)
		throw err
	}finally{
		connection?.release()
	}
}

export async function login(data: t.loginData){
	const {identification} = data
	const res = await query('SELECT * FROM users WHERE id = ?', [identification])
	return res
}

export async function getDateList(requesterId:number) {
	const res = await query("SELECT * FROM dates WHERE doctorId = ? AND status = 'Pendiente'", [requesterId])
	return res
}

export async function getHistoryById(patientId:number){
	const res = await query(`
		SELECT * FROM patients
		LEFT JOIN childHistories ON patients.id = childHistories.patientId
		LEFT JOIN adultHistories ON patients.id = adultHistories.patientId
		WHERE patient.id = ?
	`, [patientId])
	return res
}

export async function sendDateData(dateData: t.dateData) {

	const id = crypto.randomUUID()
	const dateId = dateData.dateId //Determinar id del paciente con esto

	const _res = await execute(`
		INSERT INTO consultations(
			id,
			patientId,
			consultationReason,
			currentDisease,
			treatment,
			bifosfonato,
			bifosfonadoDescription,
			reactionToAnesthesia,
			reactionToAnesthesiaDesc,
			alergy,
			alergyDescription,
			cancer,
			pregnacy,
			ailments,
			bloodType,
			proneToBleeding,
			height,
			weight,
			complementaryTest,
			sys,
			dia,
			bpm,
			temp,
			physicalExamination,
			intraoralExamination,
			gumEvaluation,
			dentalDiagram,
			childrenDentalDiagram,
			forecast,
			observations,
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ? ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, [
		id,
		patientId,
		dateData.consultationReason,
		dateData.currentDisease,
		dateData.treatment,
		dateData.bifosfonato,
		dateData.bifosfonadoDescription,
		dateData.reactionToAnesthesia,
		dateData.reactionToAnesthesiaDesc,
		dateData.alergy,
		dateData.alergyDescription,
		dateData.cancer,
		dateData.pregnacy,
		dateData.ailments,
		dateData.bloodType,
		dateData.proneToBleeding,
		dateData.height,
		dateData.weight,
		dateData.complementaryTest,
		dateData.sys,
		dateData.dia,
		dateData.bpm,
		dateData.temp,
		dateData.physicalExamination,
		dateData.intraoralExamination,
		dateData.gumEvaluation,
		dateData.dentalDiagram,
		dateData.childrenDentalDiagram,
		dateData.forecast,
		dateData.observations,
	])
}

export async function updateDentalDiagram(data: t.dentalDiagram) {
	
}

export async function updateChildrenDentalDiagram(data: t.childrenDentalDiagram) {
	
}