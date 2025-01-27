import mariadb from 'mariadb'
import { v4 as UIDgenerator } from 'uuid';


const db = mariadb.createPool({
	host: process.env.BDD_HOST,
	user: process.env.BDD_USER,
	password: process.env.BDD_PASSWORD,
	database: process.env.BDD_DATABASE,
	port: process.env.BDD_PORT,
	acquireTimeout: process.env.BDD_TIMEOUT,
	conexionLimit: process.env.BDD_CONECTION_LIMITS
})

export async function login(data){
	const {identification, passwordHash} = data
	let connection
	try{
		connection = await db.getConnection()
		const user = await connection.query('SELECT * FROM users WHERE identification = ?', [identification])
		return user
	}catch(err){
		return err
	}finally{
		connection.release()
	}
}