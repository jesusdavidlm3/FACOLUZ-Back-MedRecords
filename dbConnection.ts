import mariadb from 'npm:mariadb'
import * as t from './structures/interfaces.ts'
import "jsr:@std/dotenv/load";
import { getAge } from "./functions.ts";
import { UUID } from "node:crypto";

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
	const res = await query(`
		SELECT
			d.id AS dateId,
			d.date,
			p.name,
			p.patientCode AS code,
			p.patientIdentificacion AS identification,
			p.identificationType as idType,
			p.lastname,
			p.id AS patientId
		FROM dates d JOIN patients p ON d.patientId = p.id WHERE d.doctorId = ? AND d.status = 'Pendiente'
	`, [requesterId])
	console.log(res)
	return res

}

export async function getHistoryById(patientId:UUID){
	const history = await query(`
		SELECT
			p.*,
			a.currentWorking,
			a.workType,
			a.familyBurden,
			a.phone,
			c.currentStudying,
			c.representativeName,
			c.representativeIdentification,
			c.representativePhone,
			c.representativeInstructionGrade,
			c.representativeWorking,
			c.representativeWorkType,
			c.representativeFamilyBurden,
			c.familyDentalHistory,
			c.dietaryHabits,
			c.height,
			c.weight
		FROM patients p
		LEFT JOIN childhistories c ON p.id = c.patientId
		LEFT JOIN adulthistories a ON p.id = a.patientId
		WHERE p.id = ?
	`, [patientId])

	const consultationsList = await query(`
		SELECT id FROM consultations WHERE patientId = ?
	`, [patientId])

	const res = {...history[0], consultationsList: consultationsList, firstDate: consultationsList.length != 0 ? false : true}
	return res
}

export async function sendDateData(dateData: t.dateData) {

	const id = crypto.randomUUID()

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
		dateData.patientId,
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

	const firstDateCheck = await query(`SELECT COUNT(*) FROM consultations WHERE patientId = ?`, [dateData.patientId])

	if(firstDateCheck == 0){
		const _patientQuery = await execute(`
			INSERT INTO patients(bloodtype) VALUES(?) WHERE id = ?
		`, [dateData.bloodType, dateData.patientId])
	}

	const birthDate = await query(`SELECT birthDate FROM patients WHERE id = ?`, [dateData.patientId])

	if(getAge(birthDate) < 18){
		const _childrenQuery = await execute(`
			INSERT INTO childhistories(
				height,
				weight
			) VALUES(?, ?)
		`, [
			dateData.height,
			dateData.weight
		])
	}
}