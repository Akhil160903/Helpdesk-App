import subprocess as sp
import pymysql
import pymysql.cursors

# Defining the Colors


def prRed(skk): print("\033[91m{}\033[00m" .format(skk))
def prGreen(skk): print("\033[92m{}\033[00m" .format(skk))
def prYellow(skk): print("\033[93m{}\033[00m" .format(skk))
def prLightPurple(skk): print("\033[94m{}\033[00m" .format(skk))
def prPurple(skk): print("\033[95m{}\033[00m" .format(skk))
def prCyan(skk): print("\033[96m{}\033[00m" .format(skk))
def prLightGray(skk): print("\033[97m{}\033[00m" .format(skk))
def prBlack(skk): print("\033[98m{}\033[00m" .format(skk))


def custom_query(query):
    try:
        cur.execute(query)
        output = cur.fetchall()
        conn.commit()
        for row in output:
            for col in row:
                print(col, end='\t')
            print()
    except:
        conn.rollback()
        prRed("Failed to Execute the Operation")
    return


# Driver Code
tmp = sp.call('clear', shell=True)
while (1):
    IP = "63.250.60.129"
    Username = "ndu1"
    Password = "ndu!NDU"
    Database = "ndesk"

    if (1):
        conn = pymysql.connect(
            host=IP,
            user=Username,
            password=Password,
            db=Database,
        )
        tmp = sp.call('clear', shell=True)

        if conn.open:
            prGreen("Connected")
        else:
            prRed("Failed to connect")

        tmp = input("Enter any key to CONTINUE> ")

        cur = conn.cursor()
        with conn.cursor() as cur:
            while (1):
                tmp = sp.call('clear', shell=True)

                prYellow(
                    "------------------------ CUSTOM OPERATIONS ------------------------")
                query = input("Enter the Query> ")
                custom_query(query)
                tmp = input("Enter any key to CONTINUE> ")
    else:
        prRed("Connection Refused: Either username or password is incorrect or user doesn't have access to database")
        print("")
