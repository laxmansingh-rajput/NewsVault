pipeline {
    agent { label 'agent' }

    stages {
        stage('Hello') {
            steps {
                echo 'Hello World'
            }
        }

        stage('Cloning the latest Repo') {
            steps {
                checkout scmGit(
                    branches: [[name: '*/main']],
                    extensions: [],
                    userRemoteConfigs: [[
                        credentialsId: 'git_id',
                        url: 'https://github.com/laxmansingh-rajput/Gyan.git'
                    ]]
                )
            }
        }

        stage('Injecting enviornment variables') {
            steps {
                withCredentials([file(credentialsId: 'backendEnv', variable: 'secretFile')]) {
                    sh "cp  -f \$secretFile /home/ubuntu/workspace/Gyan/backend"
                }

                withCredentials([file(credentialsId: 'frontendEnv', variable: 'secretFile')]) {
                    sh "cp -f \$secretFile /home/ubuntu/workspace/Gyan/"
                }
            }
        }
        stage('Build Docker Images') {
            steps {
                sh """
                cd /home/ubuntu/workspace/Gyan
                docker-compose build
                docker images
                """
            }
        }
        
        stage('Store on Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub',
                        usernameVariable: 'dockeruser',
                        passwordVariable: 'dockerPass')]) {

                    script {
                        def version = env.BUILD_NUMBER   

                        sh """
                            docker login -u ${dockeruser} -p ${dockerPass}

                            docker tag Gyan-frontend laxmansinghrajput/newsvaultfrontend-jenkins:${version}
                            docker tag Gyan-backend  laxmansinghrajput/newsvaultbackend-jenkins:${version}

                            docker push laxmansinghrajput/newsvaultfrontend-jenkins:${version}
                            docker push laxmansinghrajput/newsvaultbackend-jenkins:${version}
                        """
                    }
                }
            }
        }

        stage('Deploying') {
            steps {
                sh """
                docker-compose up -d
                """
            }
        }
    }
}

