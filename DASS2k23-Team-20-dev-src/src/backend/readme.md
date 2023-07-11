# HelpDesk Backend
This is the first bolierplate vesion of the REST API for the backend.The defined endpoints are:
> [post] {url}/register : registers a user when the Email and Password fields are sent in the request body

> [post] {url}/login : login a user when the Email and Password fields are sent in the request body, returns access token

> [post] {url}/ticket : adds a ticket to the database where the identity of the user stored from the accesss token, must send an auth bearer token with the request else the server will reject the request

> [get] {url}/ticket : returns all tickets opened by the user that send the jwt, will reject any request without an access token


Immediate required changes:
* The DataBase is currently local and must be migrated to client IP
* The DataBase IP, and the access token secret (to sign jwts) must be moved to a secret environment file
* The Routes return hard-coded values for the fields that have not been implemented yet
* Need to add a blacklist for access-tokens when logouts are implemented 
*Routes need to be renamed (in progress)
*Schema validation needs testing

Entire boilerplate is dockerized currently. 


Superadmin is created by the first call to the API to make a superadmin (further progress required).
To login a super admin, use the OrgId -1