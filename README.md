# Hacker news clone

This is a hacker-news-clone using SolidJS front-end and fastify with trpc plugin backend. All of the posts and comments are being stored in Supabase postgres database. I used two database projects for development and production. Supabase is also being utilized to authenticate users by email magiclinks, Google OAuth, and Github OAuth.

Live site: https://nabil-hacker-news-clone.netlify.app/

#### Example
![post example](images/hacker-news-clone-example.png)


For development, you will use two terminals for front-end and back-end each running ```npm start``` command in ```/client``` and ```/server``` directories.

To run netlify-functions in development, you will need to install netlify client first: https://docs.netlify.com/cli/get-started/. The server can then be started by running ```npm start``` under ```/netlify-functions``` folder. To run ```npm run test-query``` command, you will need to create a ```testQueries.ts``` file directly under ```/netlify-functions``` folder. This file can make fetch calls to ```http://localhost:8888/add-user-dev``` to test the function.

### Hosting services

#### Netlify
For front end and netlify functions, we use netlify to host. The application is deployed directly from Github with this build:
![netlify build](images/netlify-build.png)

```add-user``` is a netlify serverless function which is being called by a webhook from Supabase to automatically generate an username in profile table when an user gets authenticated by Supabase. There are two functions for development and production each. 

#### Supabase webhooks

To create a webhook, go to this page in your Supabase project: https://supabase.com/dashboard/project/_/database/hooks. The webhook should look something like this:
![supabase webhook](images/supabase-webhook.png)
The name of the webhook can be anything. Authorization value in http headers will be randomnly generated characters. Make sure this same value is in netlify project environment variables as ```AUTHORIZATION_KEY```. For development, it will have a separate variable as ```AUTHORIZATION_KEY_DEV```.

### Environment variables needed

#### ENV for the server folder
These values will be different for development and production because there are separate Supabase project databases for each environment.

```NODE_ENV``` = "development" or "production"

```DATABASE_URL```
Copy the connection string and pass the password you used to create the database into the connection string.
![connection string](images/connection-string.png)

```PROJECT_URL```
![project url](images/project-url.png)

```SUPABASE_KEY```
This is in API under settings in Supabase. This is under the same settings as the PROJECT_URL is in.
![alt text](images/supabase-key.png)

#### ENV for the netlify-functions folder.

```SUPABASE_KEY``` and ```SUPABASE_KEY_DEV``` have the same values as in the server ENV for production and development respectively.
```PROJECT_URL``` and ```PROJECT_URL_DEV``` have the same values as in the server ENV for production and development respectively.
```AUTHORIZATION_KEY``` and ```AUTHORIZATION_KEY_DEV``` are randomnly generated characters used to authorize webhook calls. See more under "Supabase webhooks" section earlier.
