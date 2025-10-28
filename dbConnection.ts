import mariadb from 'npm:mariadb'
import * as t from './structures/interfaces.ts'
import "jsr:@std/dotenv/load";
import { dateToDb, getAge } from "./functions.ts";
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

export async function getDateList(requesterId:number, page: number) {
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
		FROM dates d JOIN patients p ON d.patientId = p.id
		WHERE d.doctorId = ? AND d.status = 'Pendiente'
		LIMIT 10 OFFSET ?
	`, [requesterId, (page-1)*10])
	console.log(res)
	return res

}

export async function getHistoryById(patientId:UUID, page: number){
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
		SELECT id, dateTime FROM consultations WHERE patientId = ? LIMIT 10 OFFSET ?
	`, [patientId, (page-1)*10])

	const res = {...history[0], consultationsList: consultationsList, firstDate: consultationsList.length != 0 ? false : true}
	console.log(res)
	return res
}

export async function setDateData(dateData: t.dateData) {
	console.log(dateData)
	const id = crypto.randomUUID()
	const dateTime = new Date()

	const firstDateCheck = await query(`SELECT COUNT(*) FROM consultations WHERE patientId = ?`, [dateData.patientId])

	if(Number(firstDateCheck[0]['COUNT(*)']) == 0){
		const _patientQuery = await execute(`
			UPDATE patients SET bloodType = ?, bifosfonato = ?, bifosfonatoDescription = ?, alergy = ?, alergyDescription = ?, cancer = ?, ailments = ?, proneToBleeding = ? WHERE id = ?
		`, [
			dateData.bloodType, 
			dateData.bifosfonato,
			dateData.bifosfonatoDescription,
			dateData.alergy,
			dateData.alergyDescription,
			dateData.cancer,
			dateData.ailments,
			dateData.proneToBleeding,
			dateData.patientId
		])
	}

	const _res = await execute(`
		INSERT INTO consultations(
			id,
			patientId,
			dateTime,
			consultationReason,
			currentDisease,
			treatment,
			reactionToAnesthesia,
			reactionToAnesthesiaDesc,
			pregnacy,
			complementaryTests,
			systolicPresure,
			diastolicPresure,
			BPM,
			temp,
			physicalExamination,
			intraoralExamination,
			gumEvaluation,
			dentalDiagram,
			childrenDentalDiagram,
			forecast,
			observations
		) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`, [
		id,
		dateData.patientId,
		dateToDb(dateTime),
		dateData.consultationReason,
		dateData.currentDisease,
		dateData.treatment,
		dateData.reactionToAnesthesia,
		dateData.reactionToAnesthesiaDesc,
		dateData.pregnacy,
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
		dateData.observations
	])


	const ageQuery = await query(`SELECT birthDate FROM patients WHERE id = ?`, [dateData.patientId])
	
	if(getAge(new Date(ageQuery[0].birthDate)) < 18){
		const _childrenQuery = await execute(`
			UPDATE childhistories SET
				height = ?,
				weight = ?
			WHERE patientId = ?
		`, [
			dateData.height,
			dateData.weight,
			dateData.patientId
		])
	}

	return {success: true}
}