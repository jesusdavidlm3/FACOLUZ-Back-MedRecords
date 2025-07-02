import mariadb from 'npm:mariadb'
import * as t from './interfaces.ts'
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
	const id = crypto.randomUUID
	const patientId = dateData.patientId
    const consultationReason = dateData.consultationReason
    const currentDisease = dateData.currentDisease
    const dateTime = dateData.dateTime
    const treatment = dateData.treatment
    const systolicPresure = dateData.systolicPresure
    const diastolicPresure = dateData.diastolicPresure
    const BPM = dateData.BPM
    const fisicConsistency = dateData.fisicConsistency
    const physicalExamination = dateData.physicalExamination
    const intraoralExamination = dateData.intraoralExamination
    const gumEvaluation = dateData.gumEvaluation
    const dentalDiagram = dateData.dentalDiagram
    const childrenDentalDiagram = dateData.childrenDentalDiagram
    const individualForecast = dateData.individualForecast
    const generalForecast = dateData.generalForecast
    const physicalTest = dateData.physicalTest
    const oclusionExamination = dateData.oclusionExamination
    const complementaryTest = dateData.complementaryTest
    const generalObservations = dateData.generalObservations
    const pulpVitality = dateData.pulpVitality

	const _res = await execute(`
		INSERT INTO consultations(
			id,
			patientId,
			consultationReason,
			currentDisease,
			dateTime,
			treatment,
			systolicPresure,
			diastolicPresure,
			BPM,
			fisicConsistency,
			physicalExamination,
			intraoralExamination,
			gumEvaluation,
			dentalDiagram,
			childrenDentalDiagram,
			individualForecast,
			generalForecast,
			physicalTest,
			oclusionExamination,
			complementaryTest,
			generalObservations,
			pulpVitality,
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ? ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, [
		id,
		patientId,
		consultationReason,
		currentDisease,
		dateTime,
		treatment,
		systolicPresure,
		diastolicPresure,
		BPM,
		fisicConsistency,
		physicalExamination,
		intraoralExamination,
		gumEvaluation,
		dentalDiagram,
		childrenDentalDiagram,
		individualForecast,
		generalForecast,
		physicalTest,
		oclusionExamination,
		complementaryTest,
		generalObservations,
		pulpVitality,
	])
}

export async function addDateReg(data:t.dateData) {
	const _res = await execute(`
		INSER INTO consultations(
			id,
			patientId,
			consultationReason,
			currentDisease,
			dateTime,
			treatment,
			systolicPresure,
			diastolicPresure,
			BPM,
			fisicConsistency,
			physicalExamination,
			intraoralExamination,
			gumEvaluation,
			dentalDiagram,
			childrenDentalDiagram,
			individualForecast,
			generalForecast,
			physicalTest,
			oclusionExamination,
			complementaryTest,
			generalObservations,
			pulpVitality,
			pregnacy,
			reactionToAnesthesia,
			reactionToAnesthesiaDesc
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, )
	`,[
		data.dateId,
		// data.patientId,
		data.consultationReason,
		data.currentDisease,
		data.dateTime,
		data.treatment,
		data.systolicPresure,
		data.diastolicPresure,
		data.BPM,
		data.fisicConsistency,
		data.physicalExamination,
		data.intraoralExamination,
		data.gumEvaluation,
		data.dentalDiagram,
		data.childrenDentalDiagram,
		data.individualForecast,
		data.generalForecast,
		data.physicalTest,
		data.oclusionExamination,
		data.complementaryTest,
		data.generalObservations,
		data.pulpVitality,
		data.pregnacy,
		data.reactionToAnesthesia,
		data.reactionToAnesthesiaDesc])
}

export async function updateDentalDiagram(data: t.dentalDiagram) {
	
}

export async function updateChildrenDentalDiagram(data: t.childrenDentalDiagram) {
	
}