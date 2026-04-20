pipeline {
    agent any

    stages {

        stage('1. Source') {
            steps {
                git branch: 'main', url: 'https://github.com/Tanish131/fullstack-taskmanager.git'
            }
        }

        stage('2. Build (Install Dependencies)') {
            steps {
                sh 'cd backend && npm install'
            }
        }

        stage('3. Test (Jest)') {
            steps {
                sh '''
                cd backend
                npm test > test-report.txt
                '''
            }
        }

        stage('4. Security (npm audit)') {
            steps {
                sh '''
                cd backend
                npm audit --json > npm-audit-report.txt || true
                '''
            }
        }

        stage('5. Code Quality (SonarQube)') {
            steps {
                withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                    docker run --rm \
                    -v $WORKSPACE:/usr/src \
                    sonarsource/sonar-scanner-cli \
                    sonar-scanner \
                    -Dsonar.projectKey=taskmanager \
                    -Dsonar.sources=backend \
                    -Dsonar.host.url=http://host.docker.internal:9000 \
                    -Dsonar.token=$SONAR_TOKEN \
                    -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
                    '''
                }
            }
        }

        stage('6. Package (Docker Build)') {
            steps {
                sh '''
                docker build -t taskmanager-app .
                docker images > docker-images.txt
                '''
            }
        }

        stage('7. Container Security (Trivy)') {
            steps {
                sh '''
                docker run --rm \
                -v /var/run/docker.sock:/var/run/docker.sock \
                aquasec/trivy image taskmanager-app > trivy-report.txt
                '''
            }
        }

        stage('8. Release (Production Artifact)') {
            steps {
                sh '''
                docker tag taskmanager-app taskmanager-app:v1.0
                docker save taskmanager-app:v1.0 > release-image.tar
                '''
            }
        }

        stage('9. Deploy (Clean Deployment)') {
            steps {
                sh '''
                docker stop taskmanager-prod || true
                docker rm taskmanager-prod || true
                docker run -d -p 5003:5001 --name taskmanager-prod taskmanager-app
                docker logs taskmanager-prod > container-logs.txt
                '''
            }
        }

        stage('10. Monitoring Integration') {
            steps {
                sh '''
                echo "Checking metrics endpoint..."
                curl http://host.docker.internal:5003/metrics > monitoring.txt
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.txt, *.tar', fingerprint: true
        }
    }
}
