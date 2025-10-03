pipeline {
    agent any
    environment {
        IMAGE = "nikhilpesala/expense-tracker"
        TAG = "${env.BUILD_NUMBER}"
        NETWORK = "expense-net"
        DB_CONTAINER = "postgres"
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build') {
            steps {
                sh "docker build -t ${IMAGE}:${TAG} ."
            }
        }

        stage('Test') {
            steps {
                sh "echo 'No tests yet, add later!'"
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push') {
            steps {
                sh "docker push ${IMAGE}:${TAG}"
                sh "docker tag ${IMAGE}:${TAG} ${IMAGE}:latest"
                sh "docker push ${IMAGE}:latest"
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    # Create network
                    docker network create ${NETWORK} || true

                    # PostgreSQL
                    docker rm -f ${DB_CONTAINER} || true
                    docker run -d --name ${DB_CONTAINER} --network ${NETWORK} -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=expenses -p 5432:5432 postgres:15

                    # Expense app
                    docker rm -f expense-tracker || true
                    docker run -d --name expense-tracker --network ${NETWORK} -p 8085:8080 -e DATABASE_URL='postgresql://postgres:postgres@${DB_CONTAINER}:5432/expenses' ${IMAGE}:latest

                    # Node exporter
                    docker rm -f node-exporter || true
                    docker run -d --name node-exporter --network ${NETWORK} -p 9101:9100 prom/node-exporter:latest

                    # Prometheus
                    docker rm -f prometheus || true
                    docker run -d --name prometheus --network ${NETWORK} -p 9090:9090 -v ${WORKSPACE}/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus

                    # Grafana
                    docker rm -f grafana || true
                    docker run -d --name grafana --network ${NETWORK} -p 3000:3000 grafana/grafana
                """
            }
        }
    }
}
