import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(cors({
  origin:process.env.CORS_ORIGIN,
  credentials: true,
}))

// for json limit
app.use(express.json({limit:'16kb'}))
//when data come in url
app.use(express.urlencoded({extended:true,limit:"16kb"}))
// for store static files in local storage
app.use(express.static("public"))
// set user cookies
app.use(cookieParser())
export {app}