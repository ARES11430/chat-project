# online chat application

before running make sure to install Mongodb and nodejs on system.

to run back-end server go to the back-end-end directory simply run:
npm run dev

to run front-end server go to the front-end directory simply run:
npm run dev

ENV variables for back-end:

# set the enviroment

ENV= development

# port

PORT=

# databse

DB=
DB_TEST=
DB_FALLBACK=

# tokens secrets

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# URL

FRONT_URL = http://localhost:5173
BACK_END_URL= http://localhost:3000/api/v1/

#

#

ENV variables for front-end:
VITE_BACK_END_URL= http://localhost:3000/api/v1/

VITE_BACK_END_SOCKET= http://localhost:3000

VITE_CRYPTO_SECRET_KEY=
