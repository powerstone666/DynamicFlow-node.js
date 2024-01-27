import mysql from "mysql2"
import dotenv from "dotenv"

dotenv.config();

const pool = mysql.createPool({
     host :process.env.DB_HOST,
     port :process.env.DB_PORT,
     user :process.env.DB_USER,
    password : process.env.DB_PASSWORD,  // Replace with the actual password
    database : process.env.DB_NAME
}).promise();

export async function getUser()
{
    try{
const [row]=await pool.query("SELECT * FROM users")
return row;
    }
    catch(err)
    {
        
    }
}
export async function  getEmail(email)
{
    try{
        const [row]=await pool.query("SELECT * FROM users WHERE email=?",[email])
        return row[0];
    }
    catch(err)
    {
     
    }
}
export async function createUser(firstname,lastname,email,password)
{
    try{
        const [row]=await pool.query("INSERT INTO users(firstname,lastname,email,password) VALUES(?,?,?,?)",[firstname,lastname,email,password])
        const userid=row.insertId;
        return {_id:userid};
    }
    catch(err)
    {
      
    }
}   
export async function  getid(id)
{
    try{
        const [row]=await pool.query("SELECT * FROM users WHERE id=?",[id])
        return row;
    }
    catch(err)
    {
       
    }
}
export async function  getadmin(email)
{
    try{
        const [row]=await pool.query("SELECT * FROM admin WHERE email=?",[email])
        return row[0];
    }
    catch(err)
    {
        
    }
}
export async function edit(id,firstname,lastname,email)
{
    try{
        const [row]=await pool.query("UPDATE users SET firstname=?,lastname=?,email=? WHERE id=?",[firstname,lastname,email,id])
        return row;
    }
    catch(err)
    {
        
    }
}
export async function deleteUser(id)
{
    try{
        const [row]=await pool.query("DELETE FROM users WHERE id=?",[id])
        return row;
    }
    catch(err)
    {
       
    }
}
export async function editnote(title, note, a, id) {
    try {
        const [row] = await pool.query("UPDATE notes SET note=?, title=? WHERE note_id=? AND userid=?", [note, title, id, a]);
        return row;
    } catch (err) {
        
    }
}

export async function noteadd(title, note, userid) {
    try {
        const [row] = await pool.query("INSERT INTO notes(title, note, userid) VALUES(?,?,?)", [title, note, userid]);
        return row;
    } catch (err) {
       
         // Rethrow the error to be caught in the route handler
    }
}
export async function getnotes(userid) {
    try {
        const [row] = await pool.query("SELECT * FROM notes WHERE userid=?", [userid]);
        return row;
    } catch (err) {
        
    }
}
export async function getnote(id,userid) {
    try {
        const [row] = await pool.query("SELECT * FROM notes WHERE userid=? AND note_id=?", [userid,id]);
        return row;
    } catch (err) {
        
    }
}
export async function deletenote(id)
{
    try{
        const [row]=await pool.query("DELETE FROM notes WHERE note_id=?",[id])
        return row;
    }
    catch(err)
    {
       
    }
}
export async function setnote(id, userid, title, note) {
    try {
      const [row] = await pool.query(
        "UPDATE notes SET title=?, note=? WHERE userid=? AND note_id=?",
        [title, note, userid, id]
      );
      return row; // Assuming you want to return the updated row
    } catch (err) {
     
    }
  }
  