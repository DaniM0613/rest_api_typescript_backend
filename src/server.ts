import express from 'express'
import colors from 'colors'
import cors, {CorsOptions} from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swaggerUiOptions} from './config/swagger'
import router from './router'
import db from './config/db'

// Conectar a base de datos
export async function connectDB(){
    try{
       await db.authenticate()
       db.sync()
       //console.log( colors.blue('Conexion exitosa a la DB'))

    }catch (error){
        // console.log(error)
        console.log(colors.red.bold("Hubo un error al conectar a la base de datos"))
    }
}
connectDB()

// Instancia de express
const server = express()

// Permitir conexiones
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        if(origin === process.env.FRONTEND_URL){
            callback(null, true)
        }else {
            callback(new Error('Error de cors'))
        }
    }
}
server.use(cors(corsOptions))

// Leer datos de formulario
server.use(express.json())

server.use(morgan('combined'))

server.use('/api/products', router)

// DOCS
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server