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

        stage('3. Test (Jest + Supertest + Coverage)') {
            steps {
                sh '''
                cd backend

                echo "Running unit tests with coverage..."
                npx jest --coverage \
                    --coverageReporters=lcov \
                    --coverageReporters=text \
                    2>&1 | tee test-report.txt

                echo "Running integration tests (Supertest)..."
                npx jest --testPathPattern="test" --passWithNoTests \
                    2>&1 | tee integration-test-report.txt
                '''
            }
        }

        stage('4. Security (npm audit)') {
            steps {
                sh '''
                cd backend
                npm audit --json | tee npm-audit-report.txt || true
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
                aquasec/trivy image taskmanager-app | tee trivy-report.txt
                '''
            }
        }

        stage('8. Deploy (Staging/Test)') {
            steps {
                sh '''
                docker stop taskmanager-prod || true
                docker rm taskmanager-prod || true

                docker run -d -p 5003:5001 --name taskmanager-prod taskmanager-app

                docker logs taskmanager-prod > container-logs.txt
                '''
            }
        }

        stage('9. Release (Production Deployment)') {
            steps {
                sh '''
                echo "Releasing to production..."

                docker stop taskmanager-prod-release || true
                docker rm taskmanager-prod-release || true

                docker tag taskmanager-app taskmanager-app:v1.0
                docker run -d -p 6000:5001 --name taskmanager-prod-release taskmanager-app:v1.0

                echo "Production deployment successful"
                '''
            }
        }

        stage('10. Monitoring & Alerting') {
            steps {
                sh '''
                echo "Waiting for application to start..."
                sleep 10

                echo "Checking application metrics..."
                curl -f http://localhost:5003/metrics | tee monitoring.txt || echo "Metrics not available" > monitoring.txt

                echo "Checking Prometheus alerts..."
                curl http://host.docker.internal:9090/api/v1/alerts | tee alerts.txt

                echo "Monitoring and alert verification completed"
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: '*.txt, backend/coverage/**', fingerprint: true
        }
    }
}
