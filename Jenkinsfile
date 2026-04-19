pipeline {
    agent any

    stages {

        stage('1. Source') {
            steps {
                git branch: 'main', url: 'https://github.com/Tanish131/fullstack-taskmanager.git'
            }
        }

        stage('2. Install Dependencies') {
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

        stage('4. Dependency Security (npm audit)') {
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
                -v $WORKSPACE:/workspace \
                aquasec/trivy image taskmanager-app > trivy-report.txt
                '''
            }
        }

        stage('8. Release') {
            steps {
                sh 'docker tag taskmanager-app taskmanager-app:v1.0'
            }
        }

        stage('9. Deployment') {
            steps {
                sh '''
                docker run -d -p 5003:5001 --name taskmanager-prod taskmanager-app || true
                docker logs taskmanager-prod > container-logs.txt
                '''
            }
        }

        stage('10. System Info (Bonus)') {
            steps {
                sh '''
                uname -a > system-info.txt
                df -h >> system-info.txt
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.txt', fingerprint: true
        }
    }
}