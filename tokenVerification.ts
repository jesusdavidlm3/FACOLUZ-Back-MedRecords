import jwt from 'npm:jsonwebtoken'
const secret = Deno.env.get("SECRET")


export function verification(req, res, next){
	try{
		const token = req.headers.authorization.split(" ")[1]
		const payload = jwt.verify(token, secret)
		if(Date().now > payload.exp){
			res.status(401).send('Sesion expirada')
		}else if(payload.type != 2){
            res.status(401).send('Usted no se encuentra registrado como estudiante')
        }
		next()
	}catch(err){
		return res.status(401).send('Token no válido');
	}
}

export function getTokenInfo(req) {
	const token = req.headers.authorization.split(" ")[1]
	const payload = jwt.verify(token, secret)
	return payload
}

export default verification;