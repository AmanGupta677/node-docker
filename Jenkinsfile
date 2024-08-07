pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "amangupta677/node-app:${env.BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps {
                sh 'echo passed'
                git branch: 'main', url: 'https://github.com/AmanGupta677/node-docker.git'
            }
        }
        stage('Build and Test') {
            agent {
                docker {
                    image 'amangupta677/node-app:latest'
                    args '--user root -v /var/run/docker.sock:/var/run/docker.sock'
                }
            }
            stages {
                stage('Install dependencies') {
                    steps {
                        sh 'npm install'
                    }
                }
            }
        }
        // stage('Static Code Analysis') {
        //     environment {
        //         SONAR_URL = "http://54.234.220.252:9000"
        //     }
        //     steps {
        //         withCredentials([string(credentialsId: 'sonarqube', variable: 'SONAR_AUTH_TOKEN')]) {
        //             sh "-Dsonar.host.url=${SONAR_URL} \
        //                 -Dsonar.login=$SONAR_AUTH_TOKEN"
        //         }
        //     }
        // }
        stage('Build and Push Docker Image') {
            environment {
                REGISTRY_CREDENTIALS = credentials('docker-cred')
            }
            steps {
                script {
                    sh 'docker build -t ${DOCKER_IMAGE} .'
                    def dockerImage = docker.image("${DOCKER_IMAGE}")
                    docker.withRegistry('https://index.docker.io/v1/', "docker-cred") {
                        dockerImage.push()
                    }
                }
            }
        }
        stage('Update Deployment File') {
            environment {
                GIT_REPO_NAME = "node-docker"
                GIT_USER_NAME = "AmanGupta677"
            }
            steps {
                withCredentials([string(credentialsId: 'github', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                    git config user.email "aman.xyz@gmail.com"
                    git config user.name "Aman Gupta"
                    sed -i "s/replaceImageTag/${BUILD_NUMBER}/g" node_docker_manifest/deployment.yml
                    git add node_docker_manifest/deployment.yml
                    git commit -m "Update deployment image to version ${BUILD_NUMBER}"
                    git push https://${GITHUB_TOKEN}@github.com/${GIT_USER_NAME}/${GIT_REPO_NAME} HEAD:main
                    '''
                }
            }
        }
    }
}
