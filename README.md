# Firebase React Website Deployment Guide

Difficulty: 🟥🟥◻️◻️◻️  - Beginner (Level 2)

This guide will walk you through the process of setting up and deploying a Firebase React website.

## Prerequisites

Before you begin, make sure you have the following:

- [Node.js](https://nodejs.org/en) is installed on your machine.

## Step 1: Get the template

Use one of the two options to use this template.

1. Copy the template
- Open the [Template Page](https://github.com/new?template_name=ReactFirebaseTemplate&template_owner=MScheiterle)
- Sign in if needed and name your new repository
- Click the `Create repository` button

2. Fork the repository
- Open the [Project Repo](https://github.com/MScheiterle/ReactFirebaseTemplate)
- Sign in if needed and name your new repository
- Click `Create fork`

Now clone the repository you just made
- Open your terminal and navigate to the desired directory where you want to clone the repository.
- Run the following command to clone the GitHub repository (Link Example: `https://github.com/MScheiterle/ReactFirebaseTemplate.git`):

```git clone <YOUR_REPOSITORY_GIT_LINK>```

## Step 2: Set up a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project name and add it to your Google account.
2. When it is done provisioning resources, select the `</>` symbol to create a web app.
3. Follow the instructions to register your app and obtain your Firebase configuration object.
4. Ensure you get the Firebase configuration, if you don't you can get it from the `Project settings` page at the bottom in the `Your apps` section.

## Step 3: Configure Firebase in your React App

1. Create a file in the main project directory named ```.env.local```. This will prevent sensitive project information from being uploaded to GitHub.
2. Paste each token of the Firebase configuration using the following format

```
REACT_APP_FIREBASE_API_KEY = YOUR_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN = YOUR_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID = YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET = YOUR_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID = YOUR_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID = YOUR_APP_ID
REACT_APP_FIREBASE_MEASURE_ID = YOUR_MEASURE_ID
```

## Step 4: Customize your React App

1. Initialize your Firebase project by running the following command in the project directory:

```firebase init```

- Select the Firebase features you want to set up.
- Choose your Firebase project from the list.
- Specify your build directory as build.
- Configure as a single page if you only want one page.
- Overwrite index.html: No.

2. Replace all code within the `firebase.json` file with the following code if it's not already done:

```
{
  "hosting": {
    "public": "build",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  },
  "emulators": {
    "hosting": {
      "port": 5000
    },
    "ui": {
      "enabled": true
    },
    "singleProjectMode": true
  }
}
```

In the event that you are adding another web app to a project that already has one, you will need to specify the web app name in the above code. It should look something like this:

```
"hosting": {
    "site": "YOUR_SITE_NAME",
    "public": "build",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
  },
```

## Step 5: Deploy to Firebase

Use one of the below options to deploy the React App to your Firebase project

- Deploy your app to Firebase Hosting with the following command:

Although I prefer to use the Github option I added this one for all those who don't prefer Github, I am **NOT** certain if `.env.local` environment variables will be transferred to the Firebase machine so if your `firebase.ts` file isn't working or you get an error in console saying it doesn't have an API_KEY that may be why.

```npm run deploy```

- Push to GitHub

This will only work if you added GitHub workflows to the React App when you ran the Firebase init command

Within the workflow files `firebase-hosting-merge.yml` and `firebase-hosting-pull-request.yml` add the following above the jobs section:

```
env:
  REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
  REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
  REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
  REACT_APP_FIREBASE_MEASURE_ID: ${{ secrets.REACT_APP_FIREBASE_MEASURE_ID }}
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
  REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
  REACT_APP_FIREBASE_STORAGE_BUCKET: ${{secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
```

Then change the given command `- run: npm ci && npm run build` to `- run: npm i && npm run build`

Then, if you added the Pull Request workflow add the line `permissions: write-all` like in this example:

```
build_and_preview:
    if: "${{ github.event.pull_request.head.repo.full_name == github.repository }}"
    runs-on: ubuntu-latest
    permissions: write-all
    steps:
      - uses: actions/checkout@v4
```

Finally, inside your GitHub project, you must add the environment secrets

1. Go to your Github account and navigate to the repository of your project

2. Find `Settings` then `Secrets and variables`

3. Now add the following to the `Repository Secrets` using the bright green `New repository secret` button in the top right, make sure to **NOT** add them to `Environment secrets`

- name: ```REACT_APP_FIREBASE_API_KEY``` secret: `YOUR_API_KEY`

- name: ```REACT_APP_FIREBASE_AUTH_DOMAIN``` secret: `YOUR_AUTH_DOMAIN`

- name: ```REACT_APP_FIREBASE_PROJECT_ID``` secret: `YOUR_PROJECT_ID`

- name: ```REACT_APP_FIREBASE_STORAGE_BUCKET``` secret: `YOUR_STORAGE_BUCKET`

- name: ```REACT_APP_FIREBASE_MESSAGING_SENDER_ID``` secret:  `YOUR_MESSAGING_SENDER_ID`

- name: ```REACT_APP_FIREBASE_APP_ID``` secret: `YOUR_APP_ID`

- name: ```REACT_APP_FIREBASE_MEASURE_ID``` secret: `YOUR_MEASURE_ID`

## Conclusion and Disclaimer

- Just so it's out there when I say something like `YOUR_API_KEY`, I mean you should change that to your Firebase API_KEY given to you in the Firebase project config.

- The `firebase.json` file assumes you have set up your **Firestore Rules** correctly so that it can access the necessary documents following the example for public and private records.

```
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userID} {
      allow create: if !exists(/databases/$(database)/documents/users/$(userID));m
      allow read, write: if request.auth != null && request.auth.uid == userID;

    	match /public/{docuement=**} {
      	allow read;
        allow write: if request.auth != null && request.auth.uid == get(/databases/$(database)/documents/users/$(userID)/private/privateUserRecords).data.uid;
        allow create;
      }
      
      match /private/{docuement=**} {
      	allow read, write: if request.auth != null && request.auth.uid == resource.data.uid;
        allow create;
    	}
    }
  }
}

```

- The `firebase.ts` file also is limited to `Documents > collection > document > collection > document > field` in the following format example:
```
+------------------------------+
|            Users             |  <- Collection
+------------------------------+
|                              |
| +--------------------------+ |
| |           User           | |  <- Document
| +--------------------------+ |
| |                          | |
| | +---------------------+  | |
| | |       Public        |  | |  <- Collection
| | +---------------------+  | |
| | | +-----------------+ |  | |
| | | |publicUserRecords| |  | |  <- Document
| | | +-----------------+ |  | |
| | | |     Username    | |  | |  <- Field
| | | | Profile Picture | |  | |  <- Field
| | | +-----------------+ |  | |
| | +---------------------+  | |
| |                          | |
| | +----------------------+ | |
| | |       Private        | | |  <- Collection
| | +----------------------+ | |
| | | +------------------+ | | |
| | | |privateUserRecords| | | |  <- Document
| | | +------------------+ | | |
| | | |       Email      | | | |  <- Field
| | | |        IP        | | | |  <- Field
| | | |      Birthday    | | | |  <- Field
| | | +------------------+ | | |
| | +----------------------+ | |
| +--------------------------+ |
+------------------------------+
```

- Any questions can be directed to Simpl1f1ed on Discord or to the issues area in Github.
