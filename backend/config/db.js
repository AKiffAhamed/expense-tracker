import {neon} from "@neondatabase/serverless"

import "dotenv/config"

//creates a sql connection using our db link
export const sql = neon(process.env.DATABASE_URL);