import mysql.connector
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",         # or your MySQL host
            user="root",   # replace with your MySQL username
            password="1911yashyash", # replace with your MySQL password
            database="main_db"   # replace with the target database name
        )
        return connection
    except Error as e:
        print(f"Error while connecting to MySQL: {e}")
        return None
